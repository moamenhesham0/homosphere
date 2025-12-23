package com.homosphere.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.*;

import com.homosphere.backend.model.property.PropertyListing;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.homosphere.backend.dto.PropertyStatsDTO;
import com.homosphere.backend.dto.UserSubscriptionAnalyticsDTO;
import com.homosphere.backend.model.*;
import com.homosphere.backend.repository.PropertyLeadRepository;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;

class AnalyticsServiceTest {

    @Mock
    private UserSubscriptionRepository userSubscriptionRepository;

    @Mock
    private PropertyListingRepository propertyListingRepository;

    @Mock
    private PropertyLeadRepository propertyLeadRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    private UUID testUserId;
    private UUID testPropertyId;
    private User testUser;
    private SubscriptionTier testTier;
    private UserSubscription testSubscription;
    private PropertyListing testPropertyListing;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testUserId = UUID.randomUUID();
        testPropertyId = UUID.randomUUID();
        
        // Create test user
        testUser = new User();
        testUser.setId(testUserId);
        testUser.setEmail("test@example.com");
        testUser.setRole("SELLER");
        
        // Create test subscription features
        List<SubscriptionFeature> featuresList = new ArrayList<>();
        SubscriptionFeature feature1 = new SubscriptionFeature();
        feature1.setName("25 Property Listings");
        featuresList.add(feature1);
        
        SubscriptionFeature feature2 = new SubscriptionFeature();
        feature2.setName("Priority Support");
        featuresList.add(feature2);
        
        // Create test subscription tier
        testTier = new SubscriptionTier();
        testTier.setSubscriptionId(1L);
        testTier.setName("Pro");
        testTier.setMonthlyPrice(29.99);
        testTier.setYearlyPrice(299.99);
        testTier.setFeatures(featuresList);
        
        // Create test user subscription
        testSubscription = new UserSubscription();
        testSubscription.setUserSubscriptionId(1L);
        testSubscription.setUser(testUser);
        testSubscription.setSubscription(testTier);
        testSubscription.setStatus(UserSubscription.Status.ACTIVE);
        testSubscription.setFrequency(UserSubscription.PaymentFrequency.MONTHLY);
        testSubscription.setStartDate(LocalDate.now().minusMonths(1));
        testSubscription.setEndDate(LocalDate.now().plusMonths(1));
        
