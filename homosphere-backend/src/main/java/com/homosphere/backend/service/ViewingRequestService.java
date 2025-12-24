package com.homosphere.backend.service;

import java.util.List;
import java.util.UUID;
import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homosphere.backend.dto.ViewingRequestDTO;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.ViewingRequest;
import com.homosphere.backend.model.property.Property;
import com.homosphere.backend.repository.PropertyRepository;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.repository.ViewingRequestRepository;
import com.homosphere.backend.dto.StatusUpdateDTO;
import com.homosphere.backend.model.ProcessedViewingRequest;
import com.homosphere.backend.repository.ProcessedViewingRequestRepository; // Ensure this is imported
import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ViewingRequestService {
    
    private final ViewingRequestRepository viewingRequestRepository;
    private final ProcessedViewingRequestRepository processedViewingRequestRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    
    @Transactional
    public ViewingRequest createViewingRequest(UUID userId, ViewingRequestDTO dto) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Only buyers can submit viewing requests
        // Allow if role is null, empty, or explicitly BUYER
        String userRole = user.getRole();
        if (userRole != null && !userRole.isEmpty() && 
            !"BUYER".equalsIgnoreCase(userRole)) {
            throw new RuntimeException("Only buyers can submit viewing requests. Your role is: " + userRole);
        }
        
        Property property = propertyRepository.findById(dto.getPropertyId())
            .orElseThrow(() -> new RuntimeException("Property not found"));
        
        ViewingRequest viewingRequest = new ViewingRequest();
        viewingRequest.setProperty(property);
        viewingRequest.setUser(user);
        viewingRequest.setPropertyTitle(dto.getPropertyTitle());
        viewingRequest.setName(dto.getName());
        viewingRequest.setEmail(dto.getEmail());
        viewingRequest.setPhone(dto.getPhone());
        viewingRequest.setSubmittedAt(LocalDate.now());
        viewingRequest.setPreferredDate(dto.getPreferredDate());
        viewingRequest.setStartTime(dto.getStartTime());
        viewingRequest.setEndTime(dto.getEndTime());
        viewingRequest.setStatus(ViewingRequest.Status.PENDING);
        viewingRequest.setMessage(dto.getMessage());
        
        return viewingRequestRepository.save(viewingRequest);
    }

    @Transactional
    public ViewingRequest updateRequestStatus(UUID requestId, StatusUpdateDTO dto) {
       
        ViewingRequest request = viewingRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Viewing Request not found"));

        request.setStatus(dto.getStatus());

        ProcessedViewingRequest processedRecord = processedViewingRequestRepository
            .findAll().stream()
            .filter(p -> p.getViewingRequest().getId().equals(requestId))
            .findFirst()
            .orElse(new ProcessedViewingRequest());

        processedRecord.setViewingRequest(request);
        processedRecord.setProcessedAt(LocalDateTime.now());
        processedRecord.setAgentMessage(dto.getAgentMessage());
        processedRecord.setNewDate(dto.getNewDate());
        processedRecord.setNewStartTime(dto.getNewStartTime());
        processedRecord.setNewEndTime(dto.getNewEndTime());

        User agent = userRepository.findById(dto.getProcessedBy())
                .orElseThrow(() -> new RuntimeException("Agent user not found with ID: " + dto.getProcessedBy()));
        
        processedRecord.setProcessedBy(agent);

        processedViewingRequestRepository.save(processedRecord);
        return viewingRequestRepository.save(request);
    }
    
    public List<ViewingRequest> getUserViewingRequests(UUID userId) {
        return viewingRequestRepository.findByUser_Id(userId);
    }
    
    public List<ViewingRequest> getPropertyViewingRequests(UUID propertyId) {
        return viewingRequestRepository.findByProperty_PropertyId(propertyId);
    }
    
    public List<ViewingRequest> getViewingRequestsForSellerProperties(UUID sellerId) {
        return viewingRequestRepository.findByPropertyListingSellerId(sellerId);
    }
}
