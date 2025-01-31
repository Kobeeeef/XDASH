package org.kobe.xbot.xdashbackend.utilities;

import com.google.gson.Gson;
import org.kobe.xbot.xdashbackend.XdashbackendApplication;
import org.kobe.xbot.xdashbackend.entities.DeviceAddData;
import org.kobe.xbot.xdashbackend.entities.SSHHostAddress;
import org.kobe.xbot.xdashbackend.entities.SubnetScanData;
import org.kobe.xbot.xdashbackend.entities.XCASTERServiceInfo;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;
import org.kobe.xbot.xdashbackend.websocket.WebSocketHandler;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Consumer;

public class NetworkDiscovery {
    private static final AtomicBoolean running = new AtomicBoolean(false);
    private static final XDashLogger logger = XDashLogger.getLogger();
    private static final Gson gson = new Gson();
    private static final AtomicBoolean xcasterScanRunning = new AtomicBoolean(false);
    private static ExecutorService currentExecutor = null;
    private static final ReentrantLock lock = new ReentrantLock();
    private static final ReentrantLock xcasterLock = new ReentrantLock();
    private static final int TIMEOUT = 500; // Timeout for reachability check in milliseconds
    private static final int THREAD_POOL_SIZE = 10; // Number of threads in the executor

    public static String getSubnetBase() {
        try {
            String ip = Utilities.getLocalIPAddress();
            return  ip.substring(0, ip.lastIndexOf('.'));
        } catch (SocketException e) {
            System.err.println("SocketException: " + e.getMessage());
        }
        return null;
    }

