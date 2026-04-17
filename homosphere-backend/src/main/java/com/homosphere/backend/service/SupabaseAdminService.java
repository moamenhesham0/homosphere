package com.homosphere.backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SupabaseAdminService {

    @Value("${supabase.service.role.key}")
    private String serviceRoleKey;

    @Value("${supabase.url}")
    private String supabaseUrl;

    private final RestTemplate restTemplate;

    public SupabaseAdminService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Confirm admin email in Supabase (auto-verify)
     */
    public boolean confirmAdminEmail(String userId) {
        try {
            String url = supabaseUrl + "/auth/v1/admin/users/" + userId;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);
            headers.set("apikey", serviceRoleKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Update user to set email_confirmed_at
            Map<String, Object> body = new HashMap<>();
            body.put("email_confirm", true);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                entity,
                String.class
            );

            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            System.err.println("Error confirming user email in Supabase: " + e.getMessage());
            return false;
        }
    }

    public String createAdminUser(String email, String password, String firstName, String lastName) {
        try {
            String url = supabaseUrl + "/auth/v1/admin/users";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);
            headers.set("apikey", serviceRoleKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> userMetadata = new HashMap<>();
            userMetadata.put("role", "ADMIN");
            if (firstName != null && !firstName.trim().isEmpty()) {
                userMetadata.put("firstName", firstName.trim());
            }
            if (lastName != null && !lastName.trim().isEmpty()) {
                userMetadata.put("lastName", lastName.trim());
            }

            Map<String, Object> appMetadata = new HashMap<>();
            appMetadata.put("role", "ADMIN");

            Map<String, Object> body = new HashMap<>();
            body.put("email", email);
            body.put("password", password);
            body.put("email_confirm", true);
            body.put("user_metadata", userMetadata);
            body.put("app_metadata", appMetadata);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Map.class
            );

            if (response == null || response.getBody() == null) {
                throw new IllegalStateException("Empty Supabase response while creating admin");
            }

            Map<?, ?> responseBody = response.getBody();
            Object id = responseBody.get("id");
            if (id == null) {
                Object userObject = responseBody.get("user");
                if (userObject instanceof Map<?, ?> userMap) {
                    id = userMap.get("id");
                }
            }

            if (id == null || id.toString().trim().isEmpty()) {
                throw new IllegalStateException("Supabase admin creation did not return user id");
            }

            return id.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error creating admin in Supabase: " + e.getMessage(), e);
        }
    }

    public boolean deleteUser(String userId) {
        try {
            String url = supabaseUrl + "/auth/v1/admin/users/" + userId;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);
            headers.set("apikey", serviceRoleKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.DELETE,
                entity,
                String.class
            );

            return response.getStatusCode() == HttpStatus.OK || 
                   response.getStatusCode() == HttpStatus.NO_CONTENT;
        } catch (Exception e) {
            System.err.println("Error deleting user from Supabase: " + e.getMessage());
            return false;
        }
    }
}
