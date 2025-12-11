package com.homosphere.backend.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "property_listing_id")
    private UUID propertyListingId;
}
