package com.homosphere.backend.service;

import java.util.List;
import java.util.UUID;
import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homosphere.backend.dto.ViewingRequestDTO;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.ViewingRequest;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.repository.ViewingRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ViewingRequestService {
    
    private final ViewingRequestRepository viewingRequestRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public ViewingRequest createViewingRequest(UUID userId, ViewingRequestDTO dto) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        ViewingRequest viewingRequest = new ViewingRequest();
        viewingRequest.setPropertyId(dto.getPropertyId());
        viewingRequest.setUser(user);
        viewingRequest.setName(dto.getName());
        viewingRequest.setEmail(dto.getEmail());
        viewingRequest.setPhone(dto.getPhone());
        viewingRequest.setSubmittedAt(LocalDate.now());
        viewingRequest.setPreferredDate(dto.getPreferredDate());
        viewingRequest.setStartTime(dto.getStartTime());
        viewingRequest.setEndTime(dto.getEndTime());
        viewingRequest.setMessage(dto.getMessage());
        
        return viewingRequestRepository.save(viewingRequest);
    }
    
    public List<ViewingRequest> getUserViewingRequests(UUID userId) {
        return viewingRequestRepository.findByUser_Id(userId);
    }
    
    public List<ViewingRequest> getPropertyViewingRequests(UUID propertyId) {
        return viewingRequestRepository.findByPropertyId(propertyId);
    }
}
