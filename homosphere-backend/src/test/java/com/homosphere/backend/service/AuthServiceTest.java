package com.homosphere.backend.service;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.homosphere.backend.dto.GoogleSignupRequest;
import com.homosphere.backend.dto.SignupRequest;
import com.homosphere.backend.dto.UserDto;
import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private UUID userId;
    private User user;
    private GoogleSignupRequest googleRequest;
    private SignupRequest signupRequest;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = new User();
        user.setId(userId);
        user.setEmail("test@example.com");
        user.setFirstName("Test");
        user.setLastName("User");

        googleRequest = new GoogleSignupRequest();
        googleRequest.setEmail("test@gmail.com");
        googleRequest.setFirstName("Google");
        googleRequest.setLastName("User");

        signupRequest = new SignupRequest();
        signupRequest.setEmail("signup@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Signup");
        signupRequest.setLastName("User");
    }

    @Test
    void processGoogleSignup_NewUser_CreatesUser() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto result = authService.processGoogleSignup(userId, googleRequest);

        assertNotNull(result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void processGoogleSignup_ExistingUser_UpdatesUser() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto result = authService.processGoogleSignup(userId, googleRequest);

        assertNotNull(result);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void processRegularSignup_NewUser_CreatesUser() {
        when(userRepository.findByEmail(signupRequest.getEmail())).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto result = authService.processRegularSignup(userId, signupRequest);

        assertNotNull(result);
        verify(passwordEncoder, times(1)).encode(signupRequest.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void processRegularSignup_ExistingUser_UpdatesUser() {
        when(userRepository.findByEmail(signupRequest.getEmail())).thenReturn(Optional.of(user));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto result = authService.processRegularSignup(userId, signupRequest);

        assertNotNull(result);
        verify(passwordEncoder, times(1)).encode(signupRequest.getPassword());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void processRegularSignup_EmailAlreadyRegisteredToDifferentUser_ThrowsException() {
        User differentUser = new User();
        differentUser.setId(UUID.randomUUID());
        differentUser.setEmail(signupRequest.getEmail());
        
        when(userRepository.findByEmail(signupRequest.getEmail())).thenReturn(Optional.of(differentUser));

        assertThrows(IllegalArgumentException.class, 
            () -> authService.processRegularSignup(userId, signupRequest));
        
        verify(passwordEncoder, never()).encode(any());
        verify(userRepository, never()).save(any());
    }
}
