package com.homosphere.backend.controller;

import com.homosphere.backend.service.PropertySubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/property-submission")
public class PropertySubmissionController {

    @Autowired
    private PropertySubmissionService propertySubmissionService;


}
