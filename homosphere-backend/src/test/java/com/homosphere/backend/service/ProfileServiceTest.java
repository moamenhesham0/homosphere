package com.homosphere.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.homosphere.backend.model.Profile;
import com.homosphere.backend.model.registerUser;
import com.homosphere.backend.repository.ProfileRepository;

class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private ProfileService profileService;

    private UUID testId;
    private registerUser testRegisterUser;
    private Profile testProfile;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testId = UUID.randomUUID();
        testRegisterUser = new registerUser(
            "John",
            "Doe",
            "password123",
            "john.doe@example.com",
            testId,
            "buyer"
        );
        
        testProfile = new Profile(
            "John",
            "Doe",
            "password123",
            "john.doe@example.com",
            testId
        );
    }

    // Tests for saveprofile method
    @Test
    void saveprofile_ShouldSaveProfile_WhenValidRegisterUserProvided() {
        // Arrange
        when(profileRepository.save(any(Profile.class))).thenReturn(testProfile);

        // Act
        profileService.saveprofile(testRegisterUser);

        // Assert
        verify(profileRepository, times(1)).save(any(Profile.class));
    }

    @Test
    void saveprofile_ShouldCreateProfileWithCorrectData() {
        // Arrange
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> {
            Profile savedProfile = invocation.getArgument(0);
            assertEquals("John", savedProfile.getFirstName());
            assertEquals("Doe", savedProfile.getLastName());
            assertEquals("password123", savedProfile.getPassword());
            assertEquals("john.doe@example.com", savedProfile.getEmail());
            assertEquals(testId, savedProfile.getId());
            return savedProfile;
        });

        // Act
        profileService.saveprofile(testRegisterUser);

        // Assert
        verify(profileRepository, times(1)).save(any(Profile.class));
    }

    // Tests for editInformation method
    @Test
    void editInformation_ShouldReturnNull_WhenProfileNotFound() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(profileRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act
        Profile result = profileService.editInformation(nonExistentId, testProfile);

        // Assert
        assertNull(result);
        verify(profileRepository, never()).save(any(Profile.class));
    }

    @Test
    void editInformation_ShouldReturnNull_WhenProfileUpdateIsNull() {
        // Arrange
        when(profileRepository.findById(testId)).thenReturn(Optional.of(testProfile));

        // Act
        Profile result = profileService.editInformation(testId, null);

        // Assert
        assertNull(result);
        verify(profileRepository, never()).save(any(Profile.class));
    }

    @Test
    void editInformation_ShouldUpdateProfile_WhenValidDataProvided() {
        // Arrange
        Profile existingProfile = new Profile("John", "Doe", "password123", "john.doe@example.com", testId);
        
        Profile updateData = new Profile();
        updateData.setFirstName("Jane");
        updateData.setLastName("Smith");
        updateData.setBio("Software Engineer");
        updateData.setRole("Developer");
        updateData.setPhone("+1234567890");
        updateData.setLocation("New York");
        updateData.setPhoto("photo.jpg");

        when(profileRepository.findById(testId)).thenReturn(Optional.of(existingProfile));
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Profile result = profileService.editInformation(testId, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Jane", result.getFirstName());
        assertEquals("Smith", result.getLastName());
        assertEquals("Software Engineer", result.getBio());
        assertEquals("Developer", result.getRole());
        assertEquals("+1234567890", result.getPhone());
        assertEquals("New York", result.getLocation());
        assertEquals("photo.jpg", result.getPhoto());
        verify(profileRepository, times(1)).save(any(Profile.class));
    }

    @Test
    void editInformation_ShouldUpdateOnlyProvidedFields() {
        // Arrange
        Profile existingProfile = new Profile("John", "Doe", "password123", "john.doe@example.com", testId);
        existingProfile.setBio("Old Bio");
        existingProfile.setLocation("Old Location");
        
        Profile updateData = new Profile();
        updateData.setBio("New Bio");

        when(profileRepository.findById(testId)).thenReturn(Optional.of(existingProfile));
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Profile result = profileService.editInformation(testId, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("New Bio", result.getBio());
        verify(profileRepository, times(1)).save(any(Profile.class));
    }

    // Tests for GetInformation method
    @Test
    void getInformation_ShouldReturnProfile_WhenProfileExists() {
        // Arrange
        when(profileRepository.findById(testId)).thenReturn(Optional.of(testProfile));

        // Act
        Profile result = profileService.GetInformation(testId);

        // Assert
        assertNotNull(result);
        assertEquals(testId, result.getId());
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
        assertEquals("john.doe@example.com", result.getEmail());
        verify(profileRepository, times(1)).findById(testId);
    }

    @Test
    void getInformation_ShouldReturnNull_WhenProfileDoesNotExist() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(profileRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act
        Profile result = profileService.GetInformation(nonExistentId);

        // Assert
        assertNull(result);
        verify(profileRepository, times(1)).findById(nonExistentId);
    }

    // Tests for signuPprofile method
    @Test
    void signuPprofile_ShouldReturnOK_WhenProfileExists() {
        // Arrange
        when(profileRepository.findById(testId)).thenReturn(Optional.of(testProfile));

        // Act
        String result = profileService.signuPprofile(testId);

        // Assert
        assertEquals("OK", result);
        verify(profileRepository, times(1)).findById(testId);
    }

    @Test
    void signuPprofile_ShouldReturnFail_WhenProfileDoesNotExist() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(profileRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act
        String result = profileService.signuPprofile(nonExistentId);

        // Assert
        assertEquals("Fail", result);
        verify(profileRepository, times(1)).findById(nonExistentId);
    }
}