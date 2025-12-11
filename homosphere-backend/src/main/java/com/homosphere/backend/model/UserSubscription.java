package com.homosphere.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "user_subscriptions")
@Data
public class UserSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userSubscriptionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "subscription_id")
    private SubscriptionTier subscription;

    private LocalDate startDate;
    private LocalDate endDate;

    public enum PaymentFrequency {
        MONTHLY,
        YEARLY
    }

    @Enumerated(EnumType.STRING)
    private PaymentFrequency frequency;

    public enum Status {
        ACTIVE,
        INACTIVE,
        CANCELED
    }

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDate cancellationDate;
    private String cancellationReason;
}
