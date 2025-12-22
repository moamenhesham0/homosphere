package com.homosphere.backend.model.property;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "property_image")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "property_image_id")
    private UUID propertyImageId;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_listing_id", nullable = false)
    private PropertyListing propertyListing;
}
