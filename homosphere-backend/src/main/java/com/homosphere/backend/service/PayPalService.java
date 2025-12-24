package com.homosphere.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.paypal.orders.AmountWithBreakdown;
import com.paypal.orders.ApplicationContext;
import com.paypal.orders.Order;
import com.paypal.orders.OrderRequest;
import com.paypal.orders.OrdersCaptureRequest;
import com.paypal.orders.OrdersCreateRequest;
import com.paypal.orders.PurchaseUnitRequest;

import jakarta.persistence.EntityNotFoundException;

import com.paypal.http.HttpResponse;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@RequiredArgsConstructor
@Service
public class PayPalService {

    private final PayPalHttpClient payPalHttpClient;
    private final SubscriptionTierRepository subscriptionTierRepository;
    private final PayPalPaymentRepository payPalPaymentRepository;
    private final UserRepository userRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    
    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;
    
    @Transactional
    public PayPalPayment createOrder(Double totalAmount, String currencyCode, SubscriptionTier subscriptionTier, String tierType, UUID userId){
        
        PayPalPayment payment = new PayPalPayment();
        
        User user = userRepository.findById(userId)
                          .orElseThrow(() -> new UserNotFoundException(userId));

        
        payment.setUser(user);
        payment.setSubscriptionTier(subscriptionTier);
        payment.setAmount(totalAmount);
        payment.setCurrency(currencyCode);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setFrequency(UserSubscription.PaymentFrequency.valueOf(tierType.toUpperCase()));
        try {
            OrdersCreateRequest request = new OrdersCreateRequest();
            request.prefer("return=representation"); //this request, return the full order details in the response

            OrderRequest orderRequest = new OrderRequest();
            orderRequest.checkoutPaymentIntent("CAPTURE");

            // Set return and cancel URLs for PayPal redirect
            ApplicationContext applicationContext = new ApplicationContext()
                .returnUrl(frontendUrl + "/paypal-checkout")
                .cancelUrl(frontendUrl + "/subscription")
                .brandName("Homosphere")
                .landingPage("BILLING")
                .userAction("PAY_NOW");
            orderRequest.applicationContext(applicationContext);

            List<PurchaseUnitRequest> purchaseUnitRequest = new ArrayList<>();

            PurchaseUnitRequest purchaseUnit = new PurchaseUnitRequest()
                        .amountWithBreakdown(new AmountWithBreakdown()
                                    .currencyCode(currencyCode)
                                    .value(MoneyFormatter.format(BigDecimal.valueOf(totalAmount), currencyCode)));   
            purchaseUnitRequest.add(purchaseUnit);

            orderRequest.purchaseUnits(purchaseUnitRequest);
            request.requestBody(orderRequest);

            HttpResponse<Order> response = payPalHttpClient.execute(request);

            Order order = response.result();
            
            payment.setPaypalOrderId(order.id());
            payment = payPalPaymentRepository.save(payment);

            return payment;
        }catch(IOException e){
            payment.setStatus(PaymentStatus.FAILED);
            payment.setErrorMessage(e.getMessage());
            payPalPaymentRepository.save(payment);
               throw new PaymentException(
                "PayPal service is currently unavailable. Please try again later.", 
                e, 
                502
            );
        }
    }

     @Transactional
    public PayPalPayment captureOrder(String orderId) {
        
        PayPalPayment payment = payPalPaymentRepository.findByPaypalOrderId(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Payment not found for order: " + orderId));

        try{
            OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
            request.requestBody(new OrderRequest());

            HttpResponse<Order> response = payPalHttpClient.execute(request);
            Order order =  response.result();

            if ("COMPLETED".equals(order.status())) {
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setCompletedAt(LocalDateTime.now());
                
                if (order.payer() != null) {
                    payment.setPayerId(order.payer().payerId());
                    if (order.payer().email() != null) {
                        payment.setPayerEmail(order.payer().email());
                    }
                }
            
                UserSubscription subscription = createOrUpdateSubscription(payment);
                payment.setUserSubscription(subscription);
                
            } else {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setErrorMessage("PayPal order status: " + order.status());
            }
            
            return payPalPaymentRepository.save(payment);
            
            
        }catch(IOException e){
            payment.setStatus(PaymentStatus.FAILED);
            payment.setErrorMessage(e.getMessage());
            payPalPaymentRepository.save(payment);

            throw new PaymentException(
                "PayPal service is currently unavailable. Please try again later.", 
                e, 
                502
            );
        }catch(Exception e){
            payment.setStatus(PaymentStatus.FAILED);
            payment.setErrorMessage(e.getMessage());
            payPalPaymentRepository.save(payment);

            throw new PaymentException(
                "Payment capture failed: " + e.getMessage(), 
                e, 
                400
            );
        }
    }
    
    private UserSubscription createOrUpdateSubscription(PayPalPayment payment) {
        // First, deactivate all previous active subscriptions for this user
        List<UserSubscription> previousSubscriptions = userSubscriptionRepository.findByUser_Id(payment.getUser().getId());
        for (UserSubscription prevSub : previousSubscriptions) {
            if (prevSub.getStatus() == UserSubscription.Status.ACTIVE) {
                prevSub.setStatus(UserSubscription.Status.CANCELED);
                prevSub.setCancellationDate(LocalDate.now());
                userSubscriptionRepository.save(prevSub);
            }
        }
        
        UserSubscription subscription = new UserSubscription();
        subscription.setUser(payment.getUser());
        subscription.setSubscription(payment.getSubscriptionTier());
        subscription.setFrequency(payment.getFrequency());
        subscription.setStatus(UserSubscription.Status.ACTIVE);
        subscription.setStartDate(LocalDate.now());
        
        if (payment.getFrequency() == UserSubscription.PaymentFrequency.MONTHLY) {
            subscription.setEndDate(LocalDate.now().plusMonths(1));
        } else {
            subscription.setEndDate(LocalDate.now().plusYears(1));
        }
        
        return userSubscriptionRepository.save(subscription);
    }

    public SubscriptionTier findTierByName(String name){
        
        SubscriptionTier subscriptionTier = subscriptionTierRepository.findByName(name);
        
        if (subscriptionTier ==null){
             throw new EntityNotFoundException("Subscription tier not found: " + name);
        }
        return subscriptionTier;
    }
}
