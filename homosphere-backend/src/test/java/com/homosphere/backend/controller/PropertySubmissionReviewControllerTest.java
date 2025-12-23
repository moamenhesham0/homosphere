package com.homosphere.backend.controller;

import com.homosphere.backend.dto.property.request.PropertySubmissionReviewRequest;
import com.homosphere.backend.dto.property.response.PropertySubmissionReviewResponse;
import com.homosphere.backend.service.PropertySubmissionReviewService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
    controllers = PropertySubmissionReviewController.class,
    excludeFilters = {
        @org.springframework.context.annotation.ComponentScan.Filter(type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.JwtAuthenticationFilter.class),
        @org.springframework.context.annotation.ComponentScan.Filter(type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.SecurityConfig.class),
        @org.springframework.context.annotation.ComponentScan.Filter(type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CorsConfig.class),
        @org.springframework.context.annotation.ComponentScan.Filter(type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.ApplicationConfig.class),
        @org.springframework.context.annotation.ComponentScan.Filter(type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CloudflareR2Config.class),
        @org.springframework.context.annotation.ComponentScan.Filter(type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CloudflareProperties.class)
    }
)
@AutoConfigureMockMvc(addFilters = false)
class PropertySubmissionReviewControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PropertySubmissionReviewService reviewService;

    @Test
    void createPropertySubmissionReview_returnsOk() throws Exception {
        PropertySubmissionReviewResponse response = new PropertySubmissionReviewResponse();
        when(reviewService.createPropertySubmissionReview(any())).thenReturn(response);
        String json = "{\"propertyListingId\":\"" + UUID.randomUUID() + "\",\"message\":\"Test\"}";
        mockMvc.perform(post("/api/property-submission-review/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void deletePropertySubmissionReview_returnsNoContent() throws Exception {
        UUID id = UUID.randomUUID();
        doNothing().when(reviewService).deletePropertySubmissionReview(eq(id));
        mockMvc.perform(delete("/api/property-submission-review/delete/{id}", id))
                .andExpect(status().isNoContent());
    }

    @Test
    void getPropertySubmissionReview_returnsOk() throws Exception {
        UUID id = UUID.randomUUID();
        PropertySubmissionReviewResponse response = new PropertySubmissionReviewResponse();
        when(reviewService.getPropertySubmissionReview(eq(id))).thenReturn(response);
        mockMvc.perform(get("/api/property-submission-review/{id}", id))
                .andExpect(status().isOk());
    }
}
