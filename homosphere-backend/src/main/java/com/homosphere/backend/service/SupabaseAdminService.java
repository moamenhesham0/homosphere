package com.homosphere.backend.service;

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
