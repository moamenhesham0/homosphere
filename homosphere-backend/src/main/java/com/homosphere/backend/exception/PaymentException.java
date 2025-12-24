package com.homosphere.backend.exception;

public class PaymentException extends RuntimeException {
    private final int statusCode;

    public PaymentException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public PaymentException(String message, Throwable cause, int statusCode) {
        super(message, cause);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
