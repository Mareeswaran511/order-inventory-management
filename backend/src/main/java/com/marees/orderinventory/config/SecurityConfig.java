package com.marees.orderinventory.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Public APIs
                        .requestMatchers(
                                "/api/users/register",
                                "/api/auth/login"
                        ).permitAll()

                        // Admin-only APIs
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Product write operations - ADMIN only
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                        // Warehouse write operations - ADMIN only
                        .requestMatchers(HttpMethod.POST, "/api/warehouses/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/warehouses/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/warehouses/**").hasRole("ADMIN")

                        // Inventory write operations - ADMIN only
                        .requestMatchers(HttpMethod.POST, "/api/inventory/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/inventory/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/inventory/**").hasRole("ADMIN")

                        // Order read operations - USER + ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/orders/**").hasAnyRole("USER", "ADMIN")


                        // Order write operations - ADMIN only
                        .requestMatchers(HttpMethod.POST, "/api/orders/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/orders/**").hasRole("ADMIN")

                        // Order Item write operations - ADMIN only
                        .requestMatchers(HttpMethod.POST, "/api/order-items/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/order-items/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/order-items/**").hasRole("ADMIN")

                        // Stock Movement write operations - ADMIN only
                        .requestMatchers(HttpMethod.POST, "/api/stock-movements/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/stock-movements/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/stock-movements/**").hasRole("ADMIN")

                        // All other authenticated APIs
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}