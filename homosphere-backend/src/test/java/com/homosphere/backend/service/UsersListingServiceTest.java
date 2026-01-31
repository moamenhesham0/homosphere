package com.homosphere.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;

import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.UserRepository;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UsersListingServiceTest {

    @InjectMocks
    private UsersListingService usersListingService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers() {
        User user1 = new User("John", "Doe", "pass", "john@example.com", UUID.randomUUID());
        User user2 = new User("Jane", "Smith", "pass", "jane@example.com", UUID.randomUUID());
        List<User> mockUsers = Arrays.asList(user1, user2);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, 10);
        Mockito.when(userRepository.findAll(pageable)).thenReturn(new PageImpl<>(mockUsers));
        org.springframework.data.domain.Page<User> resultPage = usersListingService.getAllUsers(pageable);
        List<User> result = resultPage.getContent();
        assertEquals(2, result.size());
        assertEquals("John", result.get(0).getFirstName());
        assertEquals("Jane", result.get(1).getFirstName());
    }

    @Test
    void testFilterUsersByRole() {
        User user1 = new User("John", "Doe", "pass", "john@example.com", UUID.randomUUID());
        user1.setRole("ADMIN");
        User user2 = new User("Jane", "Smith", "pass", "jane@example.com", UUID.randomUUID());
        user2.setRole("USER");
        List<User> mockUsers = Arrays.asList(user1, user2);
        Mockito.when(userRepository.findAll()).thenReturn(mockUsers);
        List<User> admins = usersListingService.getUsersByRole("ADMIN");
        assertEquals(1, admins.size());
        assertEquals("ADMIN", admins.get(0).getRole());
    }

    @Test
    void testGetUserById() {
        UUID userId = UUID.randomUUID();
        User user = new User("John", "Doe", "pass", "john@example.com", userId);
        Mockito.when(userRepository.findById(userId)).thenReturn(java.util.Optional.of(user));
        User result = usersListingService.getUserById(userId);
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
    }

    // Add more tests for other service methods as needed
}
