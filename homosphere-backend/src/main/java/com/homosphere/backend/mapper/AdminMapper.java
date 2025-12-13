package com.homosphere.backend.mapper;

import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.homosphere.backend.model.User;

@Component
public class AdminMapper {

    /**
     * Maps admin request data to a User entity for admin creation
     */
    public User mapAdminRequestToUser(Map<String, String> request, UUID userId) {
        User user = new User();
        user.setId(userId);
        user.setEmail(request.get("email"));
        user.setFirstName(request.get("firstName"));
        user.setLastName(request.get("lastName"));
        user.setRole("ADMIN");
        user.setIsVerified(true);
        return user;
    }
}
