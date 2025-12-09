package com.homosphere.backend.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homosphere.backend.dto.GoogleSignupRequest;
import com.homosphere.backend.dto.ProfileDto;
import com.homosphere.backend.dto.SignupRequest;
import com.homosphere.backend.model.Profile;
import com.homosphere.backend.repository.ProfileRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<Profile> findById(UUID userId) {
        return profileRepository.findById(userId);
    }

    @Transactional
    public Profile save(Profile profile) {
        return profileRepository.save(profile);
    }

    @Transactional
    public ProfileDto processGoogleSignup(UUID userId, GoogleSignupRequest request) {
        Optional<Profile> existingProfile = profileRepository.findById(userId);
        
        Profile profile;
        if (existingProfile.isPresent()) {
            profile = existingProfile.get();
            // Update Google-specific fields
            profile.setEmail(request.getEmail());
            profile.setFirstName(request.getFirstName());
            profile.setLastName(request.getLastName());
            profile.setPhoto(request.getAvatarUrl());
            profile.setIsVerified(true);
        } else {
            // Create new profile for Google user
            profile = new Profile();
            profile.setId(userId);
            profile.setEmail(request.getEmail());
            profile.setFirstName(request.getFirstName());
            profile.setLastName(request.getLastName());
            profile.setPhoto(request.getAvatarUrl());
            profile.setIsVerified(true);
            profile.setRole("USER");
        }
        
        profile = profileRepository.save(profile);
        return convertToDto(profile);
    }

    @Transactional
    public ProfileDto processRegularSignup(UUID userId, SignupRequest request) {
        // Check if email already exists with different user
        Optional<Profile> existingByEmail = profileRepository.findByEmail(request.getEmail());
        if (existingByEmail.isPresent() && !existingByEmail.get().getId().equals(userId)) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        Optional<Profile> existingById = profileRepository.findById(userId);
        
        Profile profile;
        if (existingById.isPresent()) {
            profile = existingById.get();
            profile.setEmail(request.getEmail());
            profile.setFirstName(request.getFirstName());
            profile.setLastName(request.getLastName());
            profile.setRole(request.getRole());
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                profile.setPassword(passwordEncoder.encode(request.getPassword()));
            }
        } else {
            profile = new Profile();
            profile.setId(userId);
            profile.setEmail(request.getEmail());
            profile.setFirstName(request.getFirstName());
            profile.setLastName(request.getLastName());
            profile.setRole(request.getRole());
            profile.setPassword(passwordEncoder.encode(request.getPassword()));
            profile.setIsVerified(false);
        }
        
        profile = profileRepository.save(profile);
        return convertToDto(profile);
    }

    public ProfileDto getProfileById(UUID userId) {
        Profile profile = profileRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User profile not found"));
        return convertToDto(profile);
    }

    private ProfileDto convertToDto(Profile profile) {
        ProfileDto dto = new ProfileDto();
        dto.setId(profile.getId());
        dto.setEmail(profile.getEmail());
        dto.setFirstName(profile.getFirstName());
        dto.setLastName(profile.getLastName());
        dto.setUserName(profile.getUserName());
        dto.setRole(profile.getRole());
        dto.setLocation(profile.getLocation());
        dto.setPhone(profile.getPhone());
        dto.setBio(profile.getBio());
        dto.setPhoto(profile.getPhoto());
        dto.setIsVerified(profile.getIsVerified());
        return dto;
    }
}
