package com.homosphere.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViewingRequestDTO {
    private UUID propertyId;
    private String propertyTitle; // Added for frontend context
    private String name;
    private String email;
    private String phone;
    private LocalDate preferredDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String message;
}
