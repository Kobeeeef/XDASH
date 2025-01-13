package org.kobe.xbot.xdashbackend.utilities;

import org.kobe.xbot.xdashbackend.entities.Architecture;
import org.kobe.xbot.xdashbackend.entities.DockerProgress;
import org.kobe.xbot.xdashbackend.entities.DockerStep;
import org.kobe.xbot.xdashbackend.entities.FormattedByteResult;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class DockerManager {

    private static final XDashLogger logger = XDashLogger.getLogger();

    private static File buildAndSaveImageAsTarWithBuildx(String dockerfileDirPath, String imageName, String tarFileLocation, Consumer<DockerProgress> progressConsumer, String architecture) {
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
                    architecture, imageName, tarFileLocation, dockerfileDirPath);

            progressConsumer.accept(new DockerProgress("Starting Buildx build... Command: " + buildCommand, DockerStep.STARTING, 0).setFinished(false));

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


    public static File buildTARImage(String dockerfileDirPath, String imageName, String tarDirectory, Consumer<DockerProgress> progressConsumer, String architecture) {
        return buildAndSaveImageAsTarWithBuildx(dockerfileDirPath, imageName + ":latest", (tarDirectory + "/" + imageName + ".tar").toLowerCase(), progressConsumer, architecture);
    }

    public static void loadDockerImage(String imageUrl, int timeoutMs, BiConsumer<String, Double> progressConsumer) throws IOException, InterruptedException {
        // Connect to the URL
        progressConsumer.accept("Starting process to load Docker image from: " + imageUrl, 0.0);
        URL url = new URL(imageUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        // Set connection and read timeouts
        connection.setConnectTimeout(timeoutMs); // Connect timeout in milliseconds
        connection.setReadTimeout(timeoutMs); // Read timeout in milliseconds

        connection.connect();

        int responseCode = connection.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
            throw new IOException("Failed to connect to URL: " + imageUrl + " - Response code: " + responseCode);
        }
        progressConsumer.accept("Successfully connected to the URL: " + imageUrl, 0.0);

        int contentLength = connection.getContentLength();
        if (contentLength == -1) {
            throw new IOException("Unable to determine content length from URL: " + imageUrl);
        }
        FormattedByteResult formattedByteResult = Utilities.formatBytes(contentLength, true);
        progressConsumer.accept("Retrieved content length: " + formattedByteResult, 0.0);

        progressConsumer.accept("Preparing to execute Docker load command...", 0.0);
        ProcessBuilder processBuilder = new ProcessBuilder("docker", "load");
        Process process = processBuilder.start();

        try (InputStream inputStream = connection.getInputStream();
             OutputStream outputStream = process.getOutputStream()) {

            byte[] buffer = new byte[1024 * 8];
            int bytesRead;
            long totalBytesRead = 0;
            long lastReportedBytes = 0;
            long stepSize = contentLength / 105; // Report every 1% of progress

            // Stream data from the URL to Docker
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
                totalBytesRead += bytesRead;

                // Update progress at defined intervals
                if (totalBytesRead - lastReportedBytes >= stepSize) {
                    double percentage = (totalBytesRead / (double) contentLength) * 100;
                    progressConsumer.accept(String.format("Transferring data to Docker: %.2f%% complete", percentage), Utilities.roundToDecimalPlaces(percentage, 3));
                    lastReportedBytes = totalBytesRead;
                }
            }
            progressConsumer.accept("Data transfer to Docker completed", 99.0);
        }

        // Wait for the process to complete
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            try (InputStream errorStream = process.getErrorStream()) {
                String errorMessage = new String(errorStream.readAllBytes());
                throw new IOException("Docker load command failed with error: " + errorMessage);
            }
        }

        progressConsumer.accept("Docker image loaded successfully into the system.", 100.0);
    }

}
