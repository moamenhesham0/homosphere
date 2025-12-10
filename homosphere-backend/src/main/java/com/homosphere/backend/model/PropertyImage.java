package com.homosphere.backend.model;

import jakarta.persistence.*;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_image_id")
    private Long propertyImageId;

    @Column(name = "image_url")
    private String imageUrl;
}
