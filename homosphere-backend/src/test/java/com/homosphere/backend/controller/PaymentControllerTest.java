package com.homosphere.backend.controller;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import com.homosphere.backend.dto.OrderRequestDto;
import com.homosphere.backend.enums.PaymentStatus;
import com.homosphere.backend.exception.PaymentException;
import com.homosphere.backend.model.PayPalPayment;
import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.UserSubscription;
import com.homosphere.backend.repository.UserSubscriptionRepository;
import com.homosphere.backend.service.PayPalService;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    private PayPalService payPalService;

    @Mock
    private UserSubscriptionRepository userSubscriptionRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private PaymentController paymentController;

    private UUID userId;
    private User user;
    private SubscriptionTier subscriptionTier;
    private PayPalPayment payment;
    private OrderRequestDto orderRequestDto;
    private UserSubscription userSubscription;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        user = new User();
        user.setId(userId);
        user.setEmail("test@example.com");

        subscriptionTier = new SubscriptionTier();
        subscriptionTier.setSubscriptionId(1L);
        subscriptionTier.setName("Premium");
        subscriptionTier.setMonthlyPrice(9.99);
        subscriptionTier.setYearlyPrice(99.99);

        payment = new PayPalPayment();
        payment.setId(1L);
        payment.setUser(user);
        payment.setSubscriptionTier(subscriptionTier);
        payment.setAmount(9.99);
        payment.setCurrency("USD");
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setFrequency(UserSubscription.PaymentFrequency.MONTHLY);
        payment.setPaypalOrderId("PAYPAL-ORDER-123");

        userSubscription = new UserSubscription();
        userSubscription.setUserSubscriptionId(1L);
        userSubscription.setUser(user);
        userSubscription.setSubscription(subscriptionTier);
        userSubscription.setFrequency(UserSubscription.PaymentFrequency.MONTHLY);
        userSubscription.setStatus(UserSubscription.Status.ACTIVE);
        userSubscription.setStartDate(LocalDate.now());
        userSubscription.setEndDate(LocalDate.now().plusMonths(1));

        payment.setUserSubscription(userSubscription);

        orderRequestDto = new OrderRequestDto();
        orderRequestDto.setTierName("Premium");
        orderRequestDto.setTiertype("MONTHLY");
        orderRequestDto.setCurrencyCode("USD");
    }

    // ==================== createOrder Tests ====================

    @Test
    void createOrder_WithMonthlyTier_ReturnsOk() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(payPalService.findTierByName("Premium")).thenReturn(subscriptionTier);
        when(payPalService.createOrder(eq(9.99), eq("USD"), eq(subscriptionTier), eq("MONTHLY"), eq(userId)))
            .thenReturn(payment);

        // Act
        ResponseEntity<?> response = paymentController.createOrder(orderRequestDto, authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(1L, body.get("paymentId"));
        assertEquals("PAYPAL-ORDER-123", body.get("orderId"));
    }

    @Test
    void createOrder_WithYearlyTier_ReturnsOk() {
        // Arrange
        orderRequestDto.setTiertype("YEARLY");
        payment.setFrequency(UserSubscription.PaymentFrequency.YEARLY);
        payment.setAmount(99.99);

        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(payPalService.findTierByName("Premium")).thenReturn(subscriptionTier);
        when(payPalService.createOrder(eq(99.99), eq("USD"), eq(subscriptionTier), eq("YEARLY"), eq(userId)))
            .thenReturn(payment);

        // Act
        ResponseEntity<?> response = paymentController.createOrder(orderRequestDto, authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void createOrder_WithLowercaseMonthly_ReturnsOk() {
        // Arrange
        orderRequestDto.setTiertype("monthly");

        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(payPalService.findTierByName("Premium")).thenReturn(subscriptionTier);
        when(payPalService.createOrder(eq(9.99), eq("USD"), eq(subscriptionTier), eq("monthly"), eq(userId)))
            .thenReturn(payment);

        // Act
        ResponseEntity<?> response = paymentController.createOrder(orderRequestDto, authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void createOrder_WithLowercaseYearly_ReturnsOk() {
        // Arrange
        orderRequestDto.setTiertype("yearly");
        payment.setAmount(99.99);

        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(payPalService.findTierByName("Premium")).thenReturn(subscriptionTier);
        when(payPalService.createOrder(eq(99.99), eq("USD"), eq(subscriptionTier), eq("yearly"), eq(userId)))
            .thenReturn(payment);

        // Act
        ResponseEntity<?> response = paymentController.createOrder(orderRequestDto, authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void createOrder_WithInvalidTierType_ReturnsBadRequest() {
        // Arrange
        orderRequestDto.setTiertype("WEEKLY");

        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(payPalService.findTierByName("Premium")).thenReturn(subscriptionTier);

        // Act
        ResponseEntity<?> response = paymentController.createOrder(orderRequestDto, authentication);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid tier type. Must be 'MONTHLY' or 'YEARLY'", response.getBody());
        verify(payPalService, never()).createOrder(any(), any(), any(), any(), any());
    }

    @Test
    void createOrder_WhenTierNotFound_ReturnsInternalServerError() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(payPalService.findTierByName("Premium"))
            .thenThrow(new EntityNotFoundException("Subscription tier not found"));

        // Act
        ResponseEntity<?> response = paymentController.createOrder(orderRequestDto, authentication);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("Failed to create order", body.get("error"));
    }

    @Test
    void createOrder_WhenServiceThrowsException_ReturnsInternalServerError() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(payPalService.findTierByName("Premium")).thenReturn(subscriptionTier);
        when(payPalService.createOrder(any(), any(), any(), any(), any()))
            .thenThrow(new RuntimeException("Service error"));

        // Act
        ResponseEntity<?> response = paymentController.createOrder(orderRequestDto, authentication);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    // ==================== captureOrder Tests ====================

    @Test
    void captureOrder_WithValidOrderId_ReturnsOk() {
        // Arrange
        String orderId = "PAYPAL-ORDER-123";
        when(payPalService.captureOrder(orderId)).thenReturn(payment);

        // Act
        ResponseEntity<?> response = paymentController.captureOrder(orderId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("COMPLETED", body.get("status"));
        assertEquals("PAYPAL-ORDER-123", body.get("orderId"));
        assertEquals(1L, body.get("paymentId"));
        assertNotNull(body.get("subscription"));
    }

    @Test
    void captureOrder_WithNullSubscription_ReturnsOkWithNullSubscription() {
        // Arrange
        String orderId = "PAYPAL-ORDER-123";
        payment.setUserSubscription(null);
        when(payPalService.captureOrder(orderId)).thenReturn(payment);

        // Act
        ResponseEntity<?> response = paymentController.captureOrder(orderId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertNull(body.get("subscription"));
    }

    @Test
    void captureOrder_WhenPaymentNotFound_ReturnsInternalServerError() {
        // Arrange
        String orderId = "INVALID-ORDER";
        when(payPalService.captureOrder(orderId))
            .thenThrow(new EntityNotFoundException("Payment not found"));

        // Act
        ResponseEntity<?> response = paymentController.captureOrder(orderId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertTrue(body.get("error").toString().contains("Payment not found"));
    }

    @Test
    void captureOrder_WhenPayPalServiceThrowsPaymentException_ReturnsInternalServerError() {
        // Arrange
        String orderId = "PAYPAL-ORDER-123";
        when(payPalService.captureOrder(orderId))
            .thenThrow(new PaymentException("PayPal service unavailable", 502));

        // Act
        ResponseEntity<?> response = paymentController.captureOrder(orderId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    // ==================== getMyCurrentSubscription Tests ====================

    @Test
    void getMyCurrentSubscription_WithActiveSubscription_ReturnsOk() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Arrays.asList(userSubscription));

        // Act
        ResponseEntity<?> response = paymentController.getMyCurrentSubscription(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(1L, body.get("subscriptionTierId"));
        assertEquals("Premium", body.get("tierName"));
        assertEquals("MONTHLY", body.get("frequency"));
        assertEquals("ACTIVE", body.get("status"));
    }

    @Test
    void getMyCurrentSubscription_WithMultipleSubscriptions_ReturnsMostRecent() {
        // Arrange
        UserSubscription olderSubscription = new UserSubscription();
        olderSubscription.setUserSubscriptionId(2L);
        olderSubscription.setUser(user);
        olderSubscription.setSubscription(subscriptionTier);
        olderSubscription.setFrequency(UserSubscription.PaymentFrequency.MONTHLY);
        olderSubscription.setStatus(UserSubscription.Status.ACTIVE);
        olderSubscription.setStartDate(LocalDate.now().minusMonths(1));
        olderSubscription.setEndDate(LocalDate.now());

        UserSubscription newerSubscription = new UserSubscription();
        newerSubscription.setUserSubscriptionId(3L);
        newerSubscription.setUser(user);
        newerSubscription.setSubscription(subscriptionTier);
        newerSubscription.setFrequency(UserSubscription.PaymentFrequency.YEARLY);
        newerSubscription.setStatus(UserSubscription.Status.ACTIVE);
        newerSubscription.setStartDate(LocalDate.now());
        newerSubscription.setEndDate(LocalDate.now().plusYears(1));

        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Arrays.asList(olderSubscription, newerSubscription));

        // Act
        ResponseEntity<?> response = paymentController.getMyCurrentSubscription(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        // Should return the newer subscription (sorted by startDate DESC)
        assertEquals("YEARLY", body.get("frequency"));
    }

    @Test
    void getMyCurrentSubscription_WithNoActiveSubscription_ReturnsNoActiveMessage() {
        // Arrange
        UserSubscription inactiveSubscription = new UserSubscription();
        inactiveSubscription.setStatus(UserSubscription.Status.INACTIVE);

        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Arrays.asList(inactiveSubscription));

        // Act
        ResponseEntity<?> response = paymentController.getMyCurrentSubscription(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("No active subscription found", body.get("message"));
    }

    @Test
    void getMyCurrentSubscription_WithEmptySubscriptions_ReturnsNoActiveMessage() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<?> response = paymentController.getMyCurrentSubscription(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("No active subscription found", body.get("message"));
    }

    @Test
    void getMyCurrentSubscription_WithCanceledSubscription_ReturnsNoActiveMessage() {
        // Arrange
        UserSubscription canceledSubscription = new UserSubscription();
        canceledSubscription.setStatus(UserSubscription.Status.CANCELED);

        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Arrays.asList(canceledSubscription));

        // Act
        ResponseEntity<?> response = paymentController.getMyCurrentSubscription(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("No active subscription found", body.get("message"));
    }

    @Test
    void getMyCurrentSubscription_WhenExceptionThrown_ReturnsInternalServerError() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<?> response = paymentController.getMyCurrentSubscription(authentication);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertTrue(body.get("error").toString().contains("Failed to get subscription"));
    }

    @Test
    void getMyCurrentSubscription_WithInvalidUUID_ReturnsInternalServerError() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn("invalid-uuid");

        // Act
        ResponseEntity<?> response = paymentController.getMyCurrentSubscription(authentication);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void getMyCurrentSubscription_WithMixedStatusSubscriptions_FiltersOnlyActive() {
        // Arrange
        UserSubscription activeSubscription = new UserSubscription();
        activeSubscription.setUserSubscriptionId(1L);
        activeSubscription.setUser(user);
        activeSubscription.setSubscription(subscriptionTier);
        activeSubscription.setFrequency(UserSubscription.PaymentFrequency.MONTHLY);
        activeSubscription.setStatus(UserSubscription.Status.ACTIVE);
        activeSubscription.setStartDate(LocalDate.now());
        activeSubscription.setEndDate(LocalDate.now().plusMonths(1));

        UserSubscription canceledSubscription = new UserSubscription();
        canceledSubscription.setUserSubscriptionId(2L);
        canceledSubscription.setStatus(UserSubscription.Status.CANCELED);
        canceledSubscription.setStartDate(LocalDate.now().plusDays(1)); // More recent but canceled

        UserSubscription inactiveSubscription = new UserSubscription();
        inactiveSubscription.setUserSubscriptionId(3L);
        inactiveSubscription.setStatus(UserSubscription.Status.INACTIVE);

        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Arrays.asList(activeSubscription, canceledSubscription, inactiveSubscription));

        // Act
        ResponseEntity<?> response = paymentController.getMyCurrentSubscription(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(1L, body.get("subscriptionTierId")); // Should be the active one
        assertEquals("ACTIVE", body.get("status"));
    }
}
