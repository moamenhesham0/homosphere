package com.homosphere.backend.service;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;

class MoneyFormatterTest {

    @Test
    void format_WithUSD_ReturnsTwoDecimalPlaces() {
        // Arrange
        BigDecimal amount = new BigDecimal("9.99");

        // Act
        String result = MoneyFormatter.format(amount, "USD");

        // Assert
        assertEquals("9.99", result);
    }

    @Test
    void format_WithEUR_ReturnsTwoDecimalPlaces() {
        // Arrange
        BigDecimal amount = new BigDecimal("99.999");

        // Act
        String result = MoneyFormatter.format(amount, "EUR");

        // Assert
        assertEquals("100.00", result); // Rounds up
    }

    @Test
    void format_WithJPY_ReturnsNoDecimalPlaces() {
        // Arrange - JPY has 0 decimal places
        BigDecimal amount = new BigDecimal("1000.50");

        // Act
        String result = MoneyFormatter.format(amount, "JPY");

        // Assert
        assertEquals("1001", result); // Rounds half up, no decimal places for Yen
    }

    @Test
    void format_WithGBP_ReturnsTwoDecimalPlaces() {
        // Arrange
        BigDecimal amount = new BigDecimal("50.125");

        // Act
        String result = MoneyFormatter.format(amount, "GBP");

        // Assert
        assertEquals("50.13", result); // Rounds up using HALF_UP
    }

    @Test
    void format_RoundsHalfUp() {
        // Arrange
        BigDecimal amount = new BigDecimal("10.555");

        // Act
        String result = MoneyFormatter.format(amount, "USD");

        // Assert
        assertEquals("10.56", result);
    }

    @Test
    void format_RoundsHalfUpWhenExactlyHalf() {
        // Arrange
        BigDecimal amount = new BigDecimal("10.545");

        // Act
        String result = MoneyFormatter.format(amount, "USD");

        // Assert
        assertEquals("10.55", result);
    }

    @Test
    void format_WithWholeNumber_AddsDecimalPlaces() {
        // Arrange
        BigDecimal amount = new BigDecimal("100");

        // Act
        String result = MoneyFormatter.format(amount, "USD");

        // Assert
        assertEquals("100.00", result);
    }

    @Test
    void format_WithLargeNumber_FormatsCorrectly() {
        // Arrange
        BigDecimal amount = new BigDecimal("999999.99");

        // Act
        String result = MoneyFormatter.format(amount, "USD");

        // Assert
        assertEquals("999999.99", result);
    }

    @Test
    void format_WithVerySmallNumber_FormatsCorrectly() {
        // Arrange
        BigDecimal amount = new BigDecimal("0.01");

        // Act
        String result = MoneyFormatter.format(amount, "USD");

        // Assert
        assertEquals("0.01", result);
    }

    @Test
    void format_WithZero_ReturnsZero() {
        // Arrange
        BigDecimal amount = BigDecimal.ZERO;

        // Act
        String result = MoneyFormatter.format(amount, "USD");

        // Assert
        assertEquals("0.00", result);
    }

    @Test
    void format_WithNegativeNumber_FormatsCorrectly() {
        // Arrange
        BigDecimal amount = new BigDecimal("-50.99");

        // Act
        String result = MoneyFormatter.format(amount, "USD");

        // Assert
        assertEquals("-50.99", result);
    }

    @Test
    void format_WithInvalidCurrencyCode_ThrowsException() {
        // Arrange
        BigDecimal amount = new BigDecimal("10.00");

        // Act & Assert
        assertThrows(IllegalArgumentException.class, 
            () -> MoneyFormatter.format(amount, "INVALID"));
    }

    @Test
    void format_WithManyDecimalPlaces_RoundsCorrectly() {
        // Arrange
        BigDecimal amount = new BigDecimal("10.123456789");

        // Act
        String result = MoneyFormatter.format(amount, "USD");

        // Assert
        assertEquals("10.12", result);
    }

    @Test
    void format_WithCAD_ReturnsTwoDecimalPlaces() {
        // Arrange
        BigDecimal amount = new BigDecimal("25.50");

        // Act
        String result = MoneyFormatter.format(amount, "CAD");

        // Assert
        assertEquals("25.50", result);
    }

    @Test
    void format_WithAUD_ReturnsTwoDecimalPlaces() {
        // Arrange
        BigDecimal amount = new BigDecimal("75.999");

        // Act
        String result = MoneyFormatter.format(amount, "AUD");

        // Assert
        assertEquals("76.00", result);
    }

    @Test
    void format_WithCHF_ReturnsTwoDecimalPlaces() {
        // Arrange
        BigDecimal amount = new BigDecimal("100.50");

        // Act
        String result = MoneyFormatter.format(amount, "CHF");

        // Assert
        assertEquals("100.50", result);
    }

    @Test
    void defaultConstructor_CanBeInstantiated() {
        // This tests the @NoArgsConstructor
        MoneyFormatter formatter = new MoneyFormatter();
        
        // Assert that the instance is not null
        assertEquals(MoneyFormatter.class, formatter.getClass());
    }
}
