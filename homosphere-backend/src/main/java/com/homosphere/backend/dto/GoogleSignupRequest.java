package com.homosphere.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleSignupRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "First name is required")
    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    private String lastName;
    
    private String avatarUrl;
    
    @NotBlank(message = "Google ID is required")
    private String googleId;
    
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(BUYER|SELLER|BROKER)$", message = "Role must be BUYER, SELLER, or BROKER")
    private String role; // BUYER, SELLER, or BROKER (ADMIN not allowed)
}
