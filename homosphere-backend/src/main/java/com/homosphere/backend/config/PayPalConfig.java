package com.homosphere.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.paypal.core.PayPalEnvironment;
import com.paypal.core.PayPalHttpClient;

@Configuration
public class PayPalConfig {

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.client-secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    @Bean
    public PayPalHttpClient paybPalHttpClient(){

        PayPalEnvironment payPalEnvironment;

        if ("live".equals(mode)){
            payPalEnvironment = new PayPalEnvironment.Live(clientId, clientSecret);
        }else{
            payPalEnvironment = new PayPalEnvironment.Sandbox(clientId, clientSecret);
        }

        return new PayPalHttpClient(payPalEnvironment);
    }
}
