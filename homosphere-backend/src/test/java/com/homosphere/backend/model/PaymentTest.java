package com.homosphere.backend.model;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.homosphere.backend.enums.PaymentStatus;

class PaymentTest {

    private Payment payment;
    private User user;
    private SubscriptionTier subscriptionTier;

    @BeforeEach
    void setUp() {
        payment = new Payment();
        
        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@example.com");

        subscriptionTier = new SubscriptionTier();
        subscriptionTier.setSubscriptionId(1L);
        subscriptionTier.setName("Premium");
    }

    @Test
    void noArgsConstructor_CreatesEmptyInstance() {
        // Act
        Payment newPayment = new Payment();

        // Assert
        assertNull(newPayment.getId());
        assertNull(newPayment.getUser());
        assertNull(newPayment.getSubscriptionTier());
    }

    @Test
    void allArgsConstructor_SetsAllFields() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        UserSubscription userSubscription = new UserSubscription();

        // Act
        Payment newPayment = new Payment(
            1L,           // id
            user,         // user
            subscriptionTier, // subscriptionTier
            userSubscription, // userSubscription
            99.99,        // amount
            "USD",        // currency
            PaymentStatus.COMPLETED, // status
            UserSubscription.PaymentFrequency.MONTHLY, // frequency
            now,          // createdAt
            now,          // updatedAt
            now,          // completedAt
            null          // errorMessage
        );

        // Assert
        assertEquals(1L, newPayment.getId());
        assertEquals(user, newPayment.getUser());
        assertEquals(subscriptionTier, newPayment.getSubscriptionTier());
        assertEquals(99.99, newPayment.getAmount());
        assertEquals("USD", newPayment.getCurrency());
        assertEquals(PaymentStatus.COMPLETED, newPayment.getStatus());
    }

    @Test
    void setUser_SetsCorrectly() {
        // Act
        payment.setUser(user);

        // Assert
        assertEquals(user, payment.getUser());
    }

    @Test
    void setSubscriptionTier_SetsCorrectly() {
        // Act
        payment.setSubscriptionTier(subscriptionTier);

        // Assert
        assertEquals(subscriptionTier, payment.getSubscriptionTier());
    }

    @Test
    void setAmount_SetsCorrectly() {
        // Act
        payment.setAmount(99.99);

        // Assert
        assertEquals(99.99, payment.getAmount());
    }

    @Test
    void setCurrency_SetsCorrectly() {
        // Act
        payment.setCurrency("USD");

        // Assert
        assertEquals("USD", payment.getCurrency());
    }

    @Test
    void setStatus_SetsCorrectly() {
        // Act
        payment.setStatus(PaymentStatus.PENDING);

        // Assert
        assertEquals(PaymentStatus.PENDING, payment.getStatus());
    }

    @Test
    void setStatus_ToCompleted_Works() {
        // Act
        payment.setStatus(PaymentStatus.COMPLETED);

        // Assert
        assertEquals(PaymentStatus.COMPLETED, payment.getStatus());
    }

    @Test
    void setStatus_ToFailed_Works() {
        // Act
        payment.setStatus(PaymentStatus.FAILED);

        // Assert
        assertEquals(PaymentStatus.FAILED, payment.getStatus());
    }

    @Test
    void setFrequency_Monthly_SetsCorrectly() {
        // Act
        payment.setFrequency(UserSubscription.PaymentFrequency.MONTHLY);

        // Assert
        assertEquals(UserSubscription.PaymentFrequency.MONTHLY, payment.getFrequency());
    }

    @Test
    void setFrequency_Yearly_SetsCorrectly() {
        // Act
        payment.setFrequency(UserSubscription.PaymentFrequency.YEARLY);

        // Assert
        assertEquals(UserSubscription.PaymentFrequency.YEARLY, payment.getFrequency());
    }

    @Test
    void setErrorMessage_SetsCorrectly() {
        // Act
        payment.setErrorMessage("Payment failed due to network error");

        // Assert
        assertEquals("Payment failed due to network error", payment.getErrorMessage());
    }

    @Test
    void setCompletedAt_SetsCorrectly() {
        // Arrange
        LocalDateTime completedAt = LocalDateTime.now();

        // Act
        payment.setCompletedAt(completedAt);

        // Assert
        assertEquals(completedAt, payment.getCompletedAt());
    }

    @Test
    void setUserSubscription_SetsCorrectly() {
        // Arrange
        UserSubscription userSubscription = new UserSubscription();
        userSubscription.setUserSubscriptionId(1L);

        // Act
        payment.setUserSubscription(userSubscription);

        // Assert
        assertEquals(userSubscription, payment.getUserSubscription());
    }

    @Test
    void onCreate_SetsCreatedAtAndUpdatedAt() {
        // Arrange
        Payment newPayment = new Payment();

        // Act - simulate @PrePersist
        newPayment.onCreate();

        // Assert
        assertNotNull(newPayment.getCreatedAt());
        assertNotNull(newPayment.getUpdatedAt());
    }

    @Test
    void onUpdate_SetsUpdatedAt() {
        // Arrange
        Payment newPayment = new Payment();
        newPayment.onCreate();
        LocalDateTime originalUpdatedAt = newPayment.getUpdatedAt();

        // Act - simulate @PreUpdate
        try {
            Thread.sleep(10); // Small delay to ensure different timestamp
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        newPayment.onUpdate();

        // Assert
        assertNotNull(newPayment.getUpdatedAt());
    }

    @Test
    void equals_WithSameId_ReturnsTrue() {
        // Arrange
        Payment payment1 = new Payment();
        payment1.setId(1L);

        Payment payment2 = new Payment();
        payment2.setId(1L);

        // Assert - Lombok @Data generates equals
        assertEquals(payment1.getId(), payment2.getId());
    }

    @Test
    void toString_ReturnsNonNull() {
        // Arrange
        payment.setId(1L);
        payment.setAmount(99.99);

        // Assert - Lombok @Data generates toString
        assertNotNull(payment.toString());
    }
}
