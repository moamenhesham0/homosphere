package com.homosphere.backend.dto;

import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String userName;
    private String role;
    private String location;
    private String phone;
    private String bio;
    private String photo;
    private Boolean isVerified;
}
