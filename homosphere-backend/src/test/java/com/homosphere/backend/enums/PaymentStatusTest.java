package com.homosphere.backend.enums;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

class PaymentStatusTest {

    @Test
    void pending_Exists() {
        // Assert
        assertEquals("PENDING", PaymentStatus.PENDING.name());
    }

    @Test
    void completed_Exists() {
        // Assert
        assertEquals("COMPLETED", PaymentStatus.COMPLETED.name());
    }

    @Test
    void failed_Exists() {
        // Assert
        assertEquals("FAILED", PaymentStatus.FAILED.name());
    }

    @Test
    void cancelled_Exists() {
        // Assert
        assertEquals("CANCELLED", PaymentStatus.CANCELLED.name());
    }

    @Test
    void refunded_Exists() {
        // Assert
        assertEquals("REFUNDED", PaymentStatus.REFUNDED.name());
    }

    @Test
    void values_ReturnsAllStatuses() {
        // Act
        PaymentStatus[] values = PaymentStatus.values();

        // Assert
        assertNotNull(values);
        assertEquals(5, values.length);
    }

    @Test
    void valueOf_Pending_ReturnsCorrect() {
        // Act
        PaymentStatus status = PaymentStatus.valueOf("PENDING");

        // Assert
        assertEquals(PaymentStatus.PENDING, status);
    }

    @Test
    void valueOf_Completed_ReturnsCorrect() {
        // Act
        PaymentStatus status = PaymentStatus.valueOf("COMPLETED");

        // Assert
        assertEquals(PaymentStatus.COMPLETED, status);
    }

    @Test
    void valueOf_Failed_ReturnsCorrect() {
        // Act
        PaymentStatus status = PaymentStatus.valueOf("FAILED");

        // Assert
        assertEquals(PaymentStatus.FAILED, status);
    }

    @Test
    void valueOf_Cancelled_ReturnsCorrect() {
        // Act
        PaymentStatus status = PaymentStatus.valueOf("CANCELLED");

        // Assert
        assertEquals(PaymentStatus.CANCELLED, status);
    }

    @Test
    void valueOf_Refunded_ReturnsCorrect() {
        // Act
        PaymentStatus status = PaymentStatus.valueOf("REFUNDED");

        // Assert
        assertEquals(PaymentStatus.REFUNDED, status);
    }

    @Test
    void ordinal_ReturnsCorrectOrder() {
        // Assert
        assertEquals(0, PaymentStatus.PENDING.ordinal());
        assertEquals(1, PaymentStatus.COMPLETED.ordinal());
        assertEquals(2, PaymentStatus.FAILED.ordinal());
        assertEquals(3, PaymentStatus.CANCELLED.ordinal());
        assertEquals(4, PaymentStatus.REFUNDED.ordinal());
    }

    @Test
    void toString_ReturnsName() {
        // Assert
        assertEquals("PENDING", PaymentStatus.PENDING.toString());
        assertEquals("COMPLETED", PaymentStatus.COMPLETED.toString());
        assertEquals("FAILED", PaymentStatus.FAILED.toString());
        assertEquals("CANCELLED", PaymentStatus.CANCELLED.toString());
        assertEquals("REFUNDED", PaymentStatus.REFUNDED.toString());
    }
}
