package com.homosphere.backend.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.dto.OrderRequestDto;
import com.homosphere.backend.model.PayPalPayment;
import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.model.UserSubscription;
import com.homosphere.backend.repository.UserSubscriptionRepository;
import com.homosphere.backend.service.PayPalService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PayPalService payPalService;
    private final UserSubscriptionRepository userSubscriptionRepository;
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequestDto data, 
                                        Authentication authentication
    ){
        
        String tierName = data.getTierName();
        String tierType = data.getTiertype();
        String currencyCode = data.getCurrencyCode();

        String idStr = authentication.getPrincipal().toString();

        UUID userID = UUID.fromString(idStr);
        try {
        
            SubscriptionTier subscriptionTier = payPalService.findTierByName(tierName);

            Double amount;
            if ("MONTHLY".equals(tierType.toUpperCase())){
                amount = subscriptionTier.getMonthlyPrice();
            }else if ("YEARLY".equals(tierType.toUpperCase())) {
                amount = subscriptionTier.getYearlyPrice();
            }else{
                return ResponseEntity.badRequest().body("Invalid tier type. Must be 'MONTHLY' or 'YEARLY'");
            }

            PayPalPayment payment = payPalService.createOrder(amount, currencyCode, subscriptionTier, tierType, userID);
            
            return ResponseEntity.ok(Map.of(
                                    "paymentId", payment.getId(),
                                    "orderId", payment.getPaypalOrderId()
                                ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to create order"));
        }
        
    }


    @PostMapping("/capture/{orderId}")
    public ResponseEntity<?> captureOrder(@PathVariable String orderId){
        
        try {
            PayPalPayment payment = payPalService.captureOrder(orderId);

            java.util.HashMap<String, Object> responseBody = new java.util.HashMap<>();
            responseBody.put("status", payment.getStatus().name());
            responseBody.put("orderId", payment.getPaypalOrderId());
            responseBody.put("paymentId", payment.getId());
            
            if (payment.getUserSubscription() != null) {
                responseBody.put("subscription", Map.of(
                    "tier", payment.getUserSubscription().getSubscription().getName(),
                    "frequency", payment.getUserSubscription().getFrequency().name(),
                    "startDate", payment.getUserSubscription().getStartDate().toString(),
                    "endDate", payment.getUserSubscription().getEndDate().toString()
                ));
            } else {
                responseBody.put("subscription", null);
            }
            
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to capture order: " + e.getMessage()));
        }
    }

    @GetMapping("/my-subscription")
    public ResponseEntity<?> getMyCurrentSubscription(Authentication authentication) {
        try {
            String userId = authentication.getPrincipal().toString();
            UUID uuid = UUID.fromString(userId);
            
            // Get all active subscriptions ordered by start date descending (most recent first)
            UserSubscription latestSubscription = userSubscriptionRepository
                .findByUser_Id(uuid)
                .stream()
                .filter(sub -> sub.getStatus() == UserSubscription.Status.ACTIVE)
                .sorted((a, b) -> b.getStartDate().compareTo(a.getStartDate()))
                .findFirst()
                .orElse(null);
            
            if (latestSubscription != null) {
                return ResponseEntity.ok(Map.of(
                    "subscriptionTierId", latestSubscription.getSubscription().getSubscriptionId(),
                    "tierName", latestSubscription.getSubscription().getName(),
                    "frequency", latestSubscription.getFrequency().name(),
                    "startDate", latestSubscription.getStartDate().toString(),
                    "endDate", latestSubscription.getEndDate().toString(),
                    "status", latestSubscription.getStatus().name()
                ));
            }
            
            return ResponseEntity.ok(Map.of("message", "No active subscription found"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to get subscription: " + e.getMessage()));
        }
    }

}

