package org.kobe.xbot.Utilities.Entities;

public class DaemonThread extends Thread{

    public DaemonThread(Runnable target) {
        super(target);
        setDaemon(true);
    }
}
