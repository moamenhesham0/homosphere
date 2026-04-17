package com.homosphere.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.mapper.AdminMapper;
import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;
import com.homosphere.backend.service.SupabaseAdminService;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@Slf4j
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupabaseAdminService supabaseAdminService;

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;

    /*
     * Check if the authenticated user is an admin
     */
    private ResponseEntity<?> checkAdminAccess(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        try {
            String userId = authentication.getPrincipal().toString();
            UUID userUuid = UUID.fromString(userId);
            Optional<User> userOptional = userRepository.findById(userUuid);
            
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not found");
            }

            User user = userOptional.get();
            if (!"ADMIN".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Admin access required");
            }
            
            return null; // Access granted
        } catch (Exception e) {
            log.error("Error checking admin access: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid authentication");
        }
    }

    private void rollbackSupabaseUser(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            return;
        }

        try {
            supabaseAdminService.deleteUser(userId);
        } catch (Exception e) {
            log.warn("Failed to rollback Supabase user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Get all admin users
     */
    @GetMapping("/admins")
    public ResponseEntity<?> getAllAdmins(Authentication authentication) {
        // Check admin access
        ResponseEntity<?> accessCheck = checkAdminAccess(authentication);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            log.info("Fetching all admin users");
            List<User> admins = userRepository.findByRole("ADMIN");
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            log.error("Error fetching admins: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching admins: " + e.getMessage());
        }
    }

    /**
     * Add a new admin - sync admin from Supabase
     */
    @PostMapping("/admins")
    public ResponseEntity<?> addAdmin(@RequestBody Map<String, String> request, Authentication authentication) {
        // Check admin access
        ResponseEntity<?> accessCheck = checkAdminAccess(authentication);
        if (accessCheck != null) {
            return accessCheck;
        }

        String createdSupabaseUserId = null;
        try {
            String email = request.get("email");
            String supabaseUserId = request.get("userId");
            String password = request.get("password");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            boolean createInSupabaseFirst = supabaseUserId == null || supabaseUserId.trim().isEmpty();
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            if (createInSupabaseFirst) {
                if (password == null || password.trim().isEmpty()) {
                    return ResponseEntity.badRequest().body("Password is required");
                }

                // Prevent duplicate backend users before provisioning in Supabase
                Optional<User> existingByEmail = userRepository.findByEmail(email);
                if (existingByEmail.isPresent()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("User already exists in the system");
                }

                supabaseUserId = supabaseAdminService.createAdminUser(
                    email.trim(),
                    password,
                    firstName,
                    lastName
                );
                createdSupabaseUserId = supabaseUserId;

                log.info("Created admin in Supabase - ID: {}, Email: {}", supabaseUserId, email);
            } else {
                log.info("Syncing new admin from Supabase - ID: {}, Email: {}", supabaseUserId, email);
            }

            UUID userId = UUID.fromString(supabaseUserId);

            // Check if user already exists in database
            Optional<User> existingUser = userRepository.findById(userId);
            if (existingUser.isPresent()) {
                if (createInSupabaseFirst) {
                    rollbackSupabaseUser(supabaseUserId);
                }
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("User already exists in the system");
            }

            // Create new admin user in database using mapper
            User newAdmin = adminMapper.mapAdminRequestToUser(request, userId);
            newAdmin.setRole("ADMIN");
            
            userRepository.save(newAdmin);

            // Auto-confirm email in Supabase
            if (!createInSupabaseFirst) {
                try {
                    supabaseAdminService.confirmAdminEmail(supabaseUserId);
                    log.info("Email confirmed in Supabase for admin: {}", email);
                } catch (Exception e) {
                    log.warn("Failed to auto-confirm email in Supabase: {}", e.getMessage());
                }
            }

            log.info("Successfully created admin account in database for: {}", email);
            return ResponseEntity.ok(newAdmin);

        } catch (IllegalArgumentException e) {
            rollbackSupabaseUser(createdSupabaseUserId);
            log.error("Invalid UUID format: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid user ID format");
        } catch (Exception e) {
            rollbackSupabaseUser(createdSupabaseUserId);
            log.error("Error adding admin: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding admin: " + e.getMessage());
        }
    }

    /**
     * Delete non-admin user account completely (from database and Supabase)
     */
    @DeleteMapping("/users/{userId}")
    @Transactional
    public ResponseEntity<?> removeUserAccount(@PathVariable UUID userId, Authentication authentication) {
        ResponseEntity<?> accessCheck = checkAdminAccess(authentication);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            log.info("Deleting user account ID: {}", userId);

            Optional<User> userOptional = userRepository.findById(userId);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            User user = userOptional.get();
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Use /admins endpoint to delete admin accounts");
            }

            userSubscriptionRepository.deleteByUser_Id(userId);
            userRepository.deleteById(userId);

            try {
                supabaseAdminService.deleteUser(userId.toString());
            } catch (Exception e) {
                log.warn("Warning: Failed to delete user from Supabase Auth: {}", e.getMessage());
            }

            log.info("Successfully deleted user account: {}", user.getEmail());
            return ResponseEntity.ok("User account deleted successfully");

        } catch (Exception e) {
            log.error("Error deleting user account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting user account: " + e.getMessage());
        }
    }

    /**
     * Delete admin user completely (from database and Supabase)
     */
    @DeleteMapping("/admins/{userId}")
    @Transactional
    public ResponseEntity<?> removeAdmin(@PathVariable UUID userId, Authentication authentication) {
        // Check admin access
        ResponseEntity<?> accessCheck = checkAdminAccess(authentication);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            log.info("Deleting admin user ID: {}", userId);

            Optional<User> userOptional = userRepository.findById(userId);
            
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            User user = userOptional.get();

            // Check if user is admin
            if (!"ADMIN".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("User is not an admin");
            }

            userRepository.deleteById(userId);
            
            // Delete from Supabase Auth using service role key (server-side only)
            try {
                supabaseAdminService.deleteUser(userId.toString());
            } catch (Exception e) {
                log.warn("Warning: Failed to delete user from Supabase Auth: {}", e.getMessage());
            }

            log.info("Successfully deleted admin user: {}", user.getEmail());
            return ResponseEntity.ok("Admin deleted successfully");

        } catch (Exception e) {
            log.error("Error deleting admin: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting admin: " + e.getMessage());
        }
    }
}
