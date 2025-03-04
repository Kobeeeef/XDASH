package org.kobe.xbot.xdashbackend;


import com.formdev.flatlaf.fonts.inter.FlatInterFont;
import com.formdev.flatlaf.fonts.jetbrains_mono.FlatJetBrainsMonoFont;
import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import com.formdev.flatlaf.themes.FlatMacLightLaf;
import org.kobe.xbot.JClient.XTableContext;
import org.kobe.xbot.JClient.XTablesClient;
import org.kobe.xbot.Utilities.Logger.XTablesLogger;
import org.kobe.xbot.xdashbackend.XGRID.XDashServer;
import org.kobe.xbot.xdashbackend.XGRID.XTablesViewer;
import org.kobe.xbot.xdashbackend.entities.Notification;
import org.kobe.xbot.xdashbackend.entities.SSHHostAddress;
import org.kobe.xbot.xdashbackend.entities.TransientServiceInfo;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;
import org.kobe.xbot.xdashbackend.utilities.Utilities;
import org.kobe.xbot.xdashbackend.utilities.XJmDNS;
import org.kobe.xbot.xdashbackend.websocket.WebSocketHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.jmdns.*;
import java.awt.*;
import java.io.IOException;
import java.net.InetAddress;
import java.net.URI;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.logging.Level;

@SpringBootApplication
public class XdashbackendApplication {
    private static final XDashLogger logger = XDashLogger.getLogger();
    public static AtomicReference<XTablesClient> clientRef = new AtomicReference<>(null);
    public static AtomicReference<XTablesViewer> xTablesViewerRef = new AtomicReference<>(null);
    private static final AtomicBoolean lock = new AtomicBoolean(false);
    private static final Map<String, SSHHostAddress> resolvedXCASTERServices = new ConcurrentHashMap<>();
    private static final Map<String, TransientServiceInfo> services = new ConcurrentHashMap<>();
    private static XDashServer server;
    private static XJmDNS xJmDNS;
    private static final ConfigLoader configLoader = new ConfigLoader();

