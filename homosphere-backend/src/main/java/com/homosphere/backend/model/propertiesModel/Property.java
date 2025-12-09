package com.homosphere.backend.model.propertiesModel;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table (name = "Property")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long propertyId;
    @Column(name = "title")
    private String title;
     @Column(name = "transactionType")
    private String transactionType;
     @Column(name = "description")
    private String description;
     @Column(name = "city")
    private String city;
     @Column(name = "state")
    private String state;
     @Column(name = "ZipCode")
    private String zipCode;
     @Column(name = "location")
    private String location;
     @Column(name = "Area")
    private Double areaSqrt;
     @Column(name = "type")
    private String type;
     @Column(name = "price")
    private Double price;
     @Column(name = "Bathsrooms")
    private Integer NumberBaths;
     @Column(name = "Bedrooms")
    private Integer NumberBeds;
     @Column(name = "Condition")
    private String condition;
     @Column(name = "Promoted")
    private String isPromoted;
     @Column(name = "ApprovalStatus")
    private String approvalStatus;
     @Column(name = "age")
    private Integer age;
     @Column(name = "viewCount")
    private Integer viewCount; 
    @OneToMany (mappedBy = "property")
    List<propertyAmunities> propertyAmunities = new ArrayList<>();
    @OneToMany (mappedBy = "property")
    List<PropertyImage>propertyImages = new ArrayList<>();
}
