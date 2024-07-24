package org.kobe.xbot.xdashbackend;


import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.XJmDNS;
import org.kobe.xbot.xdashbackend.Entities.SSHHostAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceInfo;
import javax.jmdns.ServiceListener;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@SpringBootApplication
public class XdashbackendApplication {
    private static final Logger logger = LoggerFactory.getLogger(XJmDNS.class);
    public static AtomicReference<XTablesClient> clientRef = new AtomicReference<>(null);
    private static final AtomicBoolean lock = new AtomicBoolean(false);
    private static final Map<String, SSHHostAddress> resolvedServices = new ConcurrentHashMap<>();

    public static void main(String[] args) {

        SpringApplication.run(XdashbackendApplication.class, args);
        XJmDNS xJmDNS = new XJmDNS();
        xJmDNS.addServiceListener(new ServiceListener() {
            @Override
            public void serviceAdded(ServiceEvent event) {
                logger.info("XCaster Service found: " + event.getName() + ". Requesting service info...");
                xJmDNS.getJmDNS().requestServiceInfo(event.getType(), event.getName());
            }

            @Override
            public void serviceRemoved(ServiceEvent event) {
                logger.info("XCaster Service removed: " + event.getName());
                ServiceInfo serviceInfo = event.getInfo();
                String server = serviceInfo.getServer();

                SSHHostAddress removedSSHHostAddress = resolvedServices.remove(server);
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
                    logger.warn("Service with server \"" + server + "\" not found in resolved services.");
                }

            }

            @Override
            public void serviceResolved(ServiceEvent event) {
                ServiceInfo serviceInfo = event.getInfo();
                String serviceAddress = serviceInfo.getInet4Addresses()[0].getHostAddress();
                String hostname = serviceInfo.getPropertyString("hostname");
                String server = serviceInfo.getServer();
                SSHHostAddress SSHHostAddress = new SSHHostAddress(hostname, serviceAddress, server);

                if (hostname != null) {
                    if (!resolvedServices.containsKey(server) || (!resolvedServices.get(server).getHostname().equals(SSHHostAddress.getHostname()) && !resolvedServices.get(server).getAddress().equals(SSHHostAddress.getAddress()))) {
                        resolvedServices.put(server, SSHHostAddress);
                        logger.info("XCaster Service resolved: \"" + serviceInfo.getName() + "\" at (" + serviceAddress + ") with hostname \"" + hostname + "\" at " + server);
                    } else {
                        logger.warn("Duplicate service resolution detected: \"" + serviceInfo.getName() + "\" at (" + serviceAddress + ") with hostname \"" + hostname + "\"");
                    }
                }
            }
        });

        SSHConnectionManager.startConnectionManager();
        Thread main = new Thread(() -> {

            if (clientRef.get() == null && !lock.get()) {
                lock.set(true);
                XTablesClient client = new XTablesClient();
                clientRef.set(client);
            }

        });
        main.start();
    }

    public static Map<String, SSHHostAddress> getResolvedServices() {
        return resolvedServices;
    }
}