    public static void scanSubnet(String subnet) {
        lock.lock();
        try {
            if (running.get()) {
                stopScanSubnet(); // Stop the current scan
            }

            running.set(true);
            currentExecutor = Executors.newFixedThreadPool(THREAD_POOL_SIZE); // Create a new executor for the new scan
            List<CompletableFuture<Void>> completableFutures = new ArrayList<>();
            for (int i = 1; i < 255; i++) {
                if (!running.get()) {
                    break;
                }
                final int hostId = i;
                completableFutures.add(CompletableFuture.runAsync(() -> {
                    if (!running.get() || Thread.currentThread().isInterrupted()) return;
                    String host = subnet + "." + hostId;
                    WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("Checking " + host, running.get(), host, null, null, "CHECKING"), "NETWORK-SUBNET-SCAN");
                    InetAddress address = checkReachable(host);
                    if (!Thread.currentThread().isInterrupted()) {
                        if (address != null) {
                            WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The device was found at " + address.getHostAddress(), running.get(), address.getHostAddress(), address.getHostName(), subnet, "FOUND"), "NETWORK-SUBNET-SCAN");
                        } else {
                            WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The device could not be found at: " + host, running.get(), host, null, subnet, "UNAVAILABLE"), "NETWORK-SUBNET-SCAN");
                        }
                    }
                }, currentExecutor));
            }
            CompletableFuture<Void> allOf = CompletableFuture.allOf(completableFutures.toArray(new CompletableFuture[0]));
            Consumer<Void> allTasksCompleted = v -> WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The subnet scan has been completed.", running.get(), null, null, subnet, "FINISHED"), "NETWORK-SUBNET-SCAN");
            allOf.thenAccept(allTasksCompleted)
                    .thenRun(NetworkDiscovery::stopScanSubnet);
        } finally {
            lock.unlock();
            WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("All scans have been queued.", running.get(), null, null, subnet, "QUEUED"), "NETWORK-SUBNET-SCAN");
        }
    }

    public static void scanForXCASTERSubnet(String subnet, int low, int high, int threads, int port) {
        xcasterLock.lock();
        try {
            if (xcasterScanRunning.get()) {
                stopXCASTERScanSubnet(); // Stop the current scan
            }
            low = Math.max(1, low);
            high = Math.min(500, high);
            xcasterScanRunning.set(true);
            currentExecutor = Executors.newFixedThreadPool(threads); // Create a new executor for the new scan
            List<CompletableFuture<Void>> completableFutures = new ArrayList<>();
            XdashbackendApplication.getConfigLoader().setPropertyList("servers.constant", new ArrayList<>());
            XdashbackendApplication.getConfigLoader().save();
            for (int i = low; i < high; i++) {
                if (!xcasterScanRunning.get()) {
                    break;
                }
                final int hostId = i;
                completableFutures.add(CompletableFuture.runAsync(() -> {
                    if (!xcasterScanRunning.get() || Thread.currentThread().isInterrupted()) return;
                    String host = subnet + "." + hostId + ":" + port + "/serviceInfo";
                    WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("Checking " + host, xcasterScanRunning.get(), host, null, null, "CHECKING"), "XCASTER-SUBNET-SCAN");
                    XCASTERServiceInfo xcaster = getXCASTERFromServerWithTimeout(host);
                    if (!Thread.currentThread().isInterrupted()) {
                        if (xcaster != null) {
                            String address = subnet + "." + hostId;
                            WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The device was found at " + address, xcasterScanRunning.get(), address, xcaster.getHostname(), subnet, "FOUND").setUsername(xcaster.getUsername()).setPassword(xcaster.getPassword()), "XCASTER-SUBNET-SCAN");
                            if (XdashbackendApplication.getResolvedXCASTERServices().values().stream().noneMatch(m -> m.getAddress().equals(address))) {
                                SSHHostAddress sshHostAddress = new SSHHostAddress(xcaster.getHostname(), xcaster.getUsername(), xcaster.getPassword(), address, xcaster.getServer());
                                SSHHostAddress previous = XdashbackendApplication.getResolvedXCASTERServices().put(xcaster.getServer(), sshHostAddress);
                                if (previous == null) {
                                    List<String> machines = new ArrayList<>(XdashbackendApplication.getConfigLoader().getPropertyList("servers.constant"));
                                    machines.add(gson.toJson(new DeviceAddData(xcaster.getHostname(), address, xcaster.getUsername(), xcaster.getPassword())));
                                    XdashbackendApplication.getConfigLoader().setPropertyList("servers.constant", machines);
                                    XdashbackendApplication.getConfigLoader().save();
                                } else {
                                    try {
                                        List<String> machines = new ArrayList<>(XdashbackendApplication.getConfigLoader().getPropertyList("servers.constant"));
                                        for (int j = 0; j < machines.size(); j++) {
                                            DeviceAddData existingData = gson.fromJson(machines.get(j), DeviceAddData.class);
                                            if (existingData.getHostname().equals(xcaster.getHostname())) {
                                                machines.set(j, gson.toJson(new DeviceAddData(xcaster.getHostname(), address, xcaster.getUsername(), xcaster.getPassword())));
                                                break;
                                            }
                                        }
                                        XdashbackendApplication.getConfigLoader().setPropertyList("servers.constant", machines);
                                        XdashbackendApplication.getConfigLoader().save();
                                    } catch (Exception e) {
                                        logger.severe("Error while saving servers.constant: " + e.getMessage());
                                    }
                                }
                            }
                        } else {
                            WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The device could not be found at: " + host, xcasterScanRunning.get(), host, null, subnet, "UNAVAILABLE"), "XCASTER-SUBNET-SCAN");
                        }
                    }
                }, currentExecutor));
            }
            CompletableFuture<Void> allOf = CompletableFuture.allOf(completableFutures.toArray(new CompletableFuture[0]));
            Consumer<Void> allTasksCompleted = v -> WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The XCASTER scan has been completed.", xcasterScanRunning.get(), null, null, subnet, "FINISHED"), "XCASTER-SUBNET-SCAN");
            allOf.thenAccept(allTasksCompleted)
                    .thenRun(NetworkDiscovery::stopXCASTERScanSubnet);
        } finally {
            xcasterLock.unlock();
            WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("All XCASTER scans have been queued.", xcasterScanRunning.get(), null, null, subnet, "QUEUED"), "XCASTER-SUBNET-SCAN");
        }
    }

    public static void stopXCASTERScanSubnet() {
        xcasterLock.lock();
        try {
            WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The XCASTER scanner is being shutdown. Please wait.", xcasterScanRunning.get(), null, null, null, "STOPPING"), "XCASTER-SUBNET-SCAN");
            xcasterScanRunning.set(false);
            if (currentExecutor != null) {
                currentExecutor.shutdown();
                try {
                    if (!currentExecutor.awaitTermination(10, TimeUnit.SECONDS)) {
                        WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The executor service did not terminate.", xcasterScanRunning.get(), null, null, null, "FAILED"), "XCASTER-SUBNET-SCAN");
                    }
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                currentExecutor = null;
            }
        } finally {
            WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The XCASTER scanner has been shutdown.", xcasterScanRunning.get(), null, null, null, "SHUTDOWN"), "XCASTER-SUBNET-SCAN");
            xcasterLock.unlock();
        }
    }

    public static boolean isScanning() {
        return running.get();
    }

    public static boolean isXCASTERScanning() {
        return xcasterScanRunning.get();
    }

    public static void stopScanSubnet() {
        lock.lock();
        try {
            WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The subnet scanner is being shutdown. Please wait.", running.get(), null, null, null, "STOPPING"), "NETWORK-SUBNET-SCAN");
            running.set(false);
            if (currentExecutor != null) {
                currentExecutor.shutdown();
                try {
                    if (!currentExecutor.awaitTermination(10, TimeUnit.SECONDS)) {
                        WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The executor service did not terminate.", running.get(), null, null, null, "FAILED"), "NETWORK-SUBNET-SCAN");
                    }
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                currentExecutor = null;
            }
        } finally {
            WebSocketHandler.getBroadcastService().queueBroadcast(new SubnetScanData("The subnet scanner has been shutdown.", running.get(), null, null, null, "SHUTDOWN"), "NETWORK-SUBNET-SCAN");
            lock.unlock();
        }
    }

    public static InetAddress checkReachable(String host) {
        try {
            InetAddress inet = InetAddress.getByName(host);
            if (inet.isReachable(TIMEOUT)) {
                return inet;
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    public static XCASTERServiceInfo getXCASTERFromServerWithTimeout(String host) {
        try {
            if (!host.startsWith("http://")) {
                host = "http://" + host;
            }
            URL url = new URL(host);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(TIMEOUT);
            connection.setReadTimeout(TIMEOUT);

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String inputLine;
                StringBuilder content = new StringBuilder();
                while ((inputLine = in.readLine()) != null) {
                    content.append(inputLine);
                }
                in.close();
                return gson.fromJson(content.toString(), XCASTERServiceInfo.class);
            }
        } catch (Exception e) {
        }
        return null;
    }
}
