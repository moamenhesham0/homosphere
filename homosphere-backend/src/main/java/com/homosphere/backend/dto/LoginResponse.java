package com.homosphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String message;
    private String token;
    private UserDto user;
    
    public LoginResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }
}
