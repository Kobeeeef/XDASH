package org.kobe.xbot.xdashbackend;



import org.kobe.xbot.Client.XTablesClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@SpringBootApplication
public class XdashbackendApplication {
	public static AtomicReference<XTablesClient> clientRef = new AtomicReference<>(null);
	private static final AtomicBoolean lock = new AtomicBoolean(false);
	public static void main(String[] args) {

		SpringApplication.run(XdashbackendApplication.class, args);
		Thread main = new Thread(() -> {
			if(clientRef.get() == null && !lock.get()) {
				lock.set(true);

				XTablesClient client = new XTablesClient();
				clientRef.set(client);
			}
		});
		main.start();
	}

}
