package com.homosphere.backend.service;

import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UsersListingService {

    @Autowired
    private UserRepository userRepository;

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findAll().stream()
                .filter(user -> role.equals(user.getRole()))
                .collect(Collectors.toList());
    }

    public Page<User> getUsersByRole(String role, Pageable pageable) {
        return userRepository.findByRoleIgnoreCase(role, pageable);
    }

    public User getUserById(UUID userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public Page<User> searchUsers(String query, Pageable pageable) {
        return userRepository.findByEmailIgnoreCaseOrFullName(query, pageable);
    }
}
