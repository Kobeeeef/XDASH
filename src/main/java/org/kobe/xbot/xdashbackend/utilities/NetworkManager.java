package org.kobe.xbot.xdashbackend.utilities;

import org.kobe.xbot.xdashbackend.entities.StatusMessageCode;
import org.kobe.xbot.xdashbackend.entities.Wifi;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;


// NetworkManager class to handle Wi-Fi scanning
public class NetworkManager {


    // Method to detect OS and scan Wi-Fi networks
    public static List<Wifi> scanNetworks() {
        String os = System.getProperty("os.name").toLowerCase();
        List<Wifi> wifiList = new ArrayList<>();

        if (os.contains("win")) {
            // For Windows
            wifiList = scanWindows();
        } else if (os.contains("nix") || os.contains("nux") || os.contains("mac")) {
            // For Linux or Mac OS
            wifiList = scanLinux();
        } else {
            System.out.println("Unsupported OS");
        }

        return wifiList;
    }

    public static void connectWifi(String ssid, Consumer<StatusMessageCode> updates) {
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win")) {
            connectWindows(ssid, updates);
        } else if (os.contains("nix") || os.contains("nux") || os.contains("mac")) {
            connectLinux(ssid, updates);
        } else {
            updates.accept(new StatusMessageCode(false, "Incompatible operating system.").setFinished(true));
        }
    }

    private static void connectWindows(String ssid, Consumer<StatusMessageCode> updates) {
        boolean success = false;
        try {
            Process process = Runtime.getRuntime().exec(String.format("netsh wlan connect name=\"%1$s\"", ssid));
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.contains("success")) {
                    reader.close();
                    success = true;
                    updates.accept(new StatusMessageCode(true, line).setFinished(false));
                    break;
                }
                updates.accept(new StatusMessageCode(null, line).setFinished(false));
            }
        } catch (IOException e) {
            updates.accept(new StatusMessageCode(false, e.getMessage()).setFinished(true));
        }finally {
            updates.accept(new StatusMessageCode(success, "Completed connection stage.").setFinished(true));
        }
    }

    private static void connectLinux(String ssid, Consumer<StatusMessageCode> updates) {
        boolean success = false;
        try {
            Process process = Runtime.getRuntime().exec(String.format("nmcli device wifi connect %1$s", ssid));
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.contains("success")) {
                    reader.close();
                    success = true;
                    updates.accept(new StatusMessageCode(true, line).setFinished(false));
                    break;
                }
                updates.accept(new StatusMessageCode(null, line).setFinished(false));
            }

        } catch (IOException e) {
            updates.accept(new StatusMessageCode(false, e.getMessage()).setFinished(true));
        } finally {
            updates.accept(new StatusMessageCode(success, "Completed connection stage.").setFinished(true));
        }
    }

    // Wi-Fi scanning on Windows using netsh
    private static List<Wifi> scanWindows() {
        List<Wifi> wifiList = new ArrayList<>();
        try {
            System.out.println("Scanning for Wi-Fi networks on Windows...");
            Process process = Runtime.getRuntime().exec("netsh wlan show networks mode=bssid");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            String ssid = null, bssid = null, signal = null, security = null;

            while ((line = reader.readLine()) != null) {
                line = line.trim();
                try {
                    if (line.startsWith("SSID ")) {
                        ssid = line.split(":", 2)[1].trim();
                    } else if (line.startsWith("BSSID")) {
                        bssid = line.split(":", 2)[1].trim();
                    } else if (line.startsWith("Signal")) {
                        signal = line.split(":", 2)[1].trim();
                    } else if (line.startsWith("Authentication")) {
                        security = line.split(":", 2)[1].trim();
                    }

                    if (ssid != null && !ssid.isEmpty() && bssid != null && signal != null && security != null) {
                        Integer signalStrength = null;
                        try {
                            signalStrength = Integer.parseInt(signal.replace("%", "").trim());
                        } catch (Exception ignored) {
                        }
                        wifiList.add(new Wifi(ssid, bssid, signalStrength, security));
                        ssid = bssid = signal = security = null; // Reset for next network
                    }
                } catch (Exception ignored) {
                }
            }
        } catch (IOException e) {
            System.out.println("Failed to scan Wi-Fi networks on Windows.");
        }

        return wifiList;
    }

    // Wi-Fi scanning on Linux (or macOS) using nmcli (or iwlist)
    private static List<Wifi> scanLinux() {
        List<Wifi> wifiList = new ArrayList<>();
        try {
            System.out.println("Scanning for Wi-Fi networks on Linux...");
            Process process = Runtime.getRuntime().exec("nmcli device wifi list");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {
                line = line.trim();

                // Skip the header line
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                // Split based on columns; signal column requires a careful split
                List<String> parts = new ArrayList<>(Arrays.stream(line.split("\\s{2,}")).toList());

                if (!parts.get(0).equals("*")) {
                    parts.add(0, "");
                }
                if (parts.size() >= 7) {
                    if (parts.get(2).equals("--")) continue;
                    String ssid = parts.get(2);
                    String bssid = parts.get(1);
                    Integer signal = mapSignalStrength(parts.get(7)); // Signal strength
                    String security = parts.size() > 7 && !parts.get(8).equals("--") ? parts.get(8) : "Open"; // Security
                    boolean isInUse = parts.get(0).equals("*");
                    if (!ssid.isEmpty()) wifiList.add(new Wifi(ssid, bssid, signal, security, isInUse));
                }

            }
        } catch (IOException e) {
            System.out.println("Failed to scan Wi-Fi networks on Linux.");
        }

        return wifiList;
    }

    private static Integer mapSignalStrength(String bars) {
        return switch (bars) {
            case "▂___" -> 0; // Weak signal
            case "▂▄__" -> 33; // Fair signal
            case "▂▄▆_" -> 66; // Good signal
            case "▂▄▆█" -> 100; // Excellent signal
            default -> null; // If the signal strength is unrecognized
        };
    }
}
