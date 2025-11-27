package com.homosphere.backend.dto;

import java.time.LocalDate;

import com.homosphere.backend.model.UserSubscription.PaymentFrequency;

import lombok.Data;

@Data
public class UpdateSubscriptionTierDTO {
    private Long newSubscriptionTierId;
    private PaymentFrequency frequency;
    private LocalDate startDate;
    private LocalDate endDate;
}
