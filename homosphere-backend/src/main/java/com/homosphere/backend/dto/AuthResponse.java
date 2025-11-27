package com.homosphere.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private ProfileDto user;
    
    public AuthResponse(String message) {
        this.message = message;
    }
}
