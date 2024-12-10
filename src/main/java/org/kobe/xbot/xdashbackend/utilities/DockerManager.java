package org.kobe.xbot.xdashbackend.utilities;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.BuildImageResultCallback;
import com.github.dockerjava.api.model.BuildResponseItem;
import com.github.dockerjava.api.model.Image;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import org.kobe.xbot.xdashbackend.entities.DockerProgress;
import org.kobe.xbot.xdashbackend.entities.DockerStep;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

public class DockerManager {

    private final DockerClient dockerClient;
    private static final XDashLogger logger = XDashLogger.getLogger();

    public DockerManager() {
        DefaultDockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder().build();
        DockerHttpClient httpClient = new ApacheDockerHttpClient.Builder()
                .dockerHost(config.getDockerHost())
                .sslConfig(config.getSSLConfig())
                .maxConnections(100)
                .connectionTimeout(Duration.ofSeconds(30))
                .responseTimeout(Duration.ofSeconds(45))
                .build();
        this.dockerClient = DockerClientBuilder.getInstance(config).withDockerHttpClient(httpClient).build();
    }


    /**
     * Builds a Docker image from the specified directory and saves it as a .tar file with progress updates.
     *
     * @param dockerfileDirPath The directory containing the Dockerfile.
     * @param imageName         The name of the image.
     * @param tarFileLocation   The location where the Docker image tar file should be saved.
     * @param progressConsumer  A Consumer to receive progress updates.
     */
    private File buildAndSaveImageAsTarWithProgress(String dockerfileDirPath, String imageName, String tarFileLocation, Consumer<DockerProgress> progressConsumer) {
        try {
            File dockerfileDir = new File(dockerfileDirPath);
            if (!dockerfileDir.exists() || !dockerfileDir.isDirectory()) {
                throw new IllegalArgumentException("Dockerfile directory is invalid: " + dockerfileDirPath);
            }
            List<Image> existingImages = dockerClient.listImagesCmd().exec();
            boolean imageExists = existingImages.stream()
                    .anyMatch(image -> image.getRepoTags() != null && Arrays.asList(image.getRepoTags()).contains(imageName));

            if (imageExists) {
                progressConsumer.accept(new DockerProgress("Removing existing image with the same name...", DockerStep.CLEANING, 0).setFinished(false));
                // Remove the existing image
                dockerClient.removeImageCmd(imageName).exec();
                progressConsumer.accept(new DockerProgress("Old image removed.", DockerStep.CLEANING, 0).setFinished(true));
            }
            // Build the Docker image with progress tracking
            progressConsumer.accept(new DockerProgress("Running build command now...", DockerStep.STARTING, 0));
            String imageId = dockerClient.buildImageCmd(dockerfileDir)
                    .withTags(Set.of(imageName))
                    .exec(new BuildImageResultCallback() {
                        private int i = 0;

                        @Override
                        public void onNext(BuildResponseItem item) {
                            super.onNext(item);
                            i++;
                            if (item != null && item.getProgressDetail() != null) {
                                double progress = 0.0;
                                if (item.getProgressDetail().getCurrent() != null && item.getProgressDetail().getTotal() != null) {
                                    progress = (double) item.getProgressDetail().getCurrent() / item.getProgressDetail().getTotal();
                                }
                                progressConsumer.accept(new DockerProgress("Building image...", DockerStep.BUILDING, progress));
                            } else {
                                progressConsumer.accept(new DockerProgress("Building image... Item: " + i, DockerStep.BUILDING, 0));
                            }
                        }

                        @Override
                        public void onComplete() {
                            super.onComplete();
                            // Notify that the build is finished
                            progressConsumer.accept(new DockerProgress("Build completed.", DockerStep.COMPLETED, 100).setFinished(true));
                        }

                        @Override
                        public void onError(Throwable throwable) {
                            super.onError(throwable);
                            progressConsumer.accept(new DockerProgress("Error occurred during image build: " + throwable.getMessage(), DockerStep.ERROR, 0).setFinished(true));
                        }
                    }).awaitImageId(30, TimeUnit.SECONDS);


            if (imageId != null) {
                progressConsumer.accept(new DockerProgress("Saving image...", DockerStep.SAVING, 0).setFinished(false));
                try {
                    File targetFile = new File(tarFileLocation);
                    File parentDir = targetFile.getParentFile();
                    if (parentDir != null && !parentDir.exists()) {
                        parentDir.mkdirs();
                    }
                    try (InputStream imageStream = dockerClient.saveImageCmd(imageId).exec();
                         FileOutputStream fileOutputStream = new FileOutputStream(tarFileLocation);
                         ReadableByteChannel readableByteChannel = Channels.newChannel(imageStream)) {
                        fileOutputStream.getChannel().transferFrom(readableByteChannel, 0, Long.MAX_VALUE);
                        logger.info("A new Docker image was saved at: " + targetFile.getAbsolutePath());
                        progressConsumer.accept(new DockerProgress("Removing temporary image from Docker daemon...", DockerStep.CLEANING, 0).setFinished(true));
                        dockerClient.removeImageCmd(imageId).exec();
                        progressConsumer.accept(new DockerProgress("Image saved at: " + targetFile.getAbsolutePath(), DockerStep.FINISHED, 100).setFinished(true));


                        return targetFile;
                    } catch (IOException e) {
                        progressConsumer.accept(new DockerProgress("Error occurred during image build: " + e.getMessage(), DockerStep.ERROR, 0).setFinished(true));
                        return null;
                    }
                } catch (Exception e) {
                    progressConsumer.accept(new DockerProgress("Unexpected error: " + e.getMessage(), DockerStep.ERROR, 0).setFinished(true));
                    return null;
                }


            } else {
                // Handle the case where the image ID is null
                progressConsumer.accept(new DockerProgress("Failed to retrieve image ID", DockerStep.ERROR, 0).setFinished(true));
                return null;
            }

        } catch (Exception e) {
            progressConsumer.accept(new DockerProgress("Error occurred: " + e.getMessage(), DockerStep.ERROR, 0).setFinished(true));
            return null;
        }
    }

    public File buildTARImage(String dockerfileDirPath, String imageName, Consumer<DockerProgress> progressConsumer) {
        return this.buildAndSaveImageAsTarWithProgress(dockerfileDirPath, imageName + ":latest", "XDASH-DOCKER-IMAGES/" + imageName + ".tar", progressConsumer);
    }

//    public static void main(String[] args) {
//        DockerManager dockerManager = new DockerManager();
//
//        // Example usage with progress updates
//        String dockerfileDir = "docker";  // Directory where your Dockerfile is located
//        String imageName = "test";  // Name for the image
//
//
//        // Print progress to console
//        File file = dockerManager.buildTARImage(dockerfileDir, imageName, System.out::println);
//        System.out.println(file.getAbsolutePath());
//    }
}
