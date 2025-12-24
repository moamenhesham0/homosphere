package com.homosphere.backend.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.homosphere.backend.model.property.Property;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "viewing_requests")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViewingRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "request_viewing_id")
    private UUID id;

    @OneToOne(mappedBy = "viewingRequest", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"viewingRequest", "hibernateLazyInitializer", "handler"}) 
    private ProcessedViewingRequest processedRequest;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Property title for context
    @Column(name = "property_title", nullable = true, length = 255)
    private String propertyTitle;

    // Buyer information
    @Column(name = "buyer_name", nullable = false, length = 50)
    private String name;

    @Column(name = "buyer_email", nullable = false)
    private String email;

    @Column(name = "buyer_phone", nullable = false, length = 15)
    private String phone;

    @Column(name = "submitted_at", nullable = false)
    private LocalDate submittedAt;
    
    @Column(name = "preferred_date", nullable = false)
    private LocalDate preferredDate;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED,
        RESCHEDULED,
        WITHDRAWN
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status;
    
    @Column(length = 200)
    private String message;
}
