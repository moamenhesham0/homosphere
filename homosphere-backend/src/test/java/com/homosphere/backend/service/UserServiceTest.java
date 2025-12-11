package com.homosphere.backend.service;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.homosphere.backend.model.RegisterUser;
import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.UserRepository;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private UUID testId;
    private RegisterUser testRegisterUser;
    private User testProfile;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testId = UUID.randomUUID();
        testRegisterUser = new RegisterUser(
            "John",
            "Doe",
            "password123",
            "john.doe@example.com",
            testId,
            "buyer"
        );
        
        testProfile = new User(
            "John",
            "Doe",
            "password123",
            "john.doe@example.com",
            testId
        );
    }

    // Tests for saveprofile method
    @Test
    void saveUser_ShouldSaveUser_WhenValidRegisterUserProvided() {
        // Arrange
        when(userRepository.save(any(User.class))).thenReturn(testProfile);

        // Act
        userService.saveUser(testRegisterUser);

        // Assert
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void saveUser_ShouldCreateUserWithCorrectData() {
        // Arrange
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            assertEquals("John", savedUser.getFirstName());
            assertEquals("Doe", savedUser.getLastName());
            assertEquals("password123", savedUser.getPassword());
            assertEquals("john.doe@example.com", savedUser.getEmail());
            assertEquals(testId, savedUser.getUser_id());
            return savedUser;
        });

        // Act
        userService.saveUser(testRegisterUser);

        // Assert
        verify(userRepository, times(1)).save(any(User.class));
    }

    // Tests for editInformation method
    @Test
    void editInformation_ShouldReturnNull_WhenUserNotFound() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act
        User result = userService.editInformation(nonExistentId, testProfile);

        // Assert
        assertNull(result);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void editInformation_ShouldReturnNull_WhenUserUpdateIsNull() {
        // Arrange
        when(userRepository.findById(testId)).thenReturn(Optional.of(testProfile));

        // Act
        User result = userService.editInformation(testId, null);

        // Assert
        assertNull(result);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void editInformation_ShouldUpdateUser_WhenValidDataProvided() {
        // Arrange
        User existingUser = new User("John", "Doe", "password123", "john.doe@example.com", testId);
        
        User updateData = new User();
        updateData.setFirstName("Jane");
        updateData.setLastName("Smith");
        updateData.setBio("Software Engineer");
        updateData.setRole("Developer");
        updateData.setPhone("+1234567890");
        updateData.setLocation("New York");
        updateData.setPhoto("photo.jpg");

        when(userRepository.findById(testId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User result = userService.editInformation(testId, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Jane", result.getFirstName());
        assertEquals("Smith", result.getLastName());
        assertEquals("Software Engineer", result.getBio());
        assertEquals("Developer", result.getRole());
        assertEquals("+1234567890", result.getPhone());
        assertEquals("New York", result.getLocation());
        assertEquals("photo.jpg", result.getPhoto());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void editInformation_ShouldUpdateOnlyProvidedFields() {
        // Arrange
        User existingUser = new User("John", "Doe", "password123", "john.doe@example.com", testId);
        existingUser.setBio("Old Bio");
        existingUser.setLocation("Old Location");
        
        User updateData = new User();
        updateData.setBio("New Bio");

        when(userRepository.findById(testId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User result = userService.editInformation(testId, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("New Bio", result.getBio());
        verify(userRepository, times(1)).save(any(User.class));
    }

    // Tests for GetInformation method
    @Test
    void getInformation_ShouldReturnProfile_WhenProfileExists() {
        // Arrange
        when(userRepository.findById(testId)).thenReturn(Optional.of(testProfile));
        // Act
        User result = userService.getInformation(testId);

        // Assert
        assertNotNull(result);
        assertEquals(testId, result.getUser_id());
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
        assertEquals("john.doe@example.com", result.getEmail());
        verify(userRepository, times(1)).findById(testId);
    }

    @Test
    void getInformation_ShouldReturnNull_WhenProfileDoesNotExist() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act
        User result = userService.getInformation(nonExistentId);

        // Assert
        assertNull(result);
        verify(userRepository, times(1)).findById(nonExistentId);
    }

    // Tests for signUpUser method
    @Test
    void signUpUser_ShouldReturnOK_WhenProfileExists() {
        // Arrange
        when(userRepository.findById(testId)).thenReturn(Optional.of(testProfile));

        // Act
        String result = userService.signUpUser(testId);

        // Assert
        assertEquals("OK", result);
        verify(userRepository, times(1)).findById(testId);
    }

    @Test
    void signUpUser_ShouldReturnFail_WhenProfileDoesNotExist() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act
        String result = userService.signUpUser(nonExistentId);

        // Assert
        assertEquals("Fail", result);
        verify(userRepository, times(1)).findById(nonExistentId);
    }
}