package com.homosphere.backend.controller;

import com.homosphere.backend.dto.property.request.PropertySubmissionReviewRequest;
import com.homosphere.backend.dto.property.response.PropertySubmissionReviewResponse;
import com.homosphere.backend.model.property.PropertySubmissionReview;
import com.homosphere.backend.service.PropertySubmissionReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/property-submission-review")
@RequiredArgsConstructor
public class PropertySubmissionReviewController {

    private final PropertySubmissionReviewService propertySubmissionReviewService;

    @PostMapping("/create")
    public ResponseEntity<?> createPropertySubmissionReview(@RequestBody PropertySubmissionReviewRequest propertySubmissionReviewRequest) {
        PropertySubmissionReviewResponse response = propertySubmissionReviewService.createPropertySubmissionReview(propertySubmissionReviewRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePropertySubmissionReview(@PathVariable("id") UUID id) {
        propertySubmissionReviewService.deletePropertySubmissionReview(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertySubmissionReviewResponse> getPropertySubmissionReview(@PathVariable("id") UUID id) {
        PropertySubmissionReviewResponse response = propertySubmissionReviewService.getPropertySubmissionReview(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
