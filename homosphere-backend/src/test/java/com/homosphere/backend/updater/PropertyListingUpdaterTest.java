package com.homosphere.backend.updater;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

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

class PropertyListingUpdaterTest {
    @Mock PropertyListingRepository propertyListingRepository;
    @Mock PropertyUpdater propertyUpdater;
    @Mock PropertyImageRepository propertyImageRepository;
    @Mock PropertyImageUpdater propertyImageUpdater;
    @Mock PropertyImageMapper propertyImageMapper;
    @Mock PropertyListingMapper propertyListingMapper;
    @Mock UserRepository userRepository;
    @InjectMocks PropertyListingUpdater propertyListingUpdater;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void createWithRelationLinks_ReturnsPropertyListing() {
        PropertyListingRequest req = new PropertyListingRequest();
        Property property = new Property();
        PropertyListing listing = new PropertyListing();
        when(propertyListingMapper.toEntity(any(), any())).thenReturn(listing);
        when(propertyUpdater.createWithRelationLinks(any())).thenReturn(property);
        when(propertyImageMapper.toEntity(any(PropertyImageRequest.class))).thenReturn(new PropertyImage());
        req.setPropertyImages(new ArrayList<>());
        req.setBannerImage(new PropertyImageRequest());
        PropertyListing result = propertyListingUpdater.createWithRelationLinks(req);
        assertNotNull(result);
        assertEquals(property, result.getProperty());
    }

        @Test
        void applyDraft_RemovesBannerImage_WhenBannerImageIsNull() {
            PropertyListing listing = new PropertyListing();
            PropertyImage banner = new PropertyImage();
            listing.setBannerImage(banner);
            PropertyListingDraftRequest draft = new PropertyListingDraftRequest();
            draft.setTitle("T");
            draft.setDescription("D");
            draft.setPrice(1.0);
            draft.setProperty(new com.homosphere.backend.dto.property.request.PropertyRequest());
            draft.setManagementStatus(null);
            draft.setBannerImage(null); // Banner image is null
            draft.setPropertyImages(new ArrayList<>());
            doNothing().when(propertyUpdater).update(any(), any());
            doNothing().when(propertyImageUpdater).remove(any());
            when(propertyListingRepository.save(any())).thenReturn(listing);
            propertyListingUpdater.applyDraft(listing, draft);
            assertEquals(null, listing.getBannerImage());
        }

        @Test
        void applyDraft_HandlesEmptyPropertyImages() {
            PropertyListing listing = new PropertyListing();
            listing.setPropertyImages(new ArrayList<>());
            PropertyListingDraftRequest draft = new PropertyListingDraftRequest();
            draft.setTitle("T");
            draft.setDescription("D");
            draft.setPrice(1.0);
            draft.setProperty(new com.homosphere.backend.dto.property.request.PropertyRequest());
            draft.setManagementStatus(null);
            draft.setBannerImage(new PropertyImageRequest());
            draft.setPropertyImages(new ArrayList<>()); // Empty images
            doNothing().when(propertyUpdater).update(any(), any());
            when(propertyListingRepository.save(any())).thenReturn(listing);
            propertyListingUpdater.applyDraft(listing, draft);
            assertEquals(0, listing.getPropertyImages().size());
        }

        @Test
        void applyDraft_SetsManagementStatus_WhenNotNull() {
            PropertyListing listing = new PropertyListing();
            listing.setProperty(new Property());
            PropertyListingDraftRequest draft = new PropertyListingDraftRequest();
            draft.setTitle("T");
            draft.setDescription("D");
            draft.setPrice(1.0);
            draft.setProperty(new com.homosphere.backend.dto.property.request.PropertyRequest());
            draft.setManagementStatus(com.homosphere.backend.enums.PropertyListingManagementStatus.BROKER_AUTHORIZED);
            draft.setBannerImage(new PropertyImageRequest());
            draft.setPropertyImages(new ArrayList<>());
            doNothing().when(propertyUpdater).update(any(), any());
            when(propertyListingRepository.save(any())).thenReturn(listing);
            propertyListingUpdater.applyDraft(listing, draft);
            assertEquals(com.homosphere.backend.enums.PropertyListingManagementStatus.BROKER_AUTHORIZED, listing.getManagementStatus());
        }

        @Test
        void createWithRelationLinks_HandlesNullBannerImageAndEmptyImages() {
            PropertyListingRequest req = new PropertyListingRequest();
            Property property = new Property();
            PropertyListing listing = new PropertyListing();
            when(propertyListingMapper.toEntity(any(), any())).thenReturn(listing);
            when(propertyUpdater.createWithRelationLinks(any())).thenReturn(property);
            when(propertyImageMapper.toEntity(any(PropertyImageRequest.class))).thenReturn(new PropertyImage());
            req.setPropertyImages(new ArrayList<>()); // Empty images
            req.setBannerImage(null); // Null banner image
            PropertyListing result = propertyListingUpdater.createWithRelationLinks(req);
            assertNotNull(result);
            assertEquals(property, result.getProperty());
            assertEquals(null, result.getBannerImage());
            assertEquals(0, result.getPropertyImages().size());
        }

    @Test
    void applyDraft_UpdatesFieldsAndSaves() {
        PropertyListing listing = new PropertyListing();
        listing.setProperty(new Property());
        PropertyListingDraftRequest draft = new PropertyListingDraftRequest();
        draft.setTitle("T"); draft.setDescription("D"); draft.setPrice(1.0);
        draft.setProperty(new com.homosphere.backend.dto.property.request.PropertyRequest());
        draft.setManagementStatus(null);
        draft.setBannerImage(new PropertyImageRequest());
        draft.setPropertyImages(new ArrayList<>());
        doNothing().when(propertyUpdater).update(any(), any());
        when(propertyListingRepository.save(any())).thenReturn(listing);
        propertyListingUpdater.applyDraft(listing, draft);
        assertEquals("T", listing.getTitle());
        assertEquals("D", listing.getDescription());
        assertEquals(1.0, listing.getPrice());
    }

    @Test
    void applyEdit_UpdatesFieldsAndSaves() {
        PropertyListing listing = new PropertyListing();
        PropertyListingEditRequest edit = new PropertyListingEditRequest();
        edit.setTitle("T"); edit.setDescription("D"); edit.setPrice(2.0);
        edit.setManagementStatus(null);
        when(propertyListingRepository.save(any())).thenReturn(listing);
        propertyListingUpdater.applyEdit(listing, edit);
        assertEquals("T", listing.getTitle());
        assertEquals("D", listing.getDescription());
        assertEquals(2.0, listing.getPrice());
    }
}
