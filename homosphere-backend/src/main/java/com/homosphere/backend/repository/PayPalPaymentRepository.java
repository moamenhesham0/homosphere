package com.homosphere.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homosphere.backend.model.PayPalPayment;

public interface PayPalPaymentRepository extends JpaRepository<PayPalPayment, Long>{
    Optional<PayPalPayment> findByPaypalOrderId(String paypalOrderId);
}
