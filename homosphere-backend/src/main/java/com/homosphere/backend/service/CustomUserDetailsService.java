package com.homosphere.backend.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.homosphere.backend.model.User;
import com.homosphere.backend.model.UserPrincipal;
import com.homosphere.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username can be either email or UUID
        User user = null;
        
        // Try to load by email first
        Optional<User> userByEmail = userRepository.findByEmail(username);
        if (userByEmail.isPresent()) {
            user = userByEmail.get();
        } else {
            // Try to load by UUID
            try {
                UUID userId = UUID.fromString(username);
                user = userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + username));
            } catch (IllegalArgumentException e) {
                throw new UsernameNotFoundException("User not found with email: " + username);
            }
        }
        
        return new UserPrincipal(user);
    }
    
    public UserDetails loadUserById(UUID userId) throws UsernameNotFoundException {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        return new UserPrincipal(user);
    }
}