        // Create test property listing
        testPropertyListing = new PropertyListing();
        testPropertyListing.setPropertyListingId(testPropertyId);
        testPropertyListing.setTitle("Beautiful House");
        testPropertyListing.setSeller(testUser);
        testPropertyListing.setViews(150);
        testPropertyListing.setSavedByUsers(Arrays.asList(
            createUser(UUID.randomUUID()),
            createUser(UUID.randomUUID())
        ));
    }
    
    private User createUser(UUID id) {
        User user = new User();
        user.setId(id);
        return user;
    }

    @Test
    void testGetUserSubscriptionDetails_Success() {
        // Arrange
        when(userSubscriptionRepository.findByUserIdAndStatus(testUserId, UserSubscription.Status.ACTIVE))
            .thenReturn(Optional.of(testSubscription));
        when(propertyListingRepository.countByUserId(testUserId)).thenReturn(15L);
        when(propertyListingRepository.sumViewsByUserId(testUserId)).thenReturn(500);
        when(propertyLeadRepository.countLeadsByUserId(testUserId)).thenReturn(25);
        
        // Act
        UserSubscriptionAnalyticsDTO result = analyticsService.getUserSubscriptionDetails(testUserId);
        
        // Assert
        assertNotNull(result);
        assertEquals("Pro", result.getTier());
        assertEquals("ACTIVE", result.getStatus());
        assertEquals(testSubscription.getStartDate().toString(), result.getStartDate());
        assertEquals(testSubscription.getEndDate().toString(), result.getEndDate());
        assertEquals(testSubscription.getEndDate().toString(), result.getNextPaymentDate());
        assertEquals(29, result.getPaymentAmount()); // BigDecimal 29.99 converted to int
        assertEquals("Monthly", result.getPaymentFrequency());
        assertEquals(15, result.getPropertiesListed());
        assertEquals(25, result.getPropertiesLimit()); // Extracted from "25 Property Listings" feature
        assertEquals(500, result.getViews());
        assertEquals(25, result.getLeadsGenerated());
        assertTrue(result.getDaysRemaining() >= 0);
        
        // Verify interactions
        verify(userSubscriptionRepository).findByUserIdAndStatus(testUserId, UserSubscription.Status.ACTIVE);
        verify(propertyListingRepository).countByUserId(testUserId);
        verify(propertyListingRepository).sumViewsByUserId(testUserId);
        verify(propertyLeadRepository).countLeadsByUserId(testUserId);
    }

    @Test
    void testGetUserSubscriptionDetails_NoActiveSubscription() {
        // Arrange
        when(userSubscriptionRepository.findByUserIdAndStatus(testUserId, UserSubscription.Status.ACTIVE))
            .thenReturn(Optional.empty());
        
        // Act
        UserSubscriptionAnalyticsDTO result = analyticsService.getUserSubscriptionDetails(testUserId);
        
        // Assert
        assertNull(result);
        verify(userSubscriptionRepository).findByUserIdAndStatus(testUserId, UserSubscription.Status.ACTIVE);
        verify(propertyListingRepository, never()).countByUserId(any());
    }

    @Test
    void testGetUserSubscriptionDetails_YearlyPayment() {
        // Arrange
        testSubscription.setFrequency(UserSubscription.PaymentFrequency.YEARLY);
        when(userSubscriptionRepository.findByUserIdAndStatus(testUserId, UserSubscription.Status.ACTIVE))
            .thenReturn(Optional.of(testSubscription));
        when(propertyListingRepository.countByUserId(testUserId)).thenReturn(10L);
        when(propertyListingRepository.sumViewsByUserId(testUserId)).thenReturn(300);
        when(propertyLeadRepository.countLeadsByUserId(testUserId)).thenReturn(15);
        
        // Act
        UserSubscriptionAnalyticsDTO result = analyticsService.getUserSubscriptionDetails(testUserId);
        
        // Assert
        assertNotNull(result);
        assertEquals(299, result.getPaymentAmount()); // BigDecimal 299.99 converted to int
        assertEquals("Yearly", result.getPaymentFrequency());
    }

    @Test
    void testGetUserSubscriptionDetails_CanceledSubscription() {
        // Arrange
        testSubscription.setStatus(UserSubscription.Status.CANCELED);
        when(userSubscriptionRepository.findByUserIdAndStatus(testUserId, UserSubscription.Status.ACTIVE))
            .thenReturn(Optional.of(testSubscription));
        when(propertyListingRepository.countByUserId(testUserId)).thenReturn(5L);
        when(propertyListingRepository.sumViewsByUserId(testUserId)).thenReturn(100);
        when(propertyLeadRepository.countLeadsByUserId(testUserId)).thenReturn(5);
        
        // Act
        UserSubscriptionAnalyticsDTO result = analyticsService.getUserSubscriptionDetails(testUserId);
        
        // Assert
        assertNotNull(result);
        assertNull(result.getNextPaymentDate()); // Null for canceled subscriptions
    }

    @Test
    void testGetUserSubscriptionDetails_NullCountsFromRepository() {
        // Arrange
        when(userSubscriptionRepository.findByUserIdAndStatus(testUserId, UserSubscription.Status.ACTIVE))
            .thenReturn(Optional.of(testSubscription));
        when(propertyListingRepository.countByUserId(testUserId)).thenReturn(null);
        when(propertyListingRepository.sumViewsByUserId(testUserId)).thenReturn(null);
        when(propertyLeadRepository.countLeadsByUserId(testUserId)).thenReturn(null);
        
        // Act
        UserSubscriptionAnalyticsDTO result = analyticsService.getUserSubscriptionDetails(testUserId);
        
        // Assert
        assertNotNull(result);
        assertEquals(0, result.getPropertiesListed());
        assertEquals(0, result.getViews());
        assertEquals(0, result.getLeadsGenerated());
    }

    @Test
    void testGetUserSubscriptionDetails_BasicTierDefaultLimit() {
        // Arrange
        testTier.setName("Basic");
        testTier.setFeatures(new ArrayList<>()); // No features
        when(userSubscriptionRepository.findByUserIdAndStatus(testUserId, UserSubscription.Status.ACTIVE))
            .thenReturn(Optional.of(testSubscription));
        when(propertyListingRepository.countByUserId(testUserId)).thenReturn(3L);
        when(propertyListingRepository.sumViewsByUserId(testUserId)).thenReturn(50);
        when(propertyLeadRepository.countLeadsByUserId(testUserId)).thenReturn(2);
        
        // Act
        UserSubscriptionAnalyticsDTO result = analyticsService.getUserSubscriptionDetails(testUserId);
        
        // Assert
        assertNotNull(result);
        assertEquals(5, result.getPropertiesLimit()); // Default for Basic tier
    }

    @Test
    void testGetUserSubscriptionDetails_PremiumTierDefaultLimit() {
        // Arrange
        testTier.setName("Premium");
        testTier.setFeatures(new ArrayList<>()); // No features
        when(userSubscriptionRepository.findByUserIdAndStatus(testUserId, UserSubscription.Status.ACTIVE))
            .thenReturn(Optional.of(testSubscription));
        when(propertyListingRepository.countByUserId(testUserId)).thenReturn(50L);
        when(propertyListingRepository.sumViewsByUserId(testUserId)).thenReturn(1000);
        when(propertyLeadRepository.countLeadsByUserId(testUserId)).thenReturn(100);
        
        // Act
        UserSubscriptionAnalyticsDTO result = analyticsService.getUserSubscriptionDetails(testUserId);
        
        // Assert
        assertNotNull(result);
        assertEquals(100, result.getPropertiesLimit()); // Default for Premium tier
    }

    @Test
    void testGetPropertyStats_Success() {
        // Arrange
        when(propertyListingRepository.findById(testPropertyId))
            .thenReturn(Optional.of(testPropertyListing));
        
        // Act
        PropertyStatsDTO result = analyticsService.getPropertyStats(testPropertyId, testUserId);
        
        // Assert
        assertNotNull(result);
        assertEquals(150, result.getImpressions());
        assertEquals(2, result.getLeads()); // Size of savedByUsers set
        assertEquals(49, result.getClicks()); // 33% of 150 impressions = 49
        verify(propertyListingRepository).findById(testPropertyId);
    }

    @Test
    void testGetPropertyStats_PropertyNotFound() {
        // Arrange
        when(propertyListingRepository.findById(testPropertyId))
            .thenReturn(Optional.empty());
        
        // Act
        PropertyStatsDTO result = analyticsService.getPropertyStats(testPropertyId, testUserId);
        
        // Assert
        assertNull(result);
        verify(propertyListingRepository).findById(testPropertyId);
    }

    @Test
    void testGetPropertyStats_UnauthorizedUser() {
        // Arrange
        UUID differentUserId = UUID.randomUUID();
        when(propertyListingRepository.findById(testPropertyId))
            .thenReturn(Optional.of(testPropertyListing));
        
        // Act
        PropertyStatsDTO result = analyticsService.getPropertyStats(testPropertyId, differentUserId);
        
        // Assert
        assertNull(result); // Returns null for unauthorized access
        verify(propertyListingRepository).findById(testPropertyId);
    }

    @Test
    void testGetPropertyStats_ZeroViews() {
        // Arrange
        testPropertyListing.setViews(0);
        testPropertyListing.setSavedByUsers(new ArrayList<>());
        when(propertyListingRepository.findById(testPropertyId))
            .thenReturn(Optional.of(testPropertyListing));
        
        // Act
        PropertyStatsDTO result = analyticsService.getPropertyStats(testPropertyId, testUserId);
        
        // Assert
        assertNotNull(result);
        assertEquals(0, result.getImpressions());
        assertEquals(0, result.getLeads());
        assertEquals(0, result.getClicks());
    }

    @Test
    void testGetPropertyStats_NullViews() {
        // Arrange
        testPropertyListing.setViews(null);
        testPropertyListing.setSavedByUsers(null);
        when(propertyListingRepository.findById(testPropertyId))
            .thenReturn(Optional.of(testPropertyListing));
        
        // Act
        PropertyStatsDTO result = analyticsService.getPropertyStats(testPropertyId, testUserId);
        
        // Assert
        assertNotNull(result);
        assertEquals(0, result.getImpressions());
        assertEquals(0, result.getLeads());
        assertEquals(0, result.getClicks());
    }

    @Test
    void testGetUserProperties_Success() {
        // Arrange
        PropertyListing property1 = new PropertyListing();
        property1.setPropertyListingId(UUID.randomUUID());
        property1.setTitle("Property 1");
        
        PropertyListing property2 = new PropertyListing();
        property2.setPropertyListingId(UUID.randomUUID());
        property2.setTitle("Property 2");
        
        List<PropertyListing> properties = Arrays.asList(property1, property2);
        when(propertyListingRepository.findBySeller_Id(testUserId)).thenReturn(properties);
        
        // Act
        List<Map<String, Object>> result = analyticsService.getUserProperties(testUserId);
        
        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(property1.getPropertyListingId(), result.get(0).get("id"));
        assertEquals("Property 1", result.get(0).get("title"));
        assertEquals(property2.getPropertyListingId(), result.get(1).get("id"));
        assertEquals("Property 2", result.get(1).get("title"));
        verify(propertyListingRepository).findBySeller_Id(testUserId);
    }

    @Test
    void testGetUserProperties_EmptyList() {
        // Arrange
        when(propertyListingRepository.findBySeller_Id(testUserId)).thenReturn(Collections.emptyList());
        
        // Act
        List<Map<String, Object>> result = analyticsService.getUserProperties(testUserId);
        
        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(propertyListingRepository).findBySeller_Id(testUserId);
    }

    @Test
    void testGetUserSubscriptionDetails_ExpiredSubscription() {
        // Arrange
        testSubscription.setEndDate(LocalDate.now().minusDays(5)); // Expired 5 days ago
        when(userSubscriptionRepository.findByUserIdAndStatus(testUserId, UserSubscription.Status.ACTIVE))
            .thenReturn(Optional.of(testSubscription));
        when(propertyListingRepository.countByUserId(testUserId)).thenReturn(10L);
        when(propertyListingRepository.sumViewsByUserId(testUserId)).thenReturn(200);
        when(propertyLeadRepository.countLeadsByUserId(testUserId)).thenReturn(10);
        
        // Act
        UserSubscriptionAnalyticsDTO result = analyticsService.getUserSubscriptionDetails(testUserId);
        
        // Assert
        assertNotNull(result);
        assertEquals(0, result.getDaysRemaining()); // Should be 0, not negative
    }
}
