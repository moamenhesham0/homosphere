package com.homosphere.backend.controller;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.repository.ProfileRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;
import com.homosphere.backend.service.SupabaseAdminService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;
    
    @Autowired
    private SupabaseAdminService supabaseAdminService;

    @DeleteMapping("/{userId}")
    @Transactional
    public ResponseEntity<Void> deleteUser(@PathVariable String userId, Authentication authentication) {
        try {
            UUID uuid = UUID.fromString(userId);
            
            // Verify the authenticated user is deleting their own account
            if (authentication != null && authentication.isAuthenticated()) {
                String authenticatedUserId = authentication.getName();
                if (!authenticatedUserId.equals(userId)) {
                    // User is trying to delete someone else's account
                    return ResponseEntity.status(403).build(); // Forbidden
                }
            }
            
            if (!profileRepository.existsById(uuid)) {
                return ResponseEntity.notFound().build();
            }
            
            // Delete user subscriptions first (to avoid foreign key constraint violation)
            userSubscriptionRepository.deleteByUser_Id(uuid);
            
            // Then delete the profile
            profileRepository.deleteById(uuid);
            
            // Finally delete from Supabase Auth using service role key (server-side only)
            supabaseAdminService.deleteUser(userId);
            
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
