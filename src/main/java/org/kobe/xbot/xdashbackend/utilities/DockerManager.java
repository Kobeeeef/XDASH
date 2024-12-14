package org.kobe.xbot.xdashbackend.utilities;

import org.kobe.xbot.xdashbackend.entities.Architecture;
import org.kobe.xbot.xdashbackend.entities.DockerProgress;
import org.kobe.xbot.xdashbackend.entities.DockerStep;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.function.Consumer;

public class DockerManager {

    private static final XDashLogger logger = XDashLogger.getLogger();

    private static File buildAndSaveImageAsTarWithBuildx(String dockerfileDirPath, String imageName, String tarFileLocation, Consumer<DockerProgress> progressConsumer, Architecture architecture) {
        try {
            File dockerfileDir = new File(dockerfileDirPath);
            if (!dockerfileDir.exists() || !dockerfileDir.isDirectory()) {
                throw new IllegalArgumentException("Dockerfile directory is invalid: " + dockerfileDirPath);
            }
            File tarDir = new File(tarFileLocation).getParentFile();
            if (tarDir != null && !tarDir.exists()) {
                progressConsumer.accept(new DockerProgress("Could not find directory for tar file. Creating one now: " + tarDir.getAbsolutePath(), DockerStep.STARTING, 0).setFinished(false));
                boolean dirCreated = tarDir.mkdirs();
                if (!dirCreated) {
                    progressConsumer.accept(new DockerProgress("Failed to create directory for tar file: " + tarDir.getAbsolutePath(), DockerStep.ERROR, 0).setFinished(false));
                    throw new IOException("Failed to create directory for tar file: " + tarDir.getAbsolutePath());
                } else {
                    progressConsumer.accept(new DockerProgress("Successfully created directory for tar file: " + tarDir.getAbsolutePath(), DockerStep.STARTING, 0).setFinished(false));
                }
            }
            // Command to build and save with Buildx
            String buildCommand = String.format(
                    "docker buildx build --platform %s -t %s -o type=docker,dest=%s %s",
                    architecture.getBuildxPlatform(), imageName, tarFileLocation, dockerfileDirPath);

            progressConsumer.accept(new DockerProgress("Starting Buildx build...", DockerStep.STARTING, 0).setFinished(false));

            ProcessBuilder processBuilder = new ProcessBuilder(buildCommand.split(" "));
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;

                while ((line = reader.readLine()) != null) {
                    if (line.toLowerCase().contains("error"))
                        progressConsumer.accept(new DockerProgress(line, DockerStep.ERROR, 0));
                    else
                        progressConsumer.accept(new DockerProgress(line, DockerStep.BUILDING, 0));
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Buildx build failed with exit code: " + exitCode);
            }
            File file = new File(tarFileLocation);
            progressConsumer.accept(new DockerProgress("Buildx build completed. Successfully created image tar file: " + file.getAbsolutePath(), DockerStep.FINISHED, 100).setFinished(true));

            return file;

        } catch (Exception e) {
            progressConsumer.accept(new DockerProgress("Error occurred during Buildx build: " + e.getMessage(), DockerStep.ERROR, 0).setFinished(true));
            return null;
        }
    }


    public static File buildTARImage(String dockerfileDirPath, String imageName, String tarDirectory, Consumer<DockerProgress> progressConsumer, Architecture architecture) {
        return buildAndSaveImageAsTarWithBuildx(dockerfileDirPath, imageName + ":latest", (tarDirectory + "/" + imageName + ".tar").toLowerCase(), progressConsumer, architecture);
    }
}
