package com.homosphere.backend.service;


import java.util.UUID;

import org.springframework.stereotype.Service;

import com.homosphere.backend.model.Profile;
import com.homosphere.backend.model.ProfileUpdateBuilder;
import com.homosphere.backend.model.registerUser;
import com.homosphere.backend.repository.ProfileRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {
    
    private final ProfileRepository profileRepository;

    public void saveprofile(registerUser registerUser){
        Profile profile = new Profile(registerUser.getFirstName(), registerUser.getLastName(), registerUser.getPassword(), registerUser.getEmail(),registerUser.getId());
        profileRepository.save(profile);
    }
    @Transactional
    public Profile editInformation(UUID id, Profile profileUpdate){
        Profile old_data = profileRepository.findById(id).orElse(null);
        
        if(old_data == null || profileUpdate == null){
            System.out.println("profile is Null or user not found");
            return null;
        }
        
        // Use Builder pattern to update profile
        ProfileUpdateBuilder builder = new ProfileUpdateBuilder(old_data);
        
        Profile updatedProfile = builder
            .withFirstName(profileUpdate.getFirstName())
            .withLastName(profileUpdate.getLastName())
            .withBio(profileUpdate.getBio())
            .withRole(profileUpdate.getRole())
            .withPhone(profileUpdate.getPhone())
            .withLocation(profileUpdate.getLocation())
            .withPhoto(profileUpdate.getPhoto())
            .build();
        
        System.out.println(updatedProfile.getBio() + " " + updatedProfile.getLocation());
        return profileRepository.save(updatedProfile);
    }
    public Profile GetInformation(UUID id){
        return profileRepository.findById(id).orElse(null);
    }
    public String signuPprofile(UUID id){
        boolean exists = profileRepository.findById(id).isPresent();
        if(exists)
            return "OK";
        else
            return "Fail";
    }
}
