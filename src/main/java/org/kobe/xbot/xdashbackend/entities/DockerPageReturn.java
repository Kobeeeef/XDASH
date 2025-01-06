package org.kobe.xbot.xdashbackend.entities;

public class DockerPageReturn {
   private String devices;
   private boolean ready;
   private String message;
   private String docker_images_directory;
   private String docker_compose_directory;

   public DockerPageReturn(String devices, boolean ready, String message, String docker_images_directory, String docker_compose_directory) {
      this.devices = devices;
      this.ready = ready;
      this.message = message;
      this.docker_images_directory = docker_images_directory;
      this.docker_compose_directory = docker_compose_directory;
   }
}
