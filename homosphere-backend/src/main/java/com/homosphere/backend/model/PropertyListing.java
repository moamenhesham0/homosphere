package com.homosphere.backend.model;

import com.homosphere.backend.enums.PropertyListingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "property_listing")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_listing_id")
    private Long propertyListingId;

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price")
    private Double price;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", referencedColumnName = "user_id", nullable = false)
    private User seller;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brooker_id", referencedColumnName = "user_id", nullable = true)
    private User brooker;

    @OneToOne (fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "banner_image_id", referencedColumnName = "property_image_id")
    private PropertyImage bannerImage;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "property_id")
    private List<PropertyImage> propertyImages;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "property_id", referencedColumnName = "property_id")
    private Property property;

    @Column(name = "views")
    private Integer views;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_listing_status")
    private PropertyListingStatus propertyListingStatus;

    @Column(name = "submission_date")
    private LocalDateTime submissionDate;

    @Column(name = "publication_date")
    private LocalDateTime publicationDate;

    @Column(name = "last_updated_date")
    private LocalDateTime lastUpdatedDate;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "property_listing_saved",
        joinColumns = @JoinColumn(name = "property_listing_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> savedByUsers;
}
