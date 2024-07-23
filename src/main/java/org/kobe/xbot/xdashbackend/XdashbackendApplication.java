package org.kobe.xbot.xdashbackend;


import org.kobe.xbot.Client.XTablesClient;

import org.kobe.xbot.XJmDNS;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceInfo;
import javax.jmdns.ServiceListener;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@SpringBootApplication
public class XdashbackendApplication {
    private static final Logger logger = LoggerFactory.getLogger(XJmDNS.class);
    public static AtomicReference<XTablesClient> clientRef = new AtomicReference<>(null);
    private static final AtomicBoolean lock = new AtomicBoolean(false);
    private static final Map<String, String> resolvedServices = new HashMap<>();

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
            }

            @Override
            public void serviceResolved(ServiceEvent event) {
                ServiceInfo serviceInfo = event.getInfo();
                String serviceAddress = serviceInfo.getInet4Addresses()[0].getHostAddress();
                String hostname = serviceInfo.getPropertyString("hostname");
                if (hostname != null) {
                    if (!resolvedServices.containsKey(hostname) || !resolvedServices.get(hostname).equals(serviceAddress)) {
                        resolvedServices.put(hostname, serviceAddress);
                        logger.info("XCaster Service resolved: \"" + serviceInfo.getName() + "\" at (" + serviceAddress + ") with hostname \"" + hostname + "\"");
                    } else {
                        logger.warn("Duplicate service resolution detected: \"" + serviceInfo.getName() + "\" at (" + serviceAddress + ") with hostname \"" + hostname + "\"");
                    }
                }

            }
        });


        Thread main = new Thread(() -> {

            if (clientRef.get() == null && !lock.get()) {
                lock.set(true);
                XTablesClient client = new XTablesClient();
                clientRef.set(client);
            }

        });
        main.start();
    }

}
