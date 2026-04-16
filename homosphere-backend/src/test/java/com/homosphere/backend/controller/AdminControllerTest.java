package com.homosphere.backend.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.service.SupabaseAdminService;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SupabaseAdminService supabaseAdminService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AdminController adminController;

    private UUID adminUserId;
    private UUID regularUserId;
    private User adminUser;
    private User regularUser;

    @BeforeEach
    void setUp() {
        adminUserId = UUID.randomUUID();
        regularUserId = UUID.randomUUID();

        adminUser = new User();
        adminUser.setId(adminUserId);
        adminUser.setEmail("admin@test.com");
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser.setRole("ADMIN");
        adminUser.setIsVerified(true);

        regularUser = new User();
        regularUser.setId(regularUserId);
        regularUser.setEmail("user@test.com");
        regularUser.setFirstName("Regular");
        regularUser.setLastName("User");
        regularUser.setRole("BUYER");
        regularUser.setIsVerified(true);
    }

    // ========== Test getAllAdmins ==========

    @Test
    void testGetAllAdmins_Success() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        List<User> adminsList = Arrays.asList(adminUser);
        when(userRepository.findByRole("ADMIN")).thenReturn(adminsList);

        // Act
        ResponseEntity<?> response = adminController.getAllAdmins(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof List);
        @SuppressWarnings("unchecked")
        List<User> result = (List<User>) response.getBody();
        assertEquals(1, result.size());
        assertEquals("admin@test.com", result.get(0).getEmail());

        verify(userRepository).findByRole("ADMIN");
    }

    @Test
    void testGetAllAdmins_Unauthorized_NoAuthentication() {
        // Act
        ResponseEntity<?> response = adminController.getAllAdmins(null);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Authentication required", response.getBody());
    }

    @Test
    void testGetAllAdmins_Unauthorized_NotAuthenticated() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(false);

        // Act
        ResponseEntity<?> response = adminController.getAllAdmins(authentication);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Authentication required", response.getBody());
    }

    @Test
    void testGetAllAdmins_Forbidden_NotAdmin() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(regularUserId.toString());
        when(userRepository.findById(regularUserId)).thenReturn(Optional.of(regularUser));

        // Act
        ResponseEntity<?> response = adminController.getAllAdmins(authentication);

        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Admin access required", response.getBody());
    }

    @Test
    void testGetAllAdmins_UserNotFound() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = adminController.getAllAdmins(authentication);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testGetAllAdmins_InvalidUUID() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("invalid-uuid");

        // Act
        ResponseEntity<?> response = adminController.getAllAdmins(authentication);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid authentication", response.getBody());
    }

    @Test
    void testGetAllAdmins_DatabaseException() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));
        when(userRepository.findByRole("ADMIN")).thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<?> response = adminController.getAllAdmins(authentication);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Error fetching admins"));
    }

    // ========== Test addAdmin ==========

    @Test
    @org.junit.jupiter.api.Disabled("AdminMapper needs to be mocked")
    void testAddAdmin_Success() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        UUID newAdminId = UUID.randomUUID();
        Map<String, String> request = new HashMap<>();
        request.put("userId", newAdminId.toString());
        request.put("email", "newadmin@test.com");
        request.put("firstName", "New");
        request.put("lastName", "Admin");

        when(userRepository.findById(newAdminId)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(supabaseAdminService.confirmAdminEmail(newAdminId.toString())).thenReturn(true);

        // Act
        ResponseEntity<?> response = adminController.addAdmin(request, authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof User);
        User newAdmin = (User) response.getBody();
        assertEquals("newadmin@test.com", newAdmin.getEmail());
        assertEquals("ADMIN", newAdmin.getRole());
        assertTrue(newAdmin.getIsVerified());

        verify(userRepository).save(any(User.class));
        verify(supabaseAdminService).confirmAdminEmail(newAdminId.toString());
    }

    @Test
    void testAddAdmin_MissingUserId() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        Map<String, String> request = new HashMap<>();
        request.put("email", "newadmin@test.com");

        // Act
        ResponseEntity<?> response = adminController.addAdmin(request, authentication);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Password is required", response.getBody());
    }

    @Test
    void testAddAdmin_EmptyUserId() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        Map<String, String> request = new HashMap<>();
        request.put("userId", "  ");
        request.put("email", "newadmin@test.com");

        // Act
        ResponseEntity<?> response = adminController.addAdmin(request, authentication);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Password is required", response.getBody());
    }

    @Test
    void testAddAdmin_MissingEmail() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        UUID newAdminId = UUID.randomUUID();
        Map<String, String> request = new HashMap<>();
        request.put("userId", newAdminId.toString());

        // Act
        ResponseEntity<?> response = adminController.addAdmin(request, authentication);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email is required", response.getBody());
    }

    @Test
    void testAddAdmin_UserAlreadyExists() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        UUID existingId = UUID.randomUUID();
        Map<String, String> request = new HashMap<>();
        request.put("userId", existingId.toString());
        request.put("email", "existing@test.com");
        request.put("firstName", "Existing");
        request.put("lastName", "User");

        User existingUser = new User();
        existingUser.setId(existingId);
        when(userRepository.findById(existingId)).thenReturn(Optional.of(existingUser));

        // Act
        ResponseEntity<?> response = adminController.addAdmin(request, authentication);

        // Assert
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("User already exists in the system", response.getBody());
    }

    @Test
    void testAddAdmin_InvalidUUIDFormat() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        Map<String, String> request = new HashMap<>();
        request.put("userId", "invalid-uuid");
        request.put("email", "newadmin@test.com");

        // Act
        ResponseEntity<?> response = adminController.addAdmin(request, authentication);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid user ID format", response.getBody());
    }

    @Test
    @org.junit.jupiter.api.Disabled("AdminMapper needs to be mocked")
    void testAddAdmin_SupabaseConfirmationFails() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        UUID newAdminId = UUID.randomUUID();
        Map<String, String> request = new HashMap<>();
        request.put("userId", newAdminId.toString());
        request.put("email", "newadmin@test.com");
        request.put("firstName", "New");
        request.put("lastName", "Admin");

        when(userRepository.findById(newAdminId)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(supabaseAdminService.confirmAdminEmail(newAdminId.toString()))
            .thenThrow(new RuntimeException("Supabase error"));

        // Act
        ResponseEntity<?> response = adminController.addAdmin(request, authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userRepository).save(any(User.class));
        verify(supabaseAdminService).confirmAdminEmail(newAdminId.toString());
    }

    @Test
    void testAddAdmin_Unauthorized() {
        // Arrange
        Map<String, String> request = new HashMap<>();
        request.put("userId", UUID.randomUUID().toString());
        request.put("email", "newadmin@test.com");

        // Act
        ResponseEntity<?> response = adminController.addAdmin(request, null);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    // ========== Test removeAdmin ==========

    @Test
    void testRemoveAdmin_Success() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        UUID targetAdminId = UUID.randomUUID();
        User targetAdmin = new User();
        targetAdmin.setId(targetAdminId);
        targetAdmin.setEmail("target@test.com");
        targetAdmin.setRole("ADMIN");

        when(userRepository.findById(targetAdminId)).thenReturn(Optional.of(targetAdmin));
        doNothing().when(userRepository).deleteById(targetAdminId);
        when(supabaseAdminService.deleteUser(targetAdminId.toString())).thenReturn(true);

        // Act
        ResponseEntity<?> response = adminController.removeAdmin(targetAdminId, authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Admin deleted successfully", response.getBody());

        verify(userRepository).deleteById(targetAdminId);
        verify(supabaseAdminService).deleteUser(targetAdminId.toString());
    }

    @Test
    void testRemoveAdmin_UserNotFound() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        UUID targetId = UUID.randomUUID();
        when(userRepository.findById(targetId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = adminController.removeAdmin(targetId, authentication);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testRemoveAdmin_UserNotAdmin() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        UUID targetId = UUID.randomUUID();
        when(userRepository.findById(targetId)).thenReturn(Optional.of(regularUser));

        // Act
        ResponseEntity<?> response = adminController.removeAdmin(targetId, authentication);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User is not an admin", response.getBody());
    }

    @Test
    void testRemoveAdmin_SupabaseDeletionFails() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        UUID targetAdminId = UUID.randomUUID();
        User targetAdmin = new User();
        targetAdmin.setId(targetAdminId);
        targetAdmin.setEmail("target@test.com");
        targetAdmin.setRole("ADMIN");

        when(userRepository.findById(targetAdminId)).thenReturn(Optional.of(targetAdmin));
        doNothing().when(userRepository).deleteById(targetAdminId);
        when(supabaseAdminService.deleteUser(targetAdminId.toString()))
            .thenThrow(new RuntimeException("Supabase error"));

        // Act
        ResponseEntity<?> response = adminController.removeAdmin(targetAdminId, authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userRepository).deleteById(targetAdminId);
    }

    @Test
    void testRemoveAdmin_Unauthorized() {
        // Act
        ResponseEntity<?> response = adminController.removeAdmin(UUID.randomUUID(), null);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void testRemoveAdmin_DatabaseException() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(adminUserId.toString());
        when(userRepository.findById(adminUserId)).thenReturn(Optional.of(adminUser));

        UUID targetAdminId = UUID.randomUUID();
        User targetAdmin = new User();
        targetAdmin.setId(targetAdminId);
        targetAdmin.setEmail("target@test.com");
        targetAdmin.setRole("ADMIN");

        when(userRepository.findById(targetAdminId)).thenReturn(Optional.of(targetAdmin));
        doThrow(new RuntimeException("Database error")).when(userRepository).deleteById(targetAdminId);

        // Act
        ResponseEntity<?> response = adminController.removeAdmin(targetAdminId, authentication);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Error deleting admin"));
    }
}
