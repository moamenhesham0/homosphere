package com.homosphere.backend.service;


import java.time.LocalDate;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.homosphere.backend.model.Profile;
import com.homosphere.backend.model.ProfileUpdateBuilder;
import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.model.UserSubscription;
import com.homosphere.backend.model.UserSubscription.PaymentFrequency;
import com.homosphere.backend.model.UserSubscription.Status;
import com.homosphere.backend.model.registerUser;
import com.homosphere.backend.repository.ProfileRepository;
import com.homosphere.backend.repository.SubscriptionTierRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {
    
    private final ProfileRepository profileRepository;
    private final SubscriptionTierRepository subscriptionTierRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;

    @Transactional
    public void saveprofile(registerUser registerUser){
        Profile profile = new Profile(registerUser.getFirstName(), registerUser.getLastName(), registerUser.getPassword(), registerUser.getEmail(),registerUser.getId());
        
        // Set role if provided
        if (registerUser.getRole() != null && !registerUser.getRole().isEmpty()) {
            profile.setRole(registerUser.getRole());
        }
        
        profileRepository.save(profile);
        
        // Create subscription if tier is selected
        if (registerUser.getSubscriptionTierId() != null) {
            SubscriptionTier tier = subscriptionTierRepository.findById(registerUser.getSubscriptionTierId())
                .orElseThrow(() -> new RuntimeException("Subscription tier not found"));
            
            UserSubscription subscription = new UserSubscription();
            subscription.setUser(profile);
            subscription.setSubscription(tier);
            subscription.setStartDate(LocalDate.now());
            
            // Set end date based on billing cycle
            LocalDate endDate = LocalDate.now();
            if ("month".equalsIgnoreCase(registerUser.getBillingCycle())) {
                subscription.setFrequency(PaymentFrequency.MONTHLY);
                endDate = endDate.plusMonths(1);
            } else {
                subscription.setFrequency(PaymentFrequency.YEARLY);
                endDate = endDate.plusYears(1);
            }
            subscription.setEndDate(endDate);
            subscription.setStatus(Status.ACTIVE);
            
            userSubscriptionRepository.save(subscription);
        }
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
