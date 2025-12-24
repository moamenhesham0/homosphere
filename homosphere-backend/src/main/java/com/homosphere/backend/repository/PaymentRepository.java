package com.homosphere.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homosphere.backend.enums.PaymentStatus;
import com.homosphere.backend.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long>{
    
    List<Payment> findByUserId(UUID userId);
    List<Payment> findByUserIdAndStatus(UUID userId, PaymentStatus status);
}
