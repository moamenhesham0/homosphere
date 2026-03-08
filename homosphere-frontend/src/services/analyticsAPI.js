// src/services/analyticsAPI.js
import { apiCall } from '../utils/api';

/**
 * Fetch all properties for the current user
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of properties with id and title
 */
export async function fetchUserProperties(token) {
    try {
        const response = await apiCall('/api/analytics/properties/user', {
            method: 'GET'
        }, token);

        // Map backend response to expected format
        return response.map(property => ({
            id: property.id,
            title: property.title || property.name,
        }));
    } catch (error) {
        console.error('Error fetching user properties:', error);
        throw error;
    }
}

/**
 * Fetch analytics/stats for a specific property
 * @param {number} propertyId - Property ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Property stats (impressions, clicks, leads)
 */
export async function fetchPropertyStats(propertyId, token) {
    try {
        const response = await apiCall(`/api/analytics/property/${propertyId}`, {
            method: 'GET'
        }, token);
        // Map backend response to expected format
        return {
            impressions: response.impressions || response.views || 0,
            clicks: response.clicks || 0,
            leads: response.leads || response.contacts || 0,
        };
    } catch (error) {
        console.error('Error fetching property stats:', error);
        throw error;
    }
}

/**
 * Fetch analytics for all user properties
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Object with propertyId as key and stats as value
 */
export async function fetchAllPropertyStats(token) {
    try {
        const response = await apiCall('/api/analytics/properties', {
            method: 'GET'
        }, token);
        
        // Transform array response to object keyed by propertyId
        const statsMap = {};
        response.forEach(stat => {
            statsMap[stat.propertyId] = {
                impressions: stat.impressions || stat.views || 0,
                clicks: stat.clicks || 0,
                leads: stat.leads || stat.contacts || 0,
            };
        });
        
        return statsMap;
    } catch (error) {
        console.error('Error fetching all property stats:', error);
        throw error;
    }
}


export async function fetchUserSubscriptionAnalytics(token){
    try{
        const response = await apiCall('/api/analytics/subscriptions/user',{
            method: 'GET'
        }, token)

        return response;
    }catch (error){
        console.error('Error fetching user subscription analytics:', error);
        throw error;
    }
}

