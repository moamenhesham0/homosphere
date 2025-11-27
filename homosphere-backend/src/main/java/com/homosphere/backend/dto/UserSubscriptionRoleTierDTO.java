package com.homosphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSubscriptionRoleTierDTO {
    private Long subscriptionTierId;
    private String role;
}
