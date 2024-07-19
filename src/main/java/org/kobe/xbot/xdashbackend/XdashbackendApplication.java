package org.kobe.xbot.xdashbackend;



import org.kobe.xbot.Client.XTablesClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.concurrent.atomic.AtomicReference;

@SpringBootApplication
public class XdashbackendApplication {
	public static AtomicReference<XTablesClient> clientRef = new AtomicReference<>(null);
	private static boolean lock = false;
	public static void main(String[] args) {

		Thread main = new Thread(() -> {
			if(clientRef.get() == null && !lock) {
				lock = true;
				System.out.println("Connecting to server...");
				XTablesClient client = new XTablesClient();
				clientRef.set(client);
			}
		});
		main.start();
		SpringApplication.run(XdashbackendApplication.class, args);
	}

}
