package com.homosphere.backend.updater;

import com.homosphere.backend.dto.property.request.PropertyImageRequest;
import com.homosphere.backend.dto.property.request.PropertyRequest;
import com.homosphere.backend.model.property.PropertyImage;
import com.homosphere.backend.repository.PropertyImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PropertyImageUpdater {
    private final PropertyImageRepository propertyImageRepository;

    public void update(PropertyImage propertyImage, PropertyImageRequest propertyImageRequest) {
        propertyImage.setImageUrl(propertyImageRequest.getImageUrl());
        propertyImageRepository.save(propertyImage);
    }

    public void remove(PropertyImage propertyImage) {
        propertyImageRepository.delete(propertyImage);
    }
}
