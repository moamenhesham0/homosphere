package com.homosphere.backend.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import org.junit.jupiter.api.Test;

class PaymentExceptionTest {

    @Test
    void constructor_WithMessageAndStatusCode_SetsCorrectly() {
        // Arrange & Act
        PaymentException exception = new PaymentException("Payment failed", 400);

        // Assert
        assertEquals("Payment failed", exception.getMessage());
        assertEquals(400, exception.getStatusCode());
        assertNull(exception.getCause());
    }

    @Test
    void constructor_WithMessageCauseAndStatusCode_SetsCorrectly() {
        // Arrange
        RuntimeException cause = new RuntimeException("Original error");

        // Act
        PaymentException exception = new PaymentException("Payment failed", cause, 502);

        // Assert
        assertEquals("Payment failed", exception.getMessage());
        assertEquals(502, exception.getStatusCode());
        assertSame(cause, exception.getCause());
    }

    @Test
    void getStatusCode_Returns502ForServiceUnavailable() {
        // Arrange
        PaymentException exception = new PaymentException("Service unavailable", 502);

        // Act & Assert
        assertEquals(502, exception.getStatusCode());
    }

    @Test
    void getStatusCode_Returns400ForBadRequest() {
        // Arrange
        PaymentException exception = new PaymentException("Bad request", 400);

        // Act & Assert
        assertEquals(400, exception.getStatusCode());
    }

    @Test
    void getStatusCode_Returns500ForInternalError() {
        // Arrange
        PaymentException exception = new PaymentException("Internal error", 500);

        // Act & Assert
        assertEquals(500, exception.getStatusCode());
    }

    @Test
    void getMessage_ReturnsCorrectMessage() {
        // Arrange
        String expectedMessage = "PayPal service is currently unavailable. Please try again later.";
        PaymentException exception = new PaymentException(expectedMessage, 502);

        // Act & Assert
        assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
    void getCause_ReturnsOriginalException() {
        // Arrange
        java.io.IOException ioException = new java.io.IOException("Network error");
        PaymentException exception = new PaymentException("Payment failed", ioException, 502);

        // Act & Assert
        assertNotNull(exception.getCause());
        assertEquals("Network error", exception.getCause().getMessage());
    }

    @Test
    void constructor_WithNullCause_WorksCorrectly() {
        // Arrange & Act
        PaymentException exception = new PaymentException("Payment failed", null, 400);

        // Assert
        assertEquals("Payment failed", exception.getMessage());
        assertEquals(400, exception.getStatusCode());
        assertNull(exception.getCause());
    }

    @Test
    void exceptionIsRuntimeException() {
        // Arrange
        PaymentException exception = new PaymentException("Test", 500);

        // Assert
        assertTrue(exception instanceof RuntimeException);
    }

    private void assertTrue(boolean condition) {
        org.junit.jupiter.api.Assertions.assertTrue(condition);
    }
}
