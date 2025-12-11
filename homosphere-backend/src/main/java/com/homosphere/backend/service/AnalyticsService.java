package com.homosphere.backend.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.homosphere.backend.dto.PropertyStatsDTO;
import com.homosphere.backend.dto.UserSubscriptionAnalyticsDTO;
import com.homosphere.backend.model.PropertyListing;
import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.model.UserSubscription;
import com.homosphere.backend.repository.PropertyLeadRepository;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AnalyticsService {

    private final UserSubscriptionRepository userSubscriptionRepository;
    private final PropertyListingRepository propertyListingRepository;
    private final PropertyLeadRepository propertyLeadRepository;
    
    public UserSubscriptionAnalyticsDTO getUserSubscriptionDetails(UUID id){

        UserSubscription userSubscription = userSubscriptionRepository.findByUserIdAndStatus(id, UserSubscription.Status.ACTIVE)
        .orElse(null);

        if (userSubscription == null) {
            return null;
        }
        
        SubscriptionTier subscriptionTier = userSubscription.getSubscription();
        UserSubscriptionAnalyticsDTO dto = new UserSubscriptionAnalyticsDTO();

        // Basic subscription info
        dto.setTier(subscriptionTier.getName());
        dto.setStatus(userSubscription.getStatus().toString());
        dto.setStartDate(userSubscription.getStartDate().toString());
        dto.setEndDate(userSubscription.getEndDate().toString());
        
        // Next payment date (end date for active subscriptions, null if canceled)
        if (userSubscription.getStatus() == UserSubscription.Status.ACTIVE) {
            dto.setNextPaymentDate(userSubscription.getEndDate().toString());
        } else {
            dto.setNextPaymentDate(null);
        }
        
        // Payment details
        if (userSubscription.getFrequency() == UserSubscription.PaymentFrequency.MONTHLY) {
            dto.setPaymentAmount(subscriptionTier.getMonthlyPrice().intValue());
            dto.setPaymentFrequency("Monthly");
        } else {
            dto.setPaymentAmount(subscriptionTier.getYearlyPrice().intValue());
            dto.setPaymentFrequency("Yearly");
        }
        
        // Calculate days remaining
        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), userSubscription.getEndDate());
        dto.setDaysRemaining((int) Math.max(0, daysRemaining));
        
        // Properties info - Get actual counts from repository
        Long propertiesCount = propertyListingRepository.countByUserId(id);
        dto.setPropertiesListed(propertiesCount != null ? propertiesCount.intValue() : 0);
        
        // Extract max listings from features or use default
        Integer maxListings = extractMaxListingsFromFeatures(subscriptionTier);
        dto.setPropertiesLimit(maxListings);
        
        // Analytics - Get actual views and leads
        Integer totalViews = propertyListingRepository.sumViewsByUserId(id);
        dto.setViews(totalViews != null ? totalViews : 0);
        
        Integer leadsGenerated = propertyLeadRepository.countLeadsByUserId(id);
        dto.setLeadsGenerated(leadsGenerated != null ? leadsGenerated : 0);
        
        return dto;
    }
    
    private Integer extractMaxListingsFromFeatures(SubscriptionTier tier) {
        // Try to find a feature that mentions property listings limit
        if (tier.getFeatures() != null) {
            for (var feature : tier.getFeatures()) {
                String name = feature.getName().toLowerCase();
                if (name.contains("listing") || name.contains("propert")) {
                    // Try to extract number from feature name (e.g., "25 Property Listings")
                    String[] parts = feature.getName().split("\\s+");
                    for (String part : parts) {
                        try {
                            return Integer.parseInt(part);
                        } catch (NumberFormatException ignored) {
                        }
                    }
                }
            }
        }
        // Default based on tier name
        String tierName = tier.getName().toLowerCase();
        if (tierName.contains("basic")) return 5;
        if (tierName.contains("pro")) return 25;
        if (tierName.contains("premium") || tierName.contains("enterprise")) return 100;
        return 10; // fallback default
    }
    
    public PropertyStatsDTO getPropertyStats(UUID propertyId, UUID userId) {
        PropertyListing listing = propertyListingRepository.findById(propertyId)
            .orElse(null);
        
        if (listing == null || !listing.getSeller().getId().equals(userId)) {
            return null;
        }
        
        // Get actual stats
        int impressions = listing.getViews() != null ? listing.getViews() : 0;
        // Clicks could be calculated as 33% of impressions (mock conversion rate)
        int clicks = impressions > 0 ? (int)(impressions * 0.33) : 0;
        // Leads are saved users
        int leads = listing.getSavedByUsers() != null ? listing.getSavedByUsers().size() : 0;
        
        return new PropertyStatsDTO(impressions, leads, clicks);
    }
    
    public List<Map<String, Object>> getUserProperties(UUID userId) {
        List<PropertyListing> properties = propertyListingRepository.findBySeller_Id(userId);
        
        return properties.stream()
            .map(property -> Map.of(
                "id", (Object) property.getPropertyListingId(),
                "title", (Object) property.getTitle()
            ))
            .collect(Collectors.toList());
    }
}