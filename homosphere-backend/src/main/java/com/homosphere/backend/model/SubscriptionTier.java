package com.homosphere.backend.model;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "subscription_tiers")
@Data
public class SubscriptionTier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subscriptionId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private boolean seller;

    @Column(nullable = false)
    private Double monthlyPrice;

    @Column(nullable = false)
    private Double yearlyPrice;

    @Column(nullable = false)
    private Integer visibilityPriority;

    private String description;

    @Column(nullable = false)
    private boolean Popular;

    @ElementCollection
    @CollectionTable(name = "subscription_features", joinColumns = @JoinColumn(name = "subscription_id"))
    private List<SubscriptionFeature> features;
}
