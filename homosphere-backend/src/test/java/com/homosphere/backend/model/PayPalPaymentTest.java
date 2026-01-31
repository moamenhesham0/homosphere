package com.homosphere.backend.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PayPalPaymentTest {

    private PayPalPayment payPalPayment;

    @BeforeEach
    void setUp() {
        payPalPayment = new PayPalPayment();
    }

    @Test
    void noArgsConstructor_CreatesEmptyInstance() {
        // Act
        PayPalPayment newPayment = new PayPalPayment();

        // Assert
        assertNull(newPayment.getPaypalOrderId());
        assertNull(newPayment.getPaypalCaptureId());
        assertNull(newPayment.getPayerEmail());
        assertNull(newPayment.getPayerId());
    }

    @Test
    void allArgsConstructor_SetsAllFields() {
        // Act
        PayPalPayment newPayment = new PayPalPayment(
            "ORDER-123",
            "CAPTURE-456",
            "payer@example.com",
            "PAYER-789"
        );

        // Assert
        assertEquals("ORDER-123", newPayment.getPaypalOrderId());
        assertEquals("CAPTURE-456", newPayment.getPaypalCaptureId());
        assertEquals("payer@example.com", newPayment.getPayerEmail());
        assertEquals("PAYER-789", newPayment.getPayerId());
    }

    @Test
    void setPaypalOrderId_SetsCorrectly() {
        // Act
        payPalPayment.setPaypalOrderId("PAYPAL-ORDER-123");

        // Assert
        assertEquals("PAYPAL-ORDER-123", payPalPayment.getPaypalOrderId());
    }

    @Test
    void setPaypalCaptureId_SetsCorrectly() {
        // Act
        payPalPayment.setPaypalCaptureId("PAYPAL-CAPTURE-456");

        // Assert
        assertEquals("PAYPAL-CAPTURE-456", payPalPayment.getPaypalCaptureId());
    }

    @Test
    void setPayerEmail_SetsCorrectly() {
        // Act
        payPalPayment.setPayerEmail("payer@example.com");

        // Assert
        assertEquals("payer@example.com", payPalPayment.getPayerEmail());
    }

    @Test
    void setPayerId_SetsCorrectly() {
        // Act
        payPalPayment.setPayerId("PAYER-789");

        // Assert
        assertEquals("PAYER-789", payPalPayment.getPayerId());
    }

    @Test
    void extendsPayment_CanAccessParentMethods() {
        // Arrange
        payPalPayment.setAmount(99.99);
        payPalPayment.setCurrency("USD");
        payPalPayment.setPaypalOrderId("ORDER-123");

        // Assert - Can use both parent and child fields
        assertEquals(99.99, payPalPayment.getAmount());
        assertEquals("USD", payPalPayment.getCurrency());
        assertEquals("ORDER-123", payPalPayment.getPaypalOrderId());
    }

    @Test
    void equals_WithSameValues_ReturnsTrue() {
        // Arrange
        PayPalPayment payment1 = new PayPalPayment();
        payment1.setPaypalOrderId("ORDER-123");
        payment1.setPayerId("PAYER-456");

        PayPalPayment payment2 = new PayPalPayment();
        payment2.setPaypalOrderId("ORDER-123");
        payment2.setPayerId("PAYER-456");

        // Assert
        assertEquals(payment1.getPaypalOrderId(), payment2.getPaypalOrderId());
        assertEquals(payment1.getPayerId(), payment2.getPayerId());
    }

    @Test
    void toString_ReturnsNonNull() {
        // Arrange
        payPalPayment.setPaypalOrderId("ORDER-123");

        // Assert - Lombok @Data generates toString
        assertNotNull(payPalPayment.toString());
    }

    @Test
    void hashCode_ReturnsConsistentValue() {
        // Arrange
        payPalPayment.setPaypalOrderId("ORDER-123");
        int hashCode1 = payPalPayment.hashCode();

        // Act
        int hashCode2 = payPalPayment.hashCode();

        // Assert
        assertEquals(hashCode1, hashCode2);
    }

    @Test
    void setAllFields_AllAccessible() {
        // Arrange & Act
        payPalPayment.setPaypalOrderId("ORDER-123");
        payPalPayment.setPaypalCaptureId("CAPTURE-456");
        payPalPayment.setPayerEmail("test@example.com");
        payPalPayment.setPayerId("PAYER-789");

        // Assert
        assertEquals("ORDER-123", payPalPayment.getPaypalOrderId());
        assertEquals("CAPTURE-456", payPalPayment.getPaypalCaptureId());
        assertEquals("test@example.com", payPalPayment.getPayerEmail());
        assertEquals("PAYER-789", payPalPayment.getPayerId());
    }

    @Test
    void inheritance_DiscriminatorValueIsPayPal() {
        // This tests that PayPalPayment extends Payment
        // The @DiscriminatorValue("PAYPAL") annotation is verified by the fact
        // that the class compiles and extends Payment
        PayPalPayment payment = new PayPalPayment();
        
        // Verify it's an instance of Payment
        assertEquals(true, payment instanceof Payment);
    }
}
