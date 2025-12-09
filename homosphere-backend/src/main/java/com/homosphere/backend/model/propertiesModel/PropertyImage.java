package com.homosphere.backend.model.propertiesModel;

import java.time.LocalDate;



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
@Table (name = "prop_images")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class PropertyImage {
    
    @Id
    @GeneratedValue (strategy =  GenerationType.IDENTITY)
    private Long image_id;
    @Column (name = "URL")
    private String URL;
    @Column (name = "uploadDate")
    private LocalDate uploadDate;
    @Column (name = "OrderImage")
    private Integer imageOrder;

    @ManyToOne
    @JoinColumn(name = "property_Id" ,referencedColumnName = "propertyId", nullable = true)
    private Property property;
     



}
