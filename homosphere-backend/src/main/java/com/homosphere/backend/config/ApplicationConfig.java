package com.homosphere.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.client.RestTemplate;

import com.homosphere.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> userRepository.findByEmail(email)
                .map(user -> {
                    // Read role directly from Supabase database, default to USER if null
                    String role = user.getRole() != null && !user.getRole().isEmpty()
                                  ? user.getRole().toUpperCase()
                                  : "USER";
                    
                    return User.builder()
                            .username(user.getEmail())
                            .password("") // Supabase handles authentication, no password needed
                            .authorities(new SimpleGrantedAuthority("ROLE_" + role))
                            .build();
                })
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}