package com.homosphere.backend.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "profiles")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "ban_expired_date")
    private OffsetDateTime banExpiredDate;

    private String bio;

    @Column(name = "failed_login_attempt")
    private Integer failedLoginAttempt;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "google_outh_id")
    private Integer googleOauthId;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "last_name")
    private String lastName;

    private String location;

    private String password;

    private String role;

    private String status;

    private String username;

    @Column(name = "verification_token")
    private String verificationToken;
}
