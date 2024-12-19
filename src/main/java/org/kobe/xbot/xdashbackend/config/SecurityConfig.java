package org.kobe.xbot.xdashbackend.config;

import org.kobe.xbot.xdashbackend.ConfigLoader;
import org.kobe.xbot.xdashbackend.XdashbackendApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources without extensions by looking for .html files
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600)
                .resourceChain(true);

        // Add a fallback to look for .html files
        registry.addResourceHandler("/{path:[^\\.]*}")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600)
                .resourceChain(true);
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/_next/**", "/themes/**", "/layout/**", "/auth/**", "/images/**", "/ws/**", "/api/**").permitAll()
                                .anyRequest().authenticated()
                )
                .formLogin(formLogin ->
                        formLogin
                                .loginPage("/auth/login.html")
                                .loginProcessingUrl("/perform_login")
                                .defaultSuccessUrl("/", true)
                                .failureHandler(new CustomAuthenticationFailureHandler())
                                .permitAll()
                )
                .logout(logout ->
                        logout
                                .logoutUrl("/perform_logout")
                                .deleteCookies("JSESSIONID")
                                .logoutSuccessUrl("/auth/login.html")
                                .permitAll()
                ).csrf().disable();


        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        ConfigLoader config = XdashbackendApplication.getConfigLoader();
        UserDetails user = User.withUsername("user")
                .password(passwordEncoder().encode(config.getProperty("server.password")))
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance(); // This is not secure and should be replaced with a proper encoder
    }
}
