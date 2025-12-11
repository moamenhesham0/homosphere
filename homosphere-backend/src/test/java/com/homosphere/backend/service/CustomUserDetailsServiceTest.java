package com.homosphere.backend.service;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.homosphere.backend.model.User;
import com.homosphere.backend.model.UserPrincipal;
import com.homosphere.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private User user;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = new User();
        user.setId(userId);
        user.setEmail("test@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
    }

    @Test
    void loadUserByUsername_WithEmail_ReturnsUserDetails() {
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(user));

        UserDetails result = customUserDetailsService.loadUserByUsername("test@example.com");

        assertNotNull(result);
        assertInstanceOf(UserPrincipal.class, result);
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    void loadUserByUsername_WithUUID_ReturnsUserDetails() {
        String userIdString = userId.toString();
        when(userRepository.findByEmail(userIdString))
            .thenReturn(Optional.empty());
        when(userRepository.findById(userId))
            .thenReturn(Optional.of(user));

        UserDetails result = customUserDetailsService.loadUserByUsername(userIdString);

        assertNotNull(result);
        assertInstanceOf(UserPrincipal.class, result);
        verify(userRepository).findById(userId);
    }

    @Test
    void loadUserByUsername_WithInvalidEmail_ThrowsException() {
        when(userRepository.findByEmail("invalid@example.com"))
            .thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, 
            () -> customUserDetailsService.loadUserByUsername("invalid@example.com"));
    }

    @Test
    void loadUserByUsername_WithInvalidUUID_ThrowsException() {
        String invalidId = UUID.randomUUID().toString();
        when(userRepository.findByEmail(invalidId))
            .thenReturn(Optional.empty());
        when(userRepository.findById(any(UUID.class)))
            .thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, 
            () -> customUserDetailsService.loadUserByUsername(invalidId));
    }

    @Test
    void loadUserByUsername_WithInvalidString_ThrowsException() {
        when(userRepository.findByEmail("not-a-uuid"))
            .thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, 
            () -> customUserDetailsService.loadUserByUsername("not-a-uuid"));
    }

    @Test
    void loadUserById_ValidId_ReturnsUserDetails() {
        when(userRepository.findById(userId))
            .thenReturn(Optional.of(user));

        UserDetails result = customUserDetailsService.loadUserById(userId);

        assertNotNull(result);
        assertInstanceOf(UserPrincipal.class, result);
        verify(userRepository).findById(userId);
    }

    @Test
    void loadUserById_InvalidId_ThrowsException() {
        UUID invalidId = UUID.randomUUID();
        when(userRepository.findById(invalidId))
            .thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, 
            () -> customUserDetailsService.loadUserById(invalidId));
    }
}
