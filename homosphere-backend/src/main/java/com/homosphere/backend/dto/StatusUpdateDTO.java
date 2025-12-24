package com.homosphere.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.homosphere.backend.model.ViewingRequest.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateDTO {
    private Status status;
    private String agentMessage;
    private LocalDate newDate;
    private LocalTime newStartTime;
    private LocalTime newEndTime;
    private UUID processedBy;
}
