package com.homosphere.backend.model;

import java.util.UUID;

public class registerUser {

    private UUID id;
    private String firstName;
    private String lastName;
    private String password;
    private String Email;
    private String role;
    private Long subscriptionTierId;
    private String billingCycle;
    
    public registerUser(String firstName, String lastName, String password, String email,UUID id, String role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.Email = email;
        this.role = role;
    }
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return Email;
    }
    public void setEmail(String email) {
        Email = email;
    }
    public String getRole() {
        return role;
    }
    public Long getSubscriptionTierId() {
        return subscriptionTierId;
    }
    public void setSubscriptionTierId(Long subscriptionTierId) {
        this.subscriptionTierId = subscriptionTierId;
    }
    public String getBillingCycle() {
        return billingCycle;
    }
    public void setBillingCycle(String billingCycle) {
        this.billingCycle = billingCycle;
    }
    
}
