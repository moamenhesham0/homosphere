package com.homosphere.backend.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homosphere.backend.dto.GoogleSignupRequest;
import com.homosphere.backend.dto.LoginRequest;
import com.homosphere.backend.dto.SignupRequest;
import com.homosphere.backend.dto.UserDto;
import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> findById(UUID userId) {
        return userRepository.findById(userId);
    }

    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public UserDto processGoogleSignup(UUID userId, GoogleSignupRequest request) {
        // Validate role if provided
        String role = request.getRole() != null ? validateRole(request.getRole()) : "BUYER";
        Optional<User> existinguser = userRepository.findById(userId);
        
        User user;
        if (existinguser.isPresent()) {
            user = existinguser.get();
            // Update Google-specific fields
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhoto(request.getAvatarUrl());
            user.setIsVerified(true);
            // Don't override role if user is already ADMIN
            if (!"ADMIN".equals(user.getRole())) {
                user.setRole(role);
            }
        } else {
            // Create new user for Google user
            user = new User();
            user.setUserId(userId);
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhoto(request.getAvatarUrl());
            user.setIsVerified(true);
            user.setRole(role);
        }
        
        user = userRepository.save(user);
        return convertToDto(user);
    }

    @Transactional
    public UserDto processRegularSignup(UUID userId, SignupRequest request) {
        // Check if email already exists with different user
        Optional<User> existingByEmail = userRepository.findByEmail(request.getEmail());
        if (existingByEmail.isPresent() && !existingByEmail.get().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        // Validate and sanitize role - prevent admin escalation
        String role = validateRole(request.getRole());
        
        Optional<User> existingById = userRepository.findById(userId);
        
        User user;
        if (existingById.isPresent()) {
            user = existingById.get();
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            // Don't override role if user is already ADMIN
            if (!"ADMIN".equals(user.getRole())) {
                user.setRole(role);
            }
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
        } else {
            user = new User();
            user.setUserId(userId);
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setRole(role);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setIsVerified(false);
        }
        
        user = userRepository.save(user);
        return convertToDto(user);
    }

    /**
     * Validates role to prevent admin escalation
     * Allowed roles: BUYER, SELLER, BROKER
     * Returns BUYER as default if invalid
     */
    private String validateRole(String role) {
        if (role == null || role.isEmpty()) {
            return "BUYER"; // Default role
        }
        
        String normalizedRole = role.trim().toUpperCase();
        
        // Prevent admin escalation - users cannot set themselves as admin
        if ("ADMIN".equals(normalizedRole)) {
            throw new IllegalArgumentException("Cannot assign ADMIN role during signup. Contact support.");
        }
        
        // Allow only valid roles
        if (normalizedRole.equals("BUYER") || 
            normalizedRole.equals("SELLER") || 
            normalizedRole.equals("BROKER")) {
            return normalizedRole;
        }
        
        // Invalid role, use default
        return "BUYER";
    }
    
    public UserDto getUserById(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User user not found"));
        return convertToDto(user);
    }
    
    /**
     * Authenticates a user with email and password (for Supabase-first auth)
     * This verifies that the user exists in our backend and credentials match
     */
    @Transactional(readOnly = true)
    public UserDto authenticateUser(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));
        
        // Verify password (if stored - for regular signups)
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("Invalid password");
            }
        }
        
        return convertToDto(user);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setUserName(user.getUserName());
        dto.setRole(user.getRole());
        dto.setLocation(user.getLocation());
        dto.setPhone(user.getPhone());
        dto.setBio(user.getBio());
        dto.setPhoto(user.getPhoto());
        dto.setIsVerified(user.getIsVerified());
        return dto;
    }
}
