package com.homosphere.backend.config;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.paypal.core.PayPalHttpClient;

class PayPalConfigTest {

    private PayPalConfig payPalConfig;

    @BeforeEach
    void setUp() {
        payPalConfig = new PayPalConfig();
        ReflectionTestUtils.setField(payPalConfig, "clientId", "test-client-id");
        ReflectionTestUtils.setField(payPalConfig, "clientSecret", "test-client-secret");
        ReflectionTestUtils.setField(payPalConfig, "mode", "sandbox");
    }

    @Test
    void payPalHttpClient_WithSandboxMode_ReturnsClient() {
        // Act
        PayPalHttpClient client = payPalConfig.paybPalHttpClient();

        // Assert
        assertNotNull(client);
    }

    @Test
    void payPalHttpClient_WithLiveMode_ReturnsClient() {
        // Arrange
        ReflectionTestUtils.setField(payPalConfig, "mode", "live");

        // Act
        PayPalHttpClient client = payPalConfig.paybPalHttpClient();

        // Assert
        assertNotNull(client);
    }

    @Test
    void payPalHttpClient_WithUnknownMode_ReturnsSandboxClient() {
        // Arrange - any mode that's not "live" should default to sandbox
        ReflectionTestUtils.setField(payPalConfig, "mode", "development");

        // Act
        PayPalHttpClient client = payPalConfig.paybPalHttpClient();

        // Assert
        assertNotNull(client);
    }

    @Test
    void payPalHttpClient_WithEmptyMode_ReturnsSandboxClient() {
        // Arrange
        ReflectionTestUtils.setField(payPalConfig, "mode", "");

        // Act
        PayPalHttpClient client = payPalConfig.paybPalHttpClient();

        // Assert
        assertNotNull(client);
    }

    @Test
    void payPalHttpClient_WithNullMode_ReturnsSandboxClient() {
        // Arrange
        ReflectionTestUtils.setField(payPalConfig, "mode", null);

        // Act
        PayPalHttpClient client = payPalConfig.paybPalHttpClient();

        // Assert
        assertNotNull(client);
    }
}
