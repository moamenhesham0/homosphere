package com.homosphere.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("PAYPAL")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class PayPalPayment extends Payment{
   
    @Column(name = "paypal_order_id", unique = true)
    private String paypalOrderId;
    
    @Column(name = "paypal_capture_id")
    private String paypalCaptureId;
    
    @Column(name = "payer_email")
    private String payerEmail;
    
    @Column(name = "payer_id")
    private String payerId;
}
