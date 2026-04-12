import { apiRequest } from './apiClient';

export const propertySubmissionReviewApi = {
    createPropertySubmissionReview(reviewData, token) {
        return apiRequest('/api/property-submission-review/create', {
            method: 'POST',
            token,
            body: reviewData,
        });
    },

    deletePropertySubmissionReview(reviewId, token) {
        return apiRequest(`/api/property-submission-review/delete/${encodeURIComponent(reviewId)}`, {
            method: 'DELETE',
            token,
        });
    },

    getPropertySubmissionReviewById(reviewId, token) {
        return apiRequest(`/api/property-submission-review/${encodeURIComponent(reviewId)}`, {
            token,
        });
    },

    getAllPropertySubmissionReviews(token) {
        return apiRequest('/api/property-submission-review/all', {
            token,
        });
    },
};

