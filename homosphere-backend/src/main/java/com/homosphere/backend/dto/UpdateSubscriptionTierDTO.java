package com.homosphere.backend.dto;

import java.time.LocalDate;

import com.homosphere.backend.model.UserSubscription.PaymentFrequency;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateSubscriptionTierDTO {
    @NotNull(message = "Subscription tier ID is required")
    private Long newSubscriptionTierId;
    
    @NotNull(message = "Payment frequency is required")
    private PaymentFrequency frequency;
    
    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be in the present or future")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDate endDate;
}
