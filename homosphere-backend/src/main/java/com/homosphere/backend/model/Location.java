package com.homosphere.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(
        name = "location",
        indexes = {
                @Index(name = "idx_location_lat_lng", columnList = "latitude, longitude")
        }
)
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "location_id")
    private UUID locationId;

    private String street;
    private String city;
    private String state;
    private String zipCode;

    private Double latitude;
    private Double longitude;

    public Location(String street, String city, String state, String zipCode, Double latitude, Double longitude) {
        this.locationId = java.util.UUID.randomUUID();
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
