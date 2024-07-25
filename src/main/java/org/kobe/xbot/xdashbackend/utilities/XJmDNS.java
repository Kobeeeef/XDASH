package org.kobe.xbot.xdashbackend.utilities;

import org.kobe.xbot.xdashbackend.logs.XDashLogger;


import javax.jmdns.JmDNS;
import javax.jmdns.ServiceListener;
import java.io.IOException;
import java.net.InetAddress;
import java.util.Timer;
import java.util.TimerTask;

public class XJmDNS {

    private static final XDashLogger logger = XDashLogger.getLogger();
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
                    logger.severe("Failed to close JmDNS.:\n" + e);
                }
            }));
        } catch (IOException e) {
            logger.severe("Failed to set up mDNS.:\n" + e);
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
                        logger.info(String.format("Network address changed from %1$s to %2$s. Restarting mDNS.", previousAddress, currentAddress));
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
            logger.severe("Failed to restart mDNS.:\n" + e);

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
