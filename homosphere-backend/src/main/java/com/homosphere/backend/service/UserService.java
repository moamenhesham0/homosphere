package com.homosphere.backend.service;


import java.time.LocalDate;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.homosphere.backend.dto.PublicUserDto;
import com.homosphere.backend.model.RegisterUser;
import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.UserSubscription;
import com.homosphere.backend.model.UserSubscription.PaymentFrequency;
import com.homosphere.backend.model.UserSubscription.Status;
import com.homosphere.backend.model.UserUpdateBuilder;
import com.homosphere.backend.repository.SubscriptionTierRepository;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final SubscriptionTierRepository subscriptionTierRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;

    @Transactional
    public void saveUser(RegisterUser registerUser){
        User user = new User(registerUser.getFirstName(), registerUser.getLastName(), registerUser.getPassword(), registerUser.getEmail(),registerUser.getId());
        
        // Set role if provided
        if (registerUser.getRole() != null && !registerUser.getRole().isEmpty()) {
            user.setRole(registerUser.getRole());
        }
        
        userRepository.save(user);
        
        // Create subscription if tier is selected
        if (registerUser.getSubscriptionTierId() != null) {
            SubscriptionTier tier = subscriptionTierRepository.findById(registerUser.getSubscriptionTierId())
                .orElseThrow(() -> new RuntimeException("Subscription tier not found"));
            
            UserSubscription subscription = new UserSubscription();
            subscription.setUser(user);
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
    public User editInformation(UUID id, User userUpdate){
        User old_data = userRepository.findById(id).orElse(null);
        
        if(old_data == null || userUpdate == null){
            System.out.println("user is Null or user not found");
            return null;
        }
        // Use Builder pattern to update user information
        UserUpdateBuilder builder = new UserUpdateBuilder(old_data);
        User updatedProfile = builder
            .withFirstName(userUpdate.getFirstName())
            .withLastName(userUpdate.getLastName())
            .withBio(userUpdate.getBio())
            .withRole(userUpdate.getRole())
            .withPhone(userUpdate.getPhone())
            .withLocation(userUpdate.getLocation())
            .withPhoto(userUpdate.getPhoto())
            .withUserName(userUpdate.getUserName()) // ensure username is updated
            .build();
        System.out.println(updatedProfile.getBio() + " " + updatedProfile.getLocation());
        return userRepository.save(updatedProfile);
    }
    public User getInformation(UUID id){
        return userRepository.findById(id).orElse(null);
    }
    public String signUpUser(UUID id){
        boolean exists = userRepository.findById(id).isPresent();
        if(exists)
            return "OK";
        else
            return "Fail";
    }
    public PublicUserDto getPublicUserDto(UUID id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;
        return new PublicUserDto(
            user.getFirstName(),
            user.getLastName(),
            user.getPhoto(),
            user.getBio(),
            user.getPhone(),
            user.getLocation(),
            user.getUserName(),
            null // telegram, if you add it to User, replace null with user.getTelegram()
        );
    }
}
