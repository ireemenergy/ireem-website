/**
 * Centralized Sanity CMS Configuration
 * 
 * This config is used across all pages that fetch from Sanity.
 * Update this file to change Sanity settings globally.
 * 
 * @file sanity-config.js
 * @version 1.0
 */

window.SANITY_CONFIG = {
    projectId: '1zvl0z92',
    dataset: 'production',
    apiVersion: '2023-05-03', // Use a valid past date (YYYY-MM-DD)
    useCdn: true
};

/**
 * Build Sanity API URL with GROQ query
 * @param {string} query - GROQ query string
 * @returns {string} - Complete Sanity API URL
 */
window.getSanityUrl = function (query) {
    const baseUrl = `https://${window.SANITY_CONFIG.projectId}.api.sanity.io/v${window.SANITY_CONFIG.apiVersion}/data/query/${window.SANITY_CONFIG.dataset}`;
    const encodedQuery = encodeURIComponent(query);
    return `${baseUrl}?query=${encodedQuery}`;
};

console.info('[Sanity Config] Initialized with API version:', window.SANITY_CONFIG.apiVersion);
