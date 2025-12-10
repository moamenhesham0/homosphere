package com.homosphere.backend.controller;


import java.util.UUID;

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

import com.homosphere.backend.dto.PrivateUserDto;
import com.homosphere.backend.dto.PublicUserDto;
import com.homosphere.backend.model.RegisterUser;
import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;
import com.homosphere.backend.service.SupabaseAdminService;
import com.homosphere.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserController {

   private final UserService userService;
   private final UserRepository userRepository;
   private final UserSubscriptionRepository userSubscriptionRepository;
   private final SupabaseAdminService supabaseAdminService;

    @PostMapping("/api/public/user")
    public ResponseEntity<Void> saveNewuser(@Valid @RequestBody RegisterUser registerUser){
        if (registerUser == null) {
            return ResponseEntity.badRequest().build();
        }
        userService.saveUser(registerUser);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/user")
    public ResponseEntity<User> editUser(@Valid @RequestBody User user, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        String userId = authentication.getPrincipal().toString();
        UUID uuid = UUID.fromString(userId);
        User updatedUser = userService.editInformation(uuid, user);
        return ResponseEntity.ok(updatedUser);
    }
    
    // For private profile viewing
    @GetMapping("/api/user")
    public ResponseEntity<PrivateUserDto> retrieveInformation(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String userId = authentication.getPrincipal().toString();
        UUID uuid = UUID.fromString(userId);
        User user = userService.getInformation(uuid);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new PrivateUserDto(
            user.getFirstName(),
            user.getLastName(),
            user.getPhoto(),
            user.getBio(),
            user.getPhone(),
            user.getEmail(),
            user.getRole(),
            user.getUserName(),
            user.getStatus(),
            user.getLocation()
        ));
    }
    
    // For public profile viewing
    @GetMapping("/api/public/retrieveInf/{id}")
    public ResponseEntity<PublicUserDto> retrievePublicInformation(@PathVariable UUID id) {
        User user = userService.getInformation(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new PublicUserDto(
            user.getFirstName(),
            user.getLastName(),
            user.getPhoto(),
            user.getBio(),
            user.getPhone()
        ));
    }

    @GetMapping("api/public/signup/{id}")
    public String signup (@PathVariable UUID id){
        return userService.signUpUser(id);
    }
    
    @DeleteMapping("/api/user")
    @Transactional
    public ResponseEntity<Void> deleteUser(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }
            
            // Get authenticated user ID from token
            String userId = authentication.getPrincipal().toString();
            UUID uuid = UUID.fromString(userId);
            
            if (!userRepository.existsById(uuid)) {
                return ResponseEntity.notFound().build();
            }
            
            // Delete user subscriptions first (to avoid foreign key constraint violation)
            userSubscriptionRepository.deleteByUser_Id(uuid);
            
            // Then delete the profile
            userRepository.deleteById(uuid);
            
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
