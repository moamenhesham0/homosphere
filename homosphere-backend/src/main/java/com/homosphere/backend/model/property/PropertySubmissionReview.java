package com.homosphere.backend.model.property;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "property_submission_review")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertySubmissionReview {

    @Id
    private UUID propertyListingId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "property_listing_id")
    private PropertyListing propertyListing;

    @Column(name = "message", length = 255)
    private String message;

    @Version
    private Long version;

    public void updatePropertyListing() {
        this.propertyListing.setStatusRequiresChanges();
    }
}
