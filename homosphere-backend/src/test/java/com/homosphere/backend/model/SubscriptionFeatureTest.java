package com.homosphere.backend.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import org.junit.jupiter.api.Test;

class SubscriptionFeatureTest {

    @Test
    void constructorAssignsFields() {
        SubscriptionFeature feature = new SubscriptionFeature("Unlimited Listings", "Post as many listings as you want");

        assertEquals("Unlimited Listings", feature.getName());
        assertEquals("Post as many listings as you want", feature.getTooltip());
    }

    @Test
    void settersAndGettersWork() {
        SubscriptionFeature feature = new SubscriptionFeature();
        feature.setName("Priority Support");
        feature.setTooltip("Reach our team 24/7");

        assertEquals("Priority Support", feature.getName());
        assertEquals("Reach our team 24/7", feature.getTooltip());
    }

    @Test
    void equalsReturnsTrueForSameContent() {
        SubscriptionFeature left = new SubscriptionFeature("Advanced Analytics", "Detailed reporting dashboard");
        SubscriptionFeature right = new SubscriptionFeature("Advanced Analytics", "Detailed reporting dashboard");

        assertEquals(left, right);
    }

    @Test
    void equalsReturnsFalseForDifferentContent() {
        SubscriptionFeature left = new SubscriptionFeature("Advanced Analytics", "Detailed reporting dashboard");
        SubscriptionFeature right = new SubscriptionFeature("Advanced Analytics", "Different tooltip");

        assertNotEquals(left, right);
    }
}
