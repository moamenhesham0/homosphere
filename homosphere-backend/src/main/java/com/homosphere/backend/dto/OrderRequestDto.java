package com.homosphere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderRequestDto {
    @NotBlank
    private String tierName;

    @NotBlank
    private String tiertype;

    @NotBlank
    private String currencyCode;
}
