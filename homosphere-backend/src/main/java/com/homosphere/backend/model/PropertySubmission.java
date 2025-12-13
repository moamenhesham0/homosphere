package com.homosphere.backend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "property_submission")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertySubmission {

    @Id
    private UUID propertyListingId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "property_listing_id")
    private PropertyListing propertyListing;

    @Column(name = "message", length = 255)
    private String message;

    @CreationTimestamp
    @Column(name = "submission_date")
    private LocalDateTime submissionDate;
}
