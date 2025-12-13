package com.homosphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private UserDto user;
    
    public AuthResponse(String message) {
        this.message = message;
    }
}
