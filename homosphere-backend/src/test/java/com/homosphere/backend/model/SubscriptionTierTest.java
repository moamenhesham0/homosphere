package com.homosphere.backend.model;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class SubscriptionTierTest {

    @Test
    void settersAndGettersPersistValues() {
        SubscriptionTier tier = new SubscriptionTier();
        tier.setSubscriptionId(42L);
        tier.setName("Platinum");
        tier.setSeller(true);
        tier.setMonthlyPrice(149.99);
        tier.setYearlyPrice(1499.99);
        tier.setVisibilityPriority(1);
        tier.setDescription("Best for power sellers");
        tier.setPopular(true);

        assertEquals(42L, tier.getSubscriptionId());
        assertEquals("Platinum", tier.getName());
        assertTrue(tier.isSeller());
        assertEquals(149.99, tier.getMonthlyPrice());
        assertEquals(1499.99, tier.getYearlyPrice());
        assertEquals(1, tier.getVisibilityPriority());
        assertEquals("Best for power sellers", tier.getDescription());
        assertTrue(tier.isPopular());
    }

    @Test
    void featureListIsStoredAndReturned() {
        SubscriptionTier tier = new SubscriptionTier();
        List<SubscriptionFeature> features = new ArrayList<>();
        features.add(new SubscriptionFeature("Boosted Ads", "Top placement for listings"));
        features.add(new SubscriptionFeature("Video Tours", "Attach walkthrough videos"));
        tier.setFeatures(features);

        assertEquals(2, tier.getFeatures().size());
        assertEquals("Boosted Ads", tier.getFeatures().get(0).getName());
    }

    @Test
    void equalsReturnsTrueForSameContent() {
        SubscriptionTier left = buildTier(1L, "Gold");
        SubscriptionTier right = buildTier(1L, "Gold");

        assertEquals(left, right);
    }

    @Test
    void equalsReturnsFalseForDifferentIds() {
        SubscriptionTier left = buildTier(1L, "Gold");
        SubscriptionTier right = buildTier(2L, "Gold");

        assertNotEquals(left, right);
    }

    @Test
    void hashCodeAlignsWithEquals() {
        SubscriptionTier left = buildTier(7L, "Silver");
        SubscriptionTier right = buildTier(7L, "Silver");

        assertEquals(left.hashCode(), right.hashCode());
    }

    @Test
    void sellerFlagCanBeUpdated() {
        SubscriptionTier tier = new SubscriptionTier();
        tier.setSeller(false);
        assertFalse(tier.isSeller());

        tier.setSeller(true);
        assertTrue(tier.isSeller());
    }

    private SubscriptionTier buildTier(Long id, String name) {
        SubscriptionTier tier = new SubscriptionTier();
        tier.setSubscriptionId(id);
        tier.setName(name);
        tier.setSeller(true);
        tier.setMonthlyPrice(99.99);
        tier.setYearlyPrice(999.99);
        tier.setVisibilityPriority(2);
        tier.setDescription("Test tier");
        tier.setPopular(false);
        tier.setFeatures(new ArrayList<>(List.of(
                new SubscriptionFeature("Priority Support", "Reach us first"),
                new SubscriptionFeature("Analytics", "Track conversion rates")
        )));
        return tier;
    }
}
