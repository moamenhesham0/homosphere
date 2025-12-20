package com.homosphere.backend.enums;

/**
 * Enum representing the management status of a property listing.
 * <ul>
 * <li><b>SELLER_AUTHORIZED:</b> Only the seller has authorized the listing.</li>
 * <li><b>BROKER_REQUESTED:</b> The seller has opened the property for broker management.</li>
 * <li><b>BROKER_PENDING_AUTHORIZATION:</b> A broker has requested to manage the listing.</li>
 * <li><b>BROKER_AUTHORIZED:</b> The broker has been authorized to manage the listing.</li>
 * </ul>
 */
public enum PropertyListingManagementStatus {
    SELLER_AUTHORIZED,
    BROKER_REQUESTED,
    BROKER_PENDING_AUTHORIZATION,
    BROKER_AUTHORIZED,
}
