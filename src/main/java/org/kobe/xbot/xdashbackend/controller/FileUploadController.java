package org.kobe.xbot.xdashbackend.controller;

import org.kobe.xbot.xdashbackend.XdashbackendApplication;
import org.kobe.xbot.xdashbackend.entities.SSHHostAddress;
import org.kobe.xbot.xdashbackend.entities.TransferProgress;
import org.kobe.xbot.xdashbackend.websocket.WebSocketHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private static final Logger logger = Logger.getLogger(FileUploadController.class.getName());

    @CrossOrigin(origins = "http://localhost:3000/")
    @PostMapping("/upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("files[]") MultipartFile[] files,
                                                   @RequestParam("server") String server,
                                                   @RequestParam("directory") String directory,
                                                   @RequestParam("id") String id) {
        // Create a unique key for this upload session
        SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
        if (sshHostAddress == null) {
            logger.severe("Invalid server address: " + server);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid server address");
        }

        for (MultipartFile file : files) {
            boolean success = sshHostAddress.uploadFile(file, directory, (transferProgress -> {
                WebSocketHandler.broadcast(transferProgress, "TRANSFER-PROGRESS-" + id);
            }));
            if (success) {
                WebSocketHandler.broadcast(new TransferProgress("Finished uploading.", 100, 0, 0).setFinished(true), "TRANSFER-PROGRESS-" + id);
            }
        }

        return ResponseEntity.ok("Files uploaded successfully");
    }
}
