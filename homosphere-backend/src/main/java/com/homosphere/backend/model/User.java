package com.homosphere.backend.model;


import java.time.OffsetDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@NoArgsConstructor
public class User {


    @Id
    @Column(name = "user_id")
    private UUID id;

    @Column(name = "email")
    private String email;

    @Column(name= "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "googleOuthId")
    private Integer googleOuthId;

    @Column(name = "role")
    private String role;

    @Column (name = "password")
    private String password;

    @Column(name = "username", unique = true)
    private String userName;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "status")
    private String status;

    @Column(name = "failed_login_attempt")
    private Integer failedLoginAttempt;

    @Column(name = "ban_expired_date")
    private OffsetDateTime banExpiredDate;

    @Column (name = "location")
    private String location;

    @Column (name = "phone")
    private String phone;

    @Column (name = "bio")
    private String bio;

    @Column (name = "photo")
    private String photo;

    public User(String firstName , String lastName , String password , String email,UUID userId){
         this.email=email;
         this.firstName = firstName;
         this.lastName = lastName;
         this.password = password;
         this.id=userId;
    }

    public UUID getUserId() {
        return this.id;
    }

}