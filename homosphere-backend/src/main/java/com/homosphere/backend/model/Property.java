package com.homosphere.backend.model;

import com.homosphere.backend.enums.PropertyCondition;
import com.homosphere.backend.enums.PropertyType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Year;
import java.util.List;

@Entity
@Table(name = "property")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_id")
    private Long propertyId;

    @Column(name = "area_in_square_meters")
    private Double areaInSquareMeters;

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
