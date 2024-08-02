package org.kobe.xbot.xdashbackend.utilities;

import org.kobe.xbot.xdashbackend.entities.SubnetScanData;
import org.kobe.xbot.xdashbackend.websocket.WebSocketHandler;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Consumer;

public class NetworkDiscovery {
    private static final AtomicBoolean running = new AtomicBoolean(false);
    private static ExecutorService currentExecutor = null;
    private static final ReentrantLock lock = new ReentrantLock();
    private static final int TIMEOUT = 500; // Timeout for reachability check in milliseconds
    private static final int THREAD_POOL_SIZE = 10; // Number of threads in the executor

    public static void main(String[] args) {
        String subnet = getSubnetBase();
        if (subnet != null) {
            System.out.println("Detected Subnet: " + subnet);
            scanSubnet(subnet);
        } else {
            System.err.println("Could not determine subnet.");
        }
    }

    public static String getSubnetBase() {
        try {
            Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();

            while (networkInterfaces.hasMoreElements()) {
                NetworkInterface networkInterface = networkInterfaces.nextElement();

                if (networkInterface.isUp() && !networkInterface.isLoopback()) {
                    Enumeration<InetAddress> inetAddresses = networkInterface.getInetAddresses();

                    while (inetAddresses.hasMoreElements()) {
                        InetAddress inetAddress = inetAddresses.nextElement();

                        if (inetAddress.isSiteLocalAddress()) {
                            String ip = inetAddress.getHostAddress();
                            return ip.substring(0, ip.lastIndexOf('.')); // Extract subnet base
                        }
                    }
                }
            }
        } catch (SocketException e) {
            System.err.println("SocketException: " + e.getMessage());
        }
        return null; // Return null if no subnet is detected
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
                    String host = subnet + "." + hostId;
                    WebSocketHandler.broadcast(new SubnetScanData("Checking " + host, running.get(), host, null), "SUBNET-SCAN");
                    InetAddress address = checkReachable(host);
                    if (address != null) {
                        WebSocketHandler.broadcast(new SubnetScanData("The device was found at " + address.getHostAddress(), running.get(), address.getHostAddress(), address.getHostName()), "SUBNET-SCAN");
                    } else {
                        WebSocketHandler.broadcast(new SubnetScanData("The device could not be found at: " + host, running.get(), host, null), "SUBNET-SCAN");
                    }
                }, currentExecutor));
            }
            CompletableFuture<Void> allOf = CompletableFuture.allOf(completableFutures.toArray(new CompletableFuture[0]));
            Consumer<Void> allTasksCompleted = v -> WebSocketHandler.broadcast(new SubnetScanData("The subnet scan has been completed.", running.get(), null, null), "SUBNET-SCAN");
            allOf.thenAccept(allTasksCompleted)
                    .thenRun(NetworkDiscovery::stopScanSubnet);
        } finally {
            lock.unlock();
            WebSocketHandler.broadcast(new SubnetScanData("All scans have been queued.", running.get(), null, null), "SUBNET-SCAN");
        }
    }

    public static void stopScanSubnet() {
        lock.lock();
        try {
            running.set(false);
            if (currentExecutor != null) {
                currentExecutor.shutdownNow();
                try {
                    if (!currentExecutor.awaitTermination(60, TimeUnit.SECONDS)) {
                        System.err.println("Executor service did not terminate");
                        WebSocketHandler.broadcast(new SubnetScanData("The executor service did not terminate.", running.get(), null, null), "SUBNET-SCAN");
                    }
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                currentExecutor = null;
            }
        } finally {
            lock.unlock();
        }
    }

    public static InetAddress checkReachable(String host) {
        try {
            InetAddress inet = InetAddress.getByName(host);
            if (inet.isReachable(TIMEOUT)) {
                return inet;
            }
        } catch (Exception ignored) {}
        return null;
    }
}
