const FALLBACK_PROPERTY_IMAGE =
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80';

export function getCollectionPayload(payload) {
    if (!payload) {
        return [];
    }

    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload.content)) {
        return payload.content;
    }

    return [];
}

export function getPropertyImageUrl(propertyLike) {
    if (!propertyLike) {
        return FALLBACK_PROPERTY_IMAGE;
    }

    const bannerUrl = propertyLike?.bannerImage?.imageUrl;
    if (bannerUrl) {
        return bannerUrl;
    }

    const firstImageUrl = propertyLike?.propertyImages?.[0]?.imageUrl;
    if (firstImageUrl) {
        return firstImageUrl;
    }

    return FALLBACK_PROPERTY_IMAGE;
}

export function formatPrice(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return 'N/A';
    }

    return Number(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    });
}

export function formatCompactAddress(city, state) {
    if (city && state) {
        return `${city}, ${state}`;
    }

    return city || state || 'Location unavailable';
}

export function getFullName(firstName, lastName, fallback = 'Unknown User') {
    const parts = [firstName, lastName].filter(Boolean);
    if (parts.length === 0) {
        return fallback;
    }

    return parts.join(' ');
}

