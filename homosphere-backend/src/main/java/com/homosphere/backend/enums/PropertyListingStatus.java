package com.homosphere.backend.enums;


/**
 * Enum representing the various statuses a property listing can have
 * <ul>
 *     * <li><b>DRAFT:</b> The listing is being created and is not yet submitted for review.</li>
 *     * <li><b>PENDING:</b> The listing has been submitted and is awaiting review.</li>
 *     * <li><b>REJECTED:</b> The listing has been reviewed and rejected.</li>
 *     * <li><b>REQUIRES_CHANGES:</b> The listing needs modifications before it can be approved.</li>
 *     * <li><b>PUBLISHED:</b> The listing is live and visible to potential buyers.</li>
 *     * <li><b>UNLISTED:</b> The listing has been removed from public view due to subscription expiration or seller's choice.</li>
 *     * <li><b>SOLD:</b> The property has been sold.</li>
 * </ul>
 */
public enum PropertyListingStatus {
    DRAFT,
    PENDING,
    REJECTED,
    REQUIRES_CHANGES,
    PUBLISHED,
    UNLISTED,
    SOLD
}
