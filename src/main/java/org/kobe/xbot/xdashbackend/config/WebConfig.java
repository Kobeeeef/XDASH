//package org.kobe.xbot.xdashbackend.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        // Serve static resources without extensions by looking for .html files
//        registry.addResourceHandler("/**")
//                .addResourceLocations("classpath:/static/")
//                .setCachePeriod(3600)
//                .resourceChain(true);
//
//        // Add a fallback to look for .html files
//        registry.addResourceHandler("/{path:[^\\.]*}")
//                .addResourceLocations("classpath:/static/")
//                .setCachePeriod(3600)
//                .resourceChain(true);
//    }
//}
