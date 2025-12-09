package com.homosphere.backend.model.propertiesModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Amenity")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class propertyAmunities {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   
   @Column(name = "AmenityName")
   private String amenityName;
   @Column (name = "Availability")
   private Boolean isAvailable;

    @ManyToOne
    @JoinColumn(name = "property_Id" ,referencedColumnName = "propertyId")
    private Property property;

}
