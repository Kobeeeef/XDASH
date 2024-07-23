package org.kobe.xbot;

import org.kobe.xbot.xdashbackend.utilities.Utilities;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceListener;
import java.io.IOException;
import java.net.InetAddress;
import java.util.Timer;
import java.util.TimerTask;

public class XJmDNS {

    private static final Logger logger = LoggerFactory.getLogger(XJmDNS.class);
    private JmDNS jmdns;
    private InetAddress previousAddress;
    private Timer timer;

    public XJmDNS() {
        setupMDNS();
        startAddressMonitor();
    }

    private void setupMDNS() {
        try {
            InetAddress addr = Utilities.getLocalInetAddress();
            previousAddress = addr;
            jmdns = JmDNS.create(addr);

            logger.info("mDNS initialized successfully.");
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                try {
                    logger.info("Shutdown hook running, closing JmDNS.");
                    jmdns.close();
                    logger.info("JmDNS closed successfully.");
                } catch (Exception e) {
                    logger.error("Failed to close JmDNS.", e);
                }
            }));
        } catch (IOException e) {
            logger.error("Failed to set up mDNS.", e);
        }
    }

    private void startAddressMonitor() {
        timer = new Timer();
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                try {
                    InetAddress currentAddress = Utilities.getLocalInetAddress();
                    if (!currentAddress.equals(previousAddress)) {
                        logger.info("Network address changed from {} to {}. Restarting mDNS.", previousAddress, currentAddress);
                        restartMDNS(currentAddress);
                    }
                } catch (IOException e) {
                    previousAddress = null;
                }
            }
        };
        timer.scheduleAtFixedRate(task, 0, 1000); // Check every second
    }

    private void restartMDNS(InetAddress newAddress) {
        try {
            if (jmdns != null) {
                jmdns.close();
                logger.info("Previous JmDNS closed successfully.");
            }
            previousAddress = newAddress;
            jmdns = JmDNS.create(newAddress);

            logger.info("New mDNS initialized successfully.");
        } catch (IOException e) {
            logger.error("Failed to restart mDNS.", e);
        }
    }

    public void addServiceListener(ServiceListener listener) {
        if (jmdns != null) {
            jmdns.addServiceListener("_xcaster._tcp.local.", listener);
        }
    }

    public JmDNS getJmDNS() {
        return jmdns;
    }
}
