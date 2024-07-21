//package org.kobe.xbot.Utilities;
//
//import org.kobe.xbot.Client.ImageStreamClient;
//import org.kobe.xbot.Client.ImageStreamServer;
//
//public class VideoStreamResponse {
//    private ImageStreamServer streamServer;
//    private ImageStreamClient streamClient;
//    private ImageStreamStatus status;
//    private String address;
//
//    public VideoStreamResponse(ImageStreamServer streamServer, ImageStreamStatus status) {
//        this.streamServer = streamServer;
//        this.status = status;
//    }
//
//    public VideoStreamResponse(ImageStreamClient streamClient, ImageStreamStatus status) {
//        this.streamClient = streamClient;
//        this.status = status;
//    }
//    public VideoStreamResponse(ImageStreamStatus status) {
//        this.status = status;
//    }
//
//    public String getAddress() {
//        return address;
//    }
//
//    public VideoStreamResponse setAddress(String address) {
//        this.address = address;
//        return this;
//    }
//
//    public ImageStreamServer getStreamServer() {
//        return streamServer;
//    }
//
//    public ImageStreamClient getStreamClient() {
//        return streamClient;
//    }
//
//    public VideoStreamResponse setStreamClient(ImageStreamClient streamClient) {
//        this.streamClient = streamClient;
//        return this;
//    }
//
//    public void setStreamServer(ImageStreamServer streamServer) {
//        this.streamServer = streamServer;
//    }
//
//    public ImageStreamStatus getStatus() {
//        return status;
//    }
//
//    public VideoStreamResponse setStatus(ImageStreamStatus status) {
//        this.status = status;
//        return this;
//    }
//}
