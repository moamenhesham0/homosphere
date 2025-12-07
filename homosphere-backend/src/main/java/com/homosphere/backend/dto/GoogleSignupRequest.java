package com.homosphere.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleSignupRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String googleId;
}
