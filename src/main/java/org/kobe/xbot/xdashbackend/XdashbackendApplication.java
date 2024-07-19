package org.kobe.xbot.xdashbackend;



import org.kobe.xbot.Client.XTablesClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.concurrent.atomic.AtomicReference;

@SpringBootApplication
public class XdashbackendApplication {
	public static AtomicReference<XTablesClient> clientRef = new AtomicReference<>(null);
	public static void main(String[] args) {

		Thread main = new Thread(() -> {
			XTablesClient client = new XTablesClient();
			clientRef.set(client);
		});
		main.start();
		SpringApplication.run(XdashbackendApplication.class, args);
	}

}