    public static XJmDNS getxJmDNS() {
        return xJmDNS;
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        System.setProperty("java.net.preferIPv4Stack", "true");
        System.setProperty("java.awt.headless", "false");
        System.setProperty("file.encoding", "UTF-8");
        SpringApplication.run(XdashbackendApplication.class, args);
        logger.info("\n" + """                                                                                                                         
                         ███████ ███████  ██████████████████                                                                                                                             \s
                             █████  █████████  ███████   █████                                                                                                                           \s
                               █████  █████   ██████████   █████      ████   ███ ███████      ██████   ██████████    ███████            ████                     ███                     \s
                                █████   ██   █████  █████   █████      ████ ███  █████████  ██████████ ██████████    █████████          ████                ███  ███                     \s
                                 █████  ██  █████    █████   ████       ██████   ███  ████ ████    ████   ███        ███   ███  ██████  ████████   ██████  █████████   █████  █████      \s
                 ████    ████     ████ ████ ████      ████    ████       ████    █████████ ███      ███   ███        ████████  ████ ███ █████████ ████ ████ ███  ████████ ███ ██████     \s
                  ████   █████   █████  ██  █████                       ███████  ███   ███ ████    ████   ███        ███████  ████  ████████  ███████  ████ ███  ███████      ██████     \s
                   ████   █████ █████   ██   █████                    ████  ████ █████████  ██████████    ███        ███ ████  ████████ █████████ ████████  ███  ████ ███████ ███████    \s
                   ██████  █████████  █████   █████                   ███    ███████████       ████       ███        ███   ███   ████    ██████     ████     ██  ███    ████   ████      \s
                     ██████ ███████ █████████   █████                                                                                                                                    \s
                        ███████████████   ███████ ███████                                                                                                                                                                                                                                                                                                \s
                \s""");
        FlatMacDarkLaf.setup();
        FlatMacLightLaf.setup();
        FlatJetBrainsMonoFont.install();
        FlatInterFont.install();
        server = new XDashServer();
        server.start();

        xJmDNS = new XJmDNS();
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            logger.info("Shutting down XJmDNS..");
            try {
                xJmDNS.close();
                logger.info("XJmDNS unregistered and closed .");
                server.interrupt();
            } catch (Exception e) {
                logger.fatal("FAILED TO SHUTDOWN MDNS: " + e.getMessage());
            }
        }));
        xJmDNS.addServiceTypeListener(new ServiceTypeListener() {
            @Override
            public void serviceTypeAdded(ServiceEvent serviceEvent) {
                xJmDNS.addServiceListener(serviceEvent.getType(), new ServiceListener() {
                    @Override
                    public void serviceAdded(ServiceEvent event) {
                        services.putIfAbsent(event.getName(), new TransientServiceInfo(event.getName()));
                        xJmDNS.getJmDNS().requestServiceInfo(event.getType(), event.getName());
                    }

                    @Override
                    public void serviceRemoved(ServiceEvent event) {
                        services.remove(event.getName());
                    }

                    @Override
                    public void serviceResolved(ServiceEvent event) {
                        // When a service is resolved, add it to the list
                        ServiceInfo info = event.getInfo();
                        if (info == null) return; // Early exit if info is null
                        String name = info.getName();
                        String type = info.getType();
                        String application = info.getApplication();
                        String server = info.getServer();
                        String hostname = info.getPropertyString("hostname");
                        int port = info.getPort();
                        String address = info.getInet4Addresses()[0].getHostAddress();
                        if (services.containsKey(name)) {
                            services.get(name).setAddress(address).setType(type).setPort(port).setServer(server).setHostname(hostname).setApplication(application);
                        } else {
                            TransientServiceInfo transientServiceInfo = new TransientServiceInfo(event.getName()).setAddress(address).setType(type).setPort(port).setServer(server).setHostname(hostname).setApplication(application);
                            services.put(event.getName(), transientServiceInfo);
                        }
                    }
                });
            }

            @Override
            public void subTypeForServiceTypeAdded(ServiceEvent serviceEvent) {
            }
        });

        xJmDNS.addServiceListener(new ServiceListener() {
            @Override
            public void serviceAdded(ServiceEvent event) {
                logger.info("XCaster Service found: " + event.getName() + ". Requesting service info...");
                xJmDNS.getJmDNS().requestServiceInfo(event.getType(), event.getName(), 5000);
            }

            @Override
            public void serviceRemoved(ServiceEvent event) {
                logger.info("XCaster Service removed: " + event.getName());
                ServiceInfo serviceInfo = event.getInfo();
                String server = serviceInfo.getServer();

                SSHHostAddress removedSSHHostAddress = resolvedXCASTERServices.remove(server);
                if (removedSSHHostAddress != null) {
                    if (removedSSHHostAddress.getSession() != null) {
                        try {
                            removedSSHHostAddress.getSession().disconnect();
                        } catch (Exception ignored) {
                        }
                        logger.info("Disconnected from " + removedSSHHostAddress.getAddress() + " with hostname " + removedSSHHostAddress.getHostname());

                    }
                    if (removedSSHHostAddress.getHostname() != null) {
                        logger.info("Service with hostname \"" + removedSSHHostAddress.getHostname() + "\" and address \"" + removedSSHHostAddress.getAddress() + "\" removed.");
                    } else {
                        logger.info("Service with address \"" + removedSSHHostAddress.getAddress() + "\" removed (no hostname).");
                    }

                } else {
                    logger.warning("Service with server \"" + server + "\" not found in resolved services.");
                }

            }

            @Override
            public void serviceResolved(ServiceEvent event) {
                ServiceInfo serviceInfo = event.getInfo();
                String serviceAddress = serviceInfo.getInet4Addresses()[0].getHostAddress();
                String hostname = serviceInfo.getPropertyString("hostname");
                String username = serviceInfo.getPropertyString("username");
                String password = serviceInfo.getPropertyString("password");
                String server = serviceInfo.getServer();
                SSHHostAddress SSHHostAddress = new SSHHostAddress(hostname, username, password, serviceAddress, server);
                if (hostname != null) {
                    if (!resolvedXCASTERServices.containsKey(server) || (!resolvedXCASTERServices.get(server).getHostname().equals(SSHHostAddress.getHostname()) && !resolvedXCASTERServices.get(server).getAddress().equals(SSHHostAddress.getAddress()))) {
                        resolvedXCASTERServices.put(server, SSHHostAddress);
                        logger.info("XCaster Service resolved: \"" + serviceInfo.getName() + "\" at (" + serviceAddress + ") with hostname \"" + hostname + "\" at " + server);
                    } else {
                        logger.warning("Duplicate service resolution detected: \"" + serviceInfo.getName() + "\" at (" + serviceAddress + ") with hostname \"" + hostname + "\"");
                    }
                }
            }
        });

        SSHConnectionManager.startConnectionManager(configLoader);
        Thread main = new Thread(() -> {

            if (clientRef.get() == null && !lock.get()) {
                lock.set(true);
                XTablesClient client = new XTablesClient();
                client.addVersionProperty("XDASH");
                clientRef.set(client);
                XTableContext context = client.registerXTableContext("VIEWER");
                xTablesViewerRef.set(new XTablesViewer(context));
            }

        });
        main.setDaemon(true);
        main.start();
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            try {
                logger.fatal("UNCAUGHT EXCEPTION: " + Utilities.formatError(throwable));
                WebSocketHandler.getBroadcastService().queueBroadcast(new Notification(Notification.NotificationType.fatal).setDetail(throwable.getMessage()).setCause(throwable.getCause().toString()).setExceptionType(throwable.getClass().getName()).setStackTrace(Arrays.stream(throwable.getStackTrace()).map(StackTraceElement::toString).toArray(String[]::new)).setSummary("Uncaught Exception: " + thread.getName()), "NOTIFICATION");
            } catch (Exception ignored) {
            }
        });


        try {
            if (args.length == 0) Desktop.getDesktop().browse(new URI("http://localhost:8080/"));
            else logger.warning("Open the website here: http://localhost:8080/");
        } catch (Exception e) {
            logger.warning("Failed to open web browser");
            logger.warning("Open the website here: http://localhost:8080/");
        }
    }

    public static Map<String, SSHHostAddress> getResolvedXCASTERServices() {
        return resolvedXCASTERServices;
    }

    public static ConfigLoader getConfigLoader() {
        return configLoader;
    }

    public static Map<String, TransientServiceInfo> getServices() {
        return services;

    }
}
