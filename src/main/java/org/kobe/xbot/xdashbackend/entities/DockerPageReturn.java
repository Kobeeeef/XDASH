package org.kobe.xbot.xdashbackend.entities;

public class DockerPageReturn {
   private String devices;
   private boolean ready;
   private String message;
   private String docker_images_directory;

   public DockerPageReturn(String devices, boolean ready, String message, String docker_images_directory) {
      this.devices = devices;
      this.ready = ready;
      this.message = message;
      this.docker_images_directory = docker_images_directory;
   }
}
