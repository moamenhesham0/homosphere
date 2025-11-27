package com.homosphere.backend.controller;


import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.model.Profile;
import com.homosphere.backend.model.registerUser;
import com.homosphere.backend.repository.ProfileRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;
import com.homosphere.backend.service.ProfileService;
import com.homosphere.backend.service.SupabaseAdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProfileController {

   private final ProfileService profileService;
   private final ProfileRepository profileRepository;
   private final UserSubscriptionRepository userSubscriptionRepository;
   private final SupabaseAdminService supabaseAdminService;

    @PostMapping("/api/public/user")
    public void saveNewuser(@RequestBody registerUser registerUser){
        
        profileService.saveprofile(registerUser);
    }

    @PutMapping("/api/public/editProfile/{id}")
    public Profile editProfile (@PathVariable UUID id,@RequestBody Profile Profile){
        return profileService.editInformation(id, Profile);
    }
    
    @GetMapping("api/public/retrieveInf/{id}")
    public  Profile retrieveInformation(@PathVariable UUID id){
        return profileService.GetInformation(id);
    }

    @GetMapping("api/public/signup/{id}")
    public String signup (@PathVariable UUID id){
        return profileService.signuPprofile(id);
    }
    
    @DeleteMapping("/api/profile/{userId}")
    @Transactional
    public ResponseEntity<Void> deleteUser(@PathVariable String userId, Authentication authentication) {
        try {
            UUID uuid = UUID.fromString(userId);
            
            // Verify the authenticated user is deleting their own account
            if (authentication != null && authentication.isAuthenticated()) {
                // Get the authenticated user ID from the principal (which we set as the userId string)
                String authenticatedUserId = authentication.getPrincipal().toString();
                if (!authenticatedUserId.equals(userId)) {
                    // User is trying to delete someone else's account
                    return ResponseEntity.status(403).build(); // Forbidden
                }
            } else {
                // No authentication present
                return ResponseEntity.status(401).build(); // Unauthorized
            }
            
            if (!profileRepository.existsById(uuid)) {
                return ResponseEntity.notFound().build();
            }
            
            // Delete user subscriptions first (to avoid foreign key constraint violation)
            userSubscriptionRepository.deleteByUser_Id(uuid);
            
            // Then delete the profile
            profileRepository.deleteById(uuid);
            
            // Finally delete from Supabase Auth using service role key (server-side only)
            // If this fails, the database deletion still succeeded
            try {
                supabaseAdminService.deleteUser(userId);
            } catch (Exception e) {
                // Log but don't fail the whole operation
                System.err.println("Warning: Failed to delete user from Supabase Auth: " + e.getMessage());
            }
            
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
}
