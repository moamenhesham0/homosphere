package com.homosphere.backend.exception;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

class UserNotFoundExceptionTest {

    @Test
    void constructor_WithUUID_SetsCorrectMessage() {
        // Arrange
        UUID userId = UUID.randomUUID();

        // Act
        UserNotFoundException exception = new UserNotFoundException(userId);

        // Assert
        assertEquals("User not found with id: " + userId, exception.getMessage());
    }

    @Test
    void exception_HasResponseStatusAnnotation() {
        // Assert
        ResponseStatus annotation = UserNotFoundException.class.getAnnotation(ResponseStatus.class);
        assertEquals(HttpStatus.NOT_FOUND, annotation.value());
    }

    @Test
    void exception_ExtendsRuntimeException() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UserNotFoundException exception = new UserNotFoundException(userId);

        // Assert
        assertTrue(exception instanceof RuntimeException);
    }

    @Test
    void exception_MessageContainsUserId() {
        // Arrange
        UUID userId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");

        // Act
        UserNotFoundException exception = new UserNotFoundException(userId);

        // Assert
        assertTrue(exception.getMessage().contains("123e4567-e89b-12d3-a456-426614174000"));
    }

    @Test
    void exception_MessageFormat() {
        // Arrange
        UUID userId = UUID.randomUUID();

        // Act
        UserNotFoundException exception = new UserNotFoundException(userId);

        // Assert
        assertTrue(exception.getMessage().startsWith("User not found with id: "));
    }
}
