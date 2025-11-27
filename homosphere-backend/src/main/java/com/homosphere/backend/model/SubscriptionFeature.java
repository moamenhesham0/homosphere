package com.homosphere.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionFeature {
    
    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String tooltip;
}
