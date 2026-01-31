package com.homosphere.backend.updater;

import com.homosphere.backend.dto.property.request.PropertyImageRequest;
import com.homosphere.backend.dto.property.request.PropertyListingDraftRequest;
import com.homosphere.backend.dto.property.request.PropertyListingEditRequest;
import com.homosphere.backend.dto.property.request.PropertyListingRequest;
import com.homosphere.backend.mapper.PropertyImageMapper;
import com.homosphere.backend.mapper.PropertyListingMapper;
import com.homosphere.backend.model.property.Property;
import com.homosphere.backend.model.property.PropertyImage;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.repository.PropertyImageRepository;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PropertyListingUpdater {
    private final PropertyListingRepository propertyListingRepository;
    private final PropertyUpdater propertyUpdater;
    private final PropertyImageRepository propertyImageRepository;
    private final PropertyImageUpdater propertyImageUpdater;
    private final PropertyImageMapper propertyImageMapper;
    private final PropertyListingMapper propertyListingMapper;
    private final UserRepository userRepository;

    private void updateBannerImage(PropertyListing propertyListing, PropertyListingDraftRequest propertyListingDraftRequest) {
        PropertyImageRequest bannerImageRequest = propertyListingDraftRequest.getBannerImage();

        if(bannerImageRequest == null) {
            propertyImageUpdater.remove(propertyListing.getBannerImage());
            propertyListing.setBannerImage(null);
        } else {
            propertyImageUpdater.update(propertyListing.getBannerImage(), bannerImageRequest);
        }
    }

    private void updateImages(PropertyListing propertyListing, PropertyListingDraftRequest propertyListingDraftRequest) {
        List<PropertyImageRequest> imageRequests = propertyListingDraftRequest.getPropertyImages();
        List<PropertyImage> existingImages = propertyListing.getPropertyImages();

        final int existingSize = existingImages.size();
        final int requestSize = imageRequests.size();

        // Update property images
        for (int i = 0 ; i< Math.min(existingSize, requestSize); i++) {
            propertyImageUpdater.update(existingImages.get(i), imageRequests.get(i));
        }
        // Remove extra images
        for (int i = requestSize ; i< existingSize; i++) {
            propertyImageUpdater.remove(existingImages.get(i));
        }

        // Add new images
        for (int i = existingSize ; i< requestSize; i++) {
            PropertyImage image = propertyImageMapper.toEntity(imageRequests.get(i));
            image.setPropertyListing(propertyListing);
            propertyListing.addPropertyImage(image);
            propertyImageRepository.save(image);
        }
    }

    public void applyDraft(PropertyListing propertyListing, PropertyListingDraftRequest propertyListingDraftRequest) {
        propertyListing.setTitle(propertyListingDraftRequest.getTitle());
        propertyListing.setDescription(propertyListingDraftRequest.getDescription());
        propertyListing.setPrice(propertyListingDraftRequest.getPrice());
        propertyUpdater.update(propertyListing.getProperty(), propertyListingDraftRequest.getProperty());
        propertyListing.setManagementStatus(propertyListingDraftRequest.getManagementStatus());
        updateBannerImage(propertyListing, propertyListingDraftRequest);
        updateImages(propertyListing, propertyListingDraftRequest);
        propertyListingRepository.save(propertyListing);
    }

    public void applyEdit(PropertyListing propertyListing, PropertyListingEditRequest propertyListingEditRequest) {
        propertyListing.setTitle(propertyListingEditRequest.getTitle());
        propertyListing.setDescription(propertyListingEditRequest.getDescription());
        propertyListing.setPrice(propertyListingEditRequest.getPrice());
        propertyListing.setManagementStatus(propertyListingEditRequest.getManagementStatus());
        propertyListingRepository.save(propertyListing);
    }

    public PropertyListing createWithRelationLinks(PropertyListingRequest propertyListingRequest) {
        PropertyListing propertyListing = propertyListingMapper.toEntity(propertyListingRequest, userRepository);

        Property property = propertyUpdater.createWithRelationLinks(propertyListingRequest.getProperty());
        propertyListing.setProperty(property);

        PropertyImage bannerImage = propertyImageMapper.toEntity(propertyListingRequest.getBannerImage());
        List<PropertyImage> images = propertyListingRequest.getPropertyImages().stream()
                .map(propertyImageMapper::toEntity)
                .toList();

        propertyListing.setBannerImage(bannerImage);
        for(PropertyImage image : images) {
            propertyListing.addPropertyImage(image);
        }
        return propertyListing;
    }
}
