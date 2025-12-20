package com.homosphere.backend.model.property;

import java.time.Year;
import java.util.List;
import java.util.UUID;

import com.homosphere.backend.model.Amenity;
import com.homosphere.backend.model.Location;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.homosphere.backend.enums.PropertyCondition;
import com.homosphere.backend.enums.PropertyType;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "property")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "property_id")
    private UUID propertyId;

    @Column(name = "area_in_square_feet")
    private Double areaInSquareFeet;

    @Column(name = "bedrooms")
    private Integer bedrooms;

    @Column(name = "bathrooms")
    private Integer bathrooms;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private PropertyType type;

    @Column(name = "year_built")
    private Year yearBuilt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Amenity> amenities;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "location_id")
    private Location location;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition")
    private PropertyCondition condition;
}
