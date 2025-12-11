package com.homosphere.backend.dto;

import lombok.Data;

@Data
public class UserSubscriptionAnalyticsDTO {
    private String tier;
    private String status;
    private String startDate;
    private String endDate;
    private String nextPaymentDate;
    private int paymentAmount;
    private String paymentFrequency;
    private int propertiesListed;
    private int propertiesLimit;
    private int views;
    private int leadsGenerated;
    private int daysRemaining;

}
