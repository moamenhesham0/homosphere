package com.homosphere.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class MoneyFormatter {

    public static String format(BigDecimal amount, String currencyCode) {
        Currency currency = Currency.getInstance(currencyCode);
        int fractionDigits = currency.getDefaultFractionDigits();

        return amount
                .setScale(fractionDigits, RoundingMode.HALF_UP)
                .toPlainString();
    }
}
