package com.homosphere.backend.model;


import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "profile")
@NoArgsConstructor 
public class Profile {

    
    @Id 
    private UUID id;
    
    @Column(name = "email")
    private String email;

    @Column(name= "First Name")
    private String firstName;

    @Column(name = "Last Name")
    private String lastName;

    @Column(name = "googleOuthId")
    private int googleOuthId;

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

    @Column (name = "Phone number")
    private String Phone;

    @Column (name = "bio")
    private String bio;

    @Column (name = "photo")
    private String photo;

    public Profile(String firstName , String lastName , String password , String email,UUID id){
         this.email=email;
         this.firstName = firstName;
         this.lastName = lastName;
         this.password = password;
         this.id=id;
    }

} 