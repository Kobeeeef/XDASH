package org.kobe.xbot.xdashbackend.utilities;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.function.Consumer;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class GZIP {

    private static final int BUFFER_SIZE = 8192;

    public static File compress(File inputFile, int level, Consumer<String> updates) throws IOException {
        if (level < 1 || level > 9) {
            throw new IllegalArgumentException("Compression level must be between 1 and 9.");
        }

        File compressedFile = new File(inputFile.getParent(), inputFile.getName() + ".gz");
        updates.accept("Compression started (level " + level + "). File located at: " + compressedFile.getAbsolutePath());
        try (FileInputStream fis = new FileInputStream(inputFile);
             FileOutputStream fos = new FileOutputStream(compressedFile);
             GZIPOutputStream gzos = new GZIPOutputStream(fos) {
                 {
                     def.setLevel(level);
                 }
             }) {

            long totalBytes = inputFile.length();
            long processedBytes = 0;
            byte[] buffer = new byte[BUFFER_SIZE];
            int bytesRead;
            double nextUpdate = 0.008; // Progress update threshold (0.8%)

            while ((bytesRead = fis.read(buffer)) != -1) {
                gzos.write(buffer, 0, bytesRead);
                processedBytes += bytesRead;
                double progress = (double) processedBytes / totalBytes;
                if (progress >= nextUpdate) {
                    updates.accept(String.format("Compression progress: %.2f%%", progress * 100));
                    nextUpdate += 0.008;
                }
            }

            updates.accept("Compression completed. File located at: " + compressedFile.getAbsolutePath());
        }

        return compressedFile;
    }

    public static File decompress(File compressedFile, Consumer<String> updates) throws IOException {
        if (!compressedFile.getName().endsWith(".gz")) {
            throw new IllegalArgumentException("The file does not appear to be a GZIP file.");
        }

        File decompressedFile = new File(compressedFile.getParent(), compressedFile.getName().replaceFirst("\\.gz$", ""));
        updates.accept("Decompression started. File located at: " + decompressedFile.getAbsolutePath());
        try (FileInputStream fis = new FileInputStream(compressedFile);
             GZIPInputStream gzis = new GZIPInputStream(fis);
             FileOutputStream fos = new FileOutputStream(decompressedFile)) {

            long totalBytes = compressedFile.length();
            long processedBytes = 0;
            byte[] buffer = new byte[BUFFER_SIZE];
            int bytesRead;
            double lastUpdate = 0.0; // Last progress percentage

            while ((bytesRead = gzis.read(buffer)) != -1) {
                fos.write(buffer, 0, bytesRead);
                processedBytes += bytesRead;
                double progress = (double) processedBytes / totalBytes;
                if (progress - lastUpdate >= 0.008) {
                    updates.accept(String.format("Compression progress: %.2f%%", progress * 100));
                    lastUpdate = progress;
                }
            }

            updates.accept("Decompression completed. File located at: " + decompressedFile.getAbsolutePath());
        }

        return decompressedFile;
    }
}
