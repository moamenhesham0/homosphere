package com.homosphere.backend.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.homosphere.backend.enums.PaymentStatus;
import com.homosphere.backend.exception.PaymentException;
import com.homosphere.backend.exception.UserNotFoundException;
import com.homosphere.backend.model.PayPalPayment;
import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.UserSubscription;
import com.homosphere.backend.repository.PayPalPaymentRepository;
import com.homosphere.backend.repository.SubscriptionTierRepository;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;
import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.Order;
import com.paypal.orders.OrdersCaptureRequest;
import com.paypal.orders.OrdersCreateRequest;
import com.paypal.orders.Payer;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class PayPalServiceTest {

    @Mock
    private PayPalHttpClient payPalHttpClient;

    @Mock
    private SubscriptionTierRepository subscriptionTierRepository;

    @Mock
    private PayPalPaymentRepository payPalPaymentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserSubscriptionRepository userSubscriptionRepository;

    @InjectMocks
    private PayPalService payPalService;

    private UUID userId;
    private User user;
    private SubscriptionTier subscriptionTier;
    private PayPalPayment payment;
    private String orderId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        orderId = "PAYPAL-ORDER-123";

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
        payment.setStatus(PaymentStatus.PENDING);
        payment.setFrequency(UserSubscription.PaymentFrequency.MONTHLY);
        payment.setPaypalOrderId(orderId);

        // Set frontendUrl using reflection
        ReflectionTestUtils.setField(payPalService, "frontendUrl", "http://localhost:5173");
    }

    // ==================== createOrder Tests ====================

    @Test
    void createOrder_WithValidData_ReturnsPayment() throws IOException {
        // Arrange
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "id", orderId);
        
        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(payPalHttpClient.execute(any(OrdersCreateRequest.class))).thenReturn(mockResponse);
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PayPalPayment result = payPalService.createOrder(9.99, "USD", subscriptionTier, "MONTHLY", userId);

        // Assert
        assertNotNull(result);
        assertEquals(orderId, result.getPaypalOrderId());
        assertEquals(PaymentStatus.PENDING, result.getStatus());
        assertEquals(user, result.getUser());
        assertEquals(subscriptionTier, result.getSubscriptionTier());
        verify(payPalPaymentRepository, times(1)).save(any(PayPalPayment.class));
    }

    @Test
    void createOrder_WithYearlyFrequency_ReturnsPayment() throws IOException {
        // Arrange
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "id", orderId);
        
        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(payPalHttpClient.execute(any(OrdersCreateRequest.class))).thenReturn(mockResponse);
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PayPalPayment result = payPalService.createOrder(99.99, "USD", subscriptionTier, "YEARLY", userId);

        // Assert
        assertNotNull(result);
        assertEquals(UserSubscription.PaymentFrequency.YEARLY, result.getFrequency());
    }

    @Test
    void createOrder_UserNotFound_ThrowsUserNotFoundException() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, 
            () -> payPalService.createOrder(9.99, "USD", subscriptionTier, "MONTHLY", userId));
        
        verify(payPalPaymentRepository, never()).save(any());
    }

    @Test
    void createOrder_PayPalIOException_ThrowsPaymentException() throws IOException {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(payPalHttpClient.execute(any(OrdersCreateRequest.class))).thenThrow(new IOException("PayPal connection error"));
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act & Assert
        PaymentException exception = assertThrows(PaymentException.class,
            () -> payPalService.createOrder(9.99, "USD", subscriptionTier, "MONTHLY", userId));

        assertEquals("PayPal service is currently unavailable. Please try again later.", exception.getMessage());
        assertEquals(502, exception.getStatusCode());
        // Verify payment was saved with FAILED status (only once in catch block)
        verify(payPalPaymentRepository, times(1)).save(any(PayPalPayment.class));
    }

    // ==================== captureOrder Tests ====================

    @Test
    void captureOrder_WithCompletedStatus_ReturnsCompletedPayment() throws IOException {
        // Arrange
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "status", "COMPLETED");
        
        Payer payer = new Payer();
        ReflectionTestUtils.setField(payer, "payerId", "PAYER123");
        ReflectionTestUtils.setField(payer, "email", "payer@example.com");
        ReflectionTestUtils.setField(mockOrder, "payer", payer);

        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.of(payment));
        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenReturn(mockResponse);
        when(userSubscriptionRepository.findByUser_Id(userId)).thenReturn(Collections.emptyList());
        when(userSubscriptionRepository.save(any(UserSubscription.class))).thenAnswer(inv -> inv.getArgument(0));
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PayPalPayment result = payPalService.captureOrder(orderId);

        // Assert
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        assertEquals("PAYER123", result.getPayerId());
        assertEquals("payer@example.com", result.getPayerEmail());
        assertNotNull(result.getUserSubscription());
        verify(userSubscriptionRepository, times(1)).save(any(UserSubscription.class));
    }

    @Test
    void captureOrder_WithCompletedStatusAndNullPayer_NoPayerInfoSet() throws IOException {
        // Arrange
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "status", "COMPLETED");
        // payer is null

        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.of(payment));
        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenReturn(mockResponse);
        when(userSubscriptionRepository.findByUser_Id(userId)).thenReturn(Collections.emptyList());
        when(userSubscriptionRepository.save(any(UserSubscription.class))).thenAnswer(inv -> inv.getArgument(0));
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PayPalPayment result = payPalService.captureOrder(orderId);

        // Assert
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        // PayerInfo should remain null/unchanged
    }

    @Test
    void captureOrder_WithCompletedStatusAndPayerWithNullEmail_OnlyPayerIdSet() throws IOException {
        // Arrange
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "status", "COMPLETED");
        
        Payer payer = new Payer();
        ReflectionTestUtils.setField(payer, "payerId", "PAYER123");
        // email is null
        ReflectionTestUtils.setField(mockOrder, "payer", payer);

        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.of(payment));
        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenReturn(mockResponse);
        when(userSubscriptionRepository.findByUser_Id(userId)).thenReturn(Collections.emptyList());
        when(userSubscriptionRepository.save(any(UserSubscription.class))).thenAnswer(inv -> inv.getArgument(0));
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PayPalPayment result = payPalService.captureOrder(orderId);

        // Assert
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        assertEquals("PAYER123", result.getPayerId());
    }

    @Test
    void captureOrder_WithNonCompletedStatus_ReturnsFailedPayment() throws IOException {
        // Arrange
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "status", "PENDING");

        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.of(payment));
        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenReturn(mockResponse);
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PayPalPayment result = payPalService.captureOrder(orderId);

        // Assert
        assertEquals(PaymentStatus.FAILED, result.getStatus());
        assertEquals("PayPal order status: PENDING", result.getErrorMessage());
        verify(userSubscriptionRepository, never()).save(any());
    }

    @Test
    void captureOrder_PaymentNotFound_ThrowsEntityNotFoundException() {
        // Arrange
        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> payPalService.captureOrder(orderId));
    }

    @Test
    void captureOrder_PayPalIOException_ThrowsPaymentException() throws IOException {
        // Arrange
        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.of(payment));
        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenThrow(new IOException("PayPal connection error"));
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act & Assert
        PaymentException exception = assertThrows(PaymentException.class, 
            () -> payPalService.captureOrder(orderId));

        assertEquals("PayPal service is currently unavailable. Please try again later.", exception.getMessage());
        assertEquals(502, exception.getStatusCode());
    }

    @Test
    void captureOrder_GeneralException_ThrowsPaymentException() throws IOException {
        // Arrange
        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.of(payment));
        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenThrow(new RuntimeException("Unexpected error"));
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act & Assert
        PaymentException exception = assertThrows(PaymentException.class, 
            () -> payPalService.captureOrder(orderId));

        assertEquals("Payment capture failed: Unexpected error", exception.getMessage());
        assertEquals(400, exception.getStatusCode());
    }

    // ==================== createOrUpdateSubscription Tests (via captureOrder) ====================

    @Test
    void captureOrder_WithPreviousActiveSubscription_DeactivatesOld() throws IOException {
        // Arrange
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "status", "COMPLETED");

        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        UserSubscription previousActive = new UserSubscription();
        previousActive.setUserSubscriptionId(1L);
        previousActive.setUser(user);
        previousActive.setStatus(UserSubscription.Status.ACTIVE);

        UserSubscription previousInactive = new UserSubscription();
        previousInactive.setUserSubscriptionId(2L);
        previousInactive.setUser(user);
        previousInactive.setStatus(UserSubscription.Status.INACTIVE);

        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.of(payment));
        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenReturn(mockResponse);
        when(userSubscriptionRepository.findByUser_Id(userId)).thenReturn(Arrays.asList(previousActive, previousInactive));
        when(userSubscriptionRepository.save(any(UserSubscription.class))).thenAnswer(inv -> inv.getArgument(0));
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PayPalPayment result = payPalService.captureOrder(orderId);

        // Assert
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        // Verify: 1 for deactivating previous + 1 for new subscription = 2 saves
        verify(userSubscriptionRepository, times(2)).save(any(UserSubscription.class));
        assertEquals(UserSubscription.Status.CANCELED, previousActive.getStatus());
        assertNotNull(previousActive.getCancellationDate());
    }

    @Test
    void captureOrder_WithYearlyFrequency_SetsYearlyEndDate() throws IOException {
        // Arrange
        payment.setFrequency(UserSubscription.PaymentFrequency.YEARLY);
        
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "status", "COMPLETED");

        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.of(payment));
        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenReturn(mockResponse);
        when(userSubscriptionRepository.findByUser_Id(userId)).thenReturn(Collections.emptyList());
        when(userSubscriptionRepository.save(any(UserSubscription.class))).thenAnswer(inv -> {
            UserSubscription sub = inv.getArgument(0);
            // Verify yearly end date
            assertEquals(LocalDate.now().plusYears(1), sub.getEndDate());
            return sub;
        });
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PayPalPayment result = payPalService.captureOrder(orderId);

        // Assert
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
    }

    @Test
    void captureOrder_WithMonthlyFrequency_SetsMonthlyEndDate() throws IOException {
        // Arrange
        payment.setFrequency(UserSubscription.PaymentFrequency.MONTHLY);
        
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "status", "COMPLETED");

        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.of(payment));
        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenReturn(mockResponse);
        when(userSubscriptionRepository.findByUser_Id(userId)).thenReturn(Collections.emptyList());
        when(userSubscriptionRepository.save(any(UserSubscription.class))).thenAnswer(inv -> {
            UserSubscription sub = inv.getArgument(0);
            // Verify monthly end date
            assertEquals(LocalDate.now().plusMonths(1), sub.getEndDate());
            return sub;
        });
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PayPalPayment result = payPalService.captureOrder(orderId);

        // Assert
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
    }

    // ==================== findTierByName Tests ====================

    @Test
    void findTierByName_WithValidName_ReturnsTier() {
        // Arrange
        when(subscriptionTierRepository.findByName("Premium")).thenReturn(subscriptionTier);

        // Act
        SubscriptionTier result = payPalService.findTierByName("Premium");

        // Assert
        assertNotNull(result);
        assertEquals("Premium", result.getName());
    }

    @Test
    void findTierByName_WithInvalidName_ThrowsEntityNotFoundException() {
        // Arrange
        when(subscriptionTierRepository.findByName("NonExistent")).thenReturn(null);

        // Act & Assert
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
            () -> payPalService.findTierByName("NonExistent"));

        assertEquals("Subscription tier not found: NonExistent", exception.getMessage());
    }

    // ==================== Edge Cases ====================

    @Test
    void captureOrder_WithMultipleActiveSubscriptions_DeactivatesAll() throws IOException {
        // Arrange
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "status", "COMPLETED");

        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        List<UserSubscription> previousSubscriptions = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            UserSubscription sub = new UserSubscription();
            sub.setUserSubscriptionId((long) i);
            sub.setUser(user);
            sub.setStatus(UserSubscription.Status.ACTIVE);
            previousSubscriptions.add(sub);
        }

        when(payPalPaymentRepository.findByPaypalOrderId(orderId)).thenReturn(Optional.of(payment));
        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenReturn(mockResponse);
        when(userSubscriptionRepository.findByUser_Id(userId)).thenReturn(previousSubscriptions);
        when(userSubscriptionRepository.save(any(UserSubscription.class))).thenAnswer(inv -> inv.getArgument(0));
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PayPalPayment result = payPalService.captureOrder(orderId);

        // Assert
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        // 3 deactivations + 1 new subscription = 4 saves
        verify(userSubscriptionRepository, times(4)).save(any(UserSubscription.class));
        
        // Verify all previous subscriptions were canceled
        for (UserSubscription sub : previousSubscriptions) {
            assertEquals(UserSubscription.Status.CANCELED, sub.getStatus());
            assertNotNull(sub.getCancellationDate());
        }
    }

    @Test
    void createOrder_WithDifferentCurrencies_FormatsCorrectly() throws IOException {
        // Arrange
        Order mockOrder = new Order();
        ReflectionTestUtils.setField(mockOrder, "id", orderId);
        
        @SuppressWarnings("unchecked")
        HttpResponse<Order> mockResponse = (HttpResponse<Order>) org.mockito.Mockito.mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(payPalHttpClient.execute(any(OrdersCreateRequest.class))).thenReturn(mockResponse);
        when(payPalPaymentRepository.save(any(PayPalPayment.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act - Test with EUR
        PayPalPayment result = payPalService.createOrder(9.99, "EUR", subscriptionTier, "MONTHLY", userId);

        // Assert
        assertNotNull(result);
        assertEquals("EUR", result.getCurrency());
    }
}
