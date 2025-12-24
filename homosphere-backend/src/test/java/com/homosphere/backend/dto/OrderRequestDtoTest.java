package com.homosphere.backend.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

class OrderRequestDtoTest {

    @Test
    void noArgsConstructor_CreatesEmptyInstance() {
        // Act
        OrderRequestDto dto = new OrderRequestDto();

        // Assert
        assertNull(dto.getTierName());
        assertNull(dto.getTiertype());
        assertNull(dto.getCurrencyCode());
    }

    @Test
    void setTierName_SetsCorrectly() {
        // Arrange
        OrderRequestDto dto = new OrderRequestDto();

        // Act
        dto.setTierName("Premium");

        // Assert
        assertEquals("Premium", dto.getTierName());
    }

    @Test
    void setTiertype_SetsCorrectly() {
        // Arrange
        OrderRequestDto dto = new OrderRequestDto();

        // Act
        dto.setTiertype("MONTHLY");

        // Assert
        assertEquals("MONTHLY", dto.getTiertype());
    }

    @Test
    void setCurrencyCode_SetsCorrectly() {
        // Arrange
        OrderRequestDto dto = new OrderRequestDto();

        // Act
        dto.setCurrencyCode("USD");

        // Assert
        assertEquals("USD", dto.getCurrencyCode());
    }

    @Test
    void allFieldsSet_AllFieldsAccessible() {
        // Arrange
        OrderRequestDto dto = new OrderRequestDto();

        // Act
        dto.setTierName("Basic");
        dto.setTiertype("YEARLY");
        dto.setCurrencyCode("EUR");

        // Assert
        assertEquals("Basic", dto.getTierName());
        assertEquals("YEARLY", dto.getTiertype());
        assertEquals("EUR", dto.getCurrencyCode());
    }

    @Test
    void equals_WithSameValues_ReturnsTrue() {
        // Arrange
        OrderRequestDto dto1 = new OrderRequestDto();
        dto1.setTierName("Premium");
        dto1.setTiertype("MONTHLY");
        dto1.setCurrencyCode("USD");

        OrderRequestDto dto2 = new OrderRequestDto();
        dto2.setTierName("Premium");
        dto2.setTiertype("MONTHLY");
        dto2.setCurrencyCode("USD");

        // Assert - Lombok @Data generates equals
        assertEquals(dto1, dto2);
    }

    @Test
    void hashCode_WithSameValues_ReturnsSameHash() {
        // Arrange
        OrderRequestDto dto1 = new OrderRequestDto();
        dto1.setTierName("Premium");
        dto1.setTiertype("MONTHLY");
        dto1.setCurrencyCode("USD");

        OrderRequestDto dto2 = new OrderRequestDto();
        dto2.setTierName("Premium");
        dto2.setTiertype("MONTHLY");
        dto2.setCurrencyCode("USD");

        // Assert - Lombok @Data generates hashCode
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void toString_ReturnsNonNull() {
        // Arrange
        OrderRequestDto dto = new OrderRequestDto();
        dto.setTierName("Premium");

        // Assert - Lombok @Data generates toString
        assertNotNull(dto.toString());
    }
}
