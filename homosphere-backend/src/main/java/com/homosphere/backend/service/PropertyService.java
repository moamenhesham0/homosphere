package com.homosphere.backend.service;

import com.homosphere.backend.mapper.LocationMapper;
import com.homosphere.backend.repository.LocationRepository;
import com.homosphere.backend.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PropertyService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    private LocationMapper locationMapper;


}
