package com.homosphere.backend.model;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import com.homosphere.backend.enums.PropertyListingManagementStatus;
import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.model.property.PropertyImage;
import com.homosphere.backend.model.property.PropertyListing;

class PropertyListingTest {
    @Test
    void testPropertyListingConstructorAndSetters() {
        PropertyListing listing = new PropertyListing();
        listing.setTitle("Test Title");
        listing.setDescription("Test Description");
        // Set more fields as needed
        assertEquals("Test Title", listing.getTitle());
        assertEquals("Test Description", listing.getDescription());
    }

    @Test
    void testSettersAndGetters() {
        PropertyListing listing = new PropertyListing();
        UUID id = UUID.randomUUID();
        listing.setPropertyListingId(id);
        listing.setTitle("T");
        listing.setDescription("D");
        listing.setPrice(1.0);
        assertEquals(id, listing.getPropertyListingId());
        assertEquals("T", listing.getTitle());
        assertEquals("D", listing.getDescription());
        assertEquals(1.0, listing.getPrice());
    }

    @Test
    void testStatusAndManagementMethods() {
        PropertyListing listing = new PropertyListing();
        listing.setStatusPending();
        assertEquals(PropertyListingStatus.PENDING, listing.getStatus());
        assertNotNull(listing.getLastSubmissionDate());
        listing.setStatusRequiresChanges();
        assertEquals(PropertyListingStatus.REQUIRES_CHANGES, listing.getStatus());
        listing.setStatusPublished();
        assertEquals(PropertyListingStatus.PUBLISHED, listing.getStatus());
        assertNotNull(listing.getPublicationDate());
        listing.setStatusSold();
        assertEquals(PropertyListingStatus.SOLD, listing.getStatus());
        assertNotNull(listing.getSoldDate());
        listing.setPropertyListingManagementStatusSellerAuthorized();
        assertEquals(PropertyListingManagementStatus.SELLER_AUTHORIZED, listing.getManagementStatus());
        listing.setPropertyListingManagementStatusBrokerRequested();
        assertEquals(PropertyListingManagementStatus.BROKER_REQUESTED, listing.getManagementStatus());
        listing.setPropertyListingManagementStatusBrokerPendingAuthorization();
        assertEquals(PropertyListingManagementStatus.BROKER_PENDING_AUTHORIZATION, listing.getManagementStatus());
        listing.setManagementStatusBrokerAuthorized();
        assertEquals(PropertyListingManagementStatus.BROKER_AUTHORIZED, listing.getManagementStatus());
    }

    @Test
    void testAddPropertyImageAndGetCurrentManager() {
        PropertyListing listing = new PropertyListing();
        PropertyImage image = new PropertyImage();
        listing.addPropertyImage(image);
        assertTrue(listing.getPropertyImages().contains(image));
        assertEquals(listing, image.getPropertyListing());
        User seller = new User();
        User broker = new User();
        listing.setSeller(seller);
        listing.setBroker(broker);
        listing.setManagementStatus(PropertyListingManagementStatus.BROKER_AUTHORIZED);
        assertEquals(broker, listing.getCurrentManager());
        listing.setManagementStatus(PropertyListingManagementStatus.SELLER_AUTHORIZED);
        assertEquals(seller, listing.getCurrentManager());
    }

    @Test
    void testIsOpenForBrokerManagement() {
        PropertyListing listing = new PropertyListing();
        listing.setManagementStatus(PropertyListingManagementStatus.BROKER_PENDING_AUTHORIZATION);
        assertTrue(listing.isOpenForBrokerManagement());
        listing.setManagementStatus(PropertyListingManagementStatus.BROKER_REQUESTED);
        assertTrue(listing.isOpenForBrokerManagement());
        listing.setManagementStatus(PropertyListingManagementStatus.BROKER_AUTHORIZED);
        assertFalse(listing.isOpenForBrokerManagement());
    }
}
