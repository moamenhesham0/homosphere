package com.homosphere.backend.exception;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.persistence.EntityNotFoundException;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler globalExceptionHandler;

    @BeforeEach
    void setUp() {
        globalExceptionHandler = new GlobalExceptionHandler();
    }

    // ==================== PaymentException Tests ====================

    @Test
    void handlePaymentException_Returns502StatusCode() {
        // Arrange
        PaymentException exception = new PaymentException("PayPal unavailable", 502);

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handlePaymentException(exception);

        // Assert
        assertEquals(502, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("PayPal unavailable", response.getBody().get("error"));
        assertEquals(502, response.getBody().get("status"));
        assertNotNull(response.getBody().get("timestamp"));
    }

    @Test
    void handlePaymentException_Returns400StatusCode() {
        // Arrange
        PaymentException exception = new PaymentException("Invalid payment data", 400);

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handlePaymentException(exception);

        // Assert
        assertEquals(400, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("Invalid payment data", response.getBody().get("error"));
        assertEquals(400, response.getBody().get("status"));
    }

    @Test
    void handlePaymentException_Returns500StatusCode() {
        // Arrange
        PaymentException exception = new PaymentException("Internal payment error", 500);

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handlePaymentException(exception);

        // Assert
        assertEquals(500, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("Internal payment error", response.getBody().get("error"));
    }

    @Test
    void handlePaymentException_WithCause_ReturnsCorrectResponse() {
        // Arrange
        RuntimeException cause = new RuntimeException("Root cause");
        PaymentException exception = new PaymentException("Payment failed", cause, 502);

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handlePaymentException(exception);

        // Assert
        assertEquals(502, response.getStatusCode().value());
        assertEquals("Payment failed", response.getBody().get("error"));
    }

    // ==================== EntityNotFoundException Tests ====================

    @Test
    void handleEntityNotFound_ReturnsNotFoundStatus() {
        // Arrange
        EntityNotFoundException exception = new EntityNotFoundException("Subscription tier not found: Premium");

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleEntityNotFound(exception);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Subscription tier not found: Premium", response.getBody().get("error"));
        assertEquals(404, response.getBody().get("status"));
        assertNotNull(response.getBody().get("timestamp"));
    }

    @Test
    void handleEntityNotFound_WithPaymentNotFound_ReturnsNotFoundStatus() {
        // Arrange
        EntityNotFoundException exception = new EntityNotFoundException("Payment not found for order: PAYPAL-123");

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleEntityNotFound(exception);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Payment not found for order: PAYPAL-123", response.getBody().get("error"));
    }

    // ==================== UserNotFoundException Tests ====================

    @Test
    void handleUserNotFound_ReturnsNotFoundStatus() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UserNotFoundException exception = new UserNotFoundException(userId);

        // Act
        ResponseEntity<String> response = globalExceptionHandler.handleUserNotFound(exception);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(response.getBody().contains(userId.toString()));
        assertTrue(response.getBody().contains("User not found with id:"));
    }

    // ==================== General Exception Tests ====================

    @Test
    void handleGeneralException_ReturnsInternalServerError() {
        // Arrange
        Exception exception = new Exception("Unexpected error");

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleGeneralException(exception);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("An unexpected error occurred", response.getBody().get("error"));
        assertEquals(500, response.getBody().get("status"));
        assertNotNull(response.getBody().get("timestamp"));
    }

    @Test
    void handleGeneralException_WithNullPointerException_ReturnsInternalServerError() {
        // Arrange
        NullPointerException exception = new NullPointerException("null pointer");

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleGeneralException(exception);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An unexpected error occurred", response.getBody().get("error"));
    }

    @Test
    void handleGeneralException_WithIllegalArgumentException_ReturnsInternalServerError() {
        // Arrange
        IllegalArgumentException exception = new IllegalArgumentException("Invalid argument");

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleGeneralException(exception);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An unexpected error occurred", response.getBody().get("error"));
    }

    // ==================== Edge Cases ====================

    @Test
    void handlePaymentException_WithEmptyMessage_ReturnsResponse() {
        // Arrange
        PaymentException exception = new PaymentException("", 400);

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handlePaymentException(exception);

        // Assert
        assertEquals(400, response.getStatusCode().value());
        assertEquals("", response.getBody().get("error"));
    }

    @Test
    void handleEntityNotFound_WithEmptyMessage_ReturnsResponse() {
        // Arrange
        EntityNotFoundException exception = new EntityNotFoundException("");

        // Act
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleEntityNotFound(exception);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void allHandlers_ReturnTimestamp() {
        // Test that all handlers include timestamp in response
        
        // PaymentException
        PaymentException paymentEx = new PaymentException("test", 400);
        ResponseEntity<Map<String, Object>> paymentResponse = globalExceptionHandler.handlePaymentException(paymentEx);
        assertNotNull(paymentResponse.getBody().get("timestamp"));

        // EntityNotFoundException
        EntityNotFoundException entityEx = new EntityNotFoundException("test");
        ResponseEntity<Map<String, Object>> entityResponse = globalExceptionHandler.handleEntityNotFound(entityEx);
        assertNotNull(entityResponse.getBody().get("timestamp"));

        // General Exception
        Exception generalEx = new Exception("test");
        ResponseEntity<Map<String, Object>> generalResponse = globalExceptionHandler.handleGeneralException(generalEx);
        assertNotNull(generalResponse.getBody().get("timestamp"));
    }
}
