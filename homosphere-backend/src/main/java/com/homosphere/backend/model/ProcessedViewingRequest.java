package com.homosphere.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "processed_viewing_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedViewingRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "processed_request_id")
    private long id;
    
    @OneToOne
    @JoinColumn(name = "viewing_request_id", nullable = false, unique = true)
    private ViewingRequest viewingRequest;
    
    @Column(name = "processed_at", nullable = false)
    private LocalDateTime processedAt;
    
    @ManyToOne
    @JoinColumn(name = "processed_by", nullable = false)
    private User processedBy;
    
    @Column(name = "agent_message", length = 200)
    private String agentMessage;
    
    // New proposed date/time for reschedule
    @Column(name = "new_date")
    private LocalDate newDate;
    
    @Column(name = "new_start_time")
    private LocalTime newStartTime;
    
    @Column(name = "new_end_time")
    private LocalTime newEndTime;
}
