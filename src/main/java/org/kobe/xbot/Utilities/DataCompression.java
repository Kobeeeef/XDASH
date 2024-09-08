/*
 * DataCompression class provides methods for data compression using Gzip and Base64 encoding for network transmission.
 *
 * Author: Kobe
 *
 */

package org.kobe.xbot.Utilities;

import org.kobe.xbot.Utilities.Logger.XTablesLogger;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.zip.Deflater;
import java.util.zip.DeflaterOutputStream;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

public class DataCompression {
    private static boolean log = false;
    private static final XTablesLogger logger = XTablesLogger.getLogger();
    private static int compressionLevel = Deflater.DEFLATED;
    private static double speedAverageMS = 1;

    /**
     * Compresses the raw string data and converts it to Base64 format.
     *
     * @param raw The raw string data to be compressed.
     * @return The compressed data in Base64 format.
     */
    public static String compressAndConvertBase64(String raw) {
        byte[] compressedData = compress(raw.getBytes());
        return Base64.getEncoder().encodeToString(compressedData);
    }

    /**
     * Decompresses the Base64-encoded data and converts it back to its original string format.
     *
     * @param base64 The Base64-encoded compressed data.
     * @return The decompressed original string data.
     */
    public static String decompressAndConvertBase64(String base64) {
        byte[] decompressedDataString = Base64.getDecoder().decode(base64);
        byte[] decompressedData = decompress(decompressedDataString);
        if(decompressedData == null) return null;
        return new String(decompressedData);
    }

    /**
     * Gets the average compression speed threshold in milliseconds.
     *
     * @return The average compression speed threshold.
     */
    public static double getSpeedAverageMS() {
        return speedAverageMS;
    }

    /**
     * Sets the average compression speed threshold in milliseconds.
     *
     * @param speedAverageMS The new average compression speed threshold.
     */
    public static void setSpeedAverageMS(double speedAverageMS) {
        DataCompression.speedAverageMS = speedAverageMS;
    }

    public static void disableLog() {
        DataCompression.log = false;
    }

    public static void enableLog() {
        DataCompression.log = true;
    }

    private static byte[] compress(byte[] data) {
        try {
            long startTime = System.nanoTime();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Deflater deflater = new Deflater(compressionLevel);
            DeflaterOutputStream deflaterOutputStream = new DeflaterOutputStream(outputStream, deflater);
            deflaterOutputStream.write(data);
            deflaterOutputStream.close();
            adjustCompressionLevel(System.nanoTime() - startTime);
            return outputStream.toByteArray();
        } catch (IOException e) {
            if (log) logger.severe(e.getMessage());
            return null;
        }
    }

    private static byte[] decompress(byte[] compressedData) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Inflater inflater = new Inflater();
            InflaterInputStream inflaterInputStream = new InflaterInputStream(new ByteArrayInputStream(compressedData), inflater);
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inflaterInputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            inflaterInputStream.close();
            return outputStream.toByteArray();
        } catch (IOException e) {
            if (log) logger.severe(e.getMessage());
            return null;
        }
    }

    private static void adjustCompressionLevel(long elapsed) {
        double ms = elapsed / 1e6;

        if (ms < DataCompression.speedAverageMS) {
            // If compression takes less time than the average, increase compression level
            if (DataCompression.compressionLevel < Deflater.BEST_COMPRESSION) {
                DataCompression.compressionLevel++;
                if (log)
                    logger.info("Compression time (" + ms + " ms) is faster than average. Increasing compression level to: " + DataCompression.compressionLevel);
            }
        } else {
            // If compression takes more time than the average, decrease compression level
            if (DataCompression.compressionLevel > Deflater.NO_COMPRESSION) {
                DataCompression.compressionLevel--;
                if (log)
                    logger.info("Compression time (" + ms + " ms) is slower than average. Reducing compression level to: " + DataCompression.compressionLevel);
            }
        }
    }
}
