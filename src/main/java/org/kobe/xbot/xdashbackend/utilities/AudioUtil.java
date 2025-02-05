package org.kobe.xbot.xdashbackend.utilities;

import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import java.net.URL;

public class AudioUtil {

    /**
     * Plays the audio file specified by the resource path.
     *
     * @param resourcePath The path to the audio file (e.g., "/audio/success.wav")
     */
    private static void playSound(String resourcePath) {
        try {
            // Load the audio file from the resources folder
            URL soundURL = AudioUtil.class.getResource(resourcePath);
            if (soundURL == null) {
                System.err.println("Audio file not found: " + resourcePath);
                return;
            }

            // Obtain an audio input stream from the URL
            AudioInputStream audioStream = AudioSystem.getAudioInputStream(soundURL);

            // Get a sound clip resource and open the audio stream
            Clip clip = AudioSystem.getClip();
            clip.open(audioStream);

            // Play the clip
            clip.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Plays the success sound (success.wav) located in resources/audio/.
     */
    public static void playSuccessSound() {
        playSound("/audio/success.wav");
    }

    /**
     * Plays the ding sound (ding.wav) located in resources/audio/.
     */
    public static void playDingSound() {
        playSound("/audio/ding.wav");
    }

    /**
     * Plays the error sound (error.wav) located in resources/audio/.
     */
    public static void playErrorSound() {
        playSound("/audio/error.wav");
    }

    /**
     * Plays the fatal sound (fatal.wav) located in resources/audio/.
     */
    public static void playFatalSound() {
        playSound("/audio/fatal.wav");
    }
}
