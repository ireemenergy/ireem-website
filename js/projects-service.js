/**
 * IREEM Projects Service - Sanity CMS Integration
 * 
 * Single source of truth for project data fetching.
 * Features:
 * - Fetch all projects from Sanity (once, cached)
 * - Filter utilities for Program and Impact pages
 * - No duplicate fetching
 * 
 * @file projects-service.js
 * @version 1.0
 */

(function (global) {
    'use strict';

    // ===========================================
    // SANITY CMS CONFIGURATION
    // ===========================================
    const SANITY_CONFIG = {
        projectId: '1zvl0z92',
        dataset: 'production',
        apiVersion: '2023-05-03',
        useCdn: true
    };

    // Cache settings
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Internal state
    let _cache = null;
    let _cacheTime = 0;
    let _fetchPromise = null;

    // ===========================================
    // CORE FUNCTIONS
    // ===========================================

    /**
     * Build Sanity API URL with GROQ query
     */
    function getSanityUrl(query) {
        const baseUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`;
        const encodedQuery = encodeURIComponent(query);
        return `${baseUrl}?query=${encodedQuery}`;
    }

    /**
     * GROQ Query for fetching all projects with nested activities
     * Updated for bilingual fields: forms { id, en }, achievements.label { id, en }
     */
    const PROJECTS_QUERY = `*[_type == "project"] | order(periodStart desc) {
        title,
        "slug": slug.current,
        shortDescription,
        donor,
        periodStart,
        periodEnd,
        status,
        programs,
        provinces,
        activities[]{
            activityType,
            forms,
            achievements[]{ label, value }
        },
        highlights,
        coverImage { asset->{ url } }
    }`;

    /**
     * Fetch all projects from Sanity
     * Uses cache to avoid duplicate requests
     * 
     * @returns {Promise<Array>} Array of project objects
     */
    async function fetchAll() {
        const now = Date.now();

        // Return cached data if valid
        if (_cache && (now - _cacheTime) < CACHE_DURATION) {
            console.info('[ProjectsService] Returning cached data');
            return _cache;
        }

        // If already fetching, wait for that promise
        if (_fetchPromise) {
            console.info('[ProjectsService] Waiting for existing fetch...');
            return _fetchPromise;
        }

        // Start new fetch
        console.info('[ProjectsService] Fetching projects from Sanity...');

        _fetchPromise = (async () => {
            try {
                const url = getSanityUrl(PROJECTS_QUERY);
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                if (!data.result) {
                    console.warn('[ProjectsService] No projects found');
                    return [];
                }

                // Update cache
                _cache = data.result;
                _cacheTime = now;

                console.info(`[ProjectsService] Fetched ${_cache.length} projects`);
                return _cache;

            } catch (error) {
                console.error('[ProjectsService] Error fetching projects:', error);
                throw error;
            } finally {
                _fetchPromise = null;
            }
        })();

        return _fetchPromise;
    }

    /**
     * Clear the cache (useful for debugging or forced refresh)
     */
    function clearCache() {
        _cache = null;
        _cacheTime = 0;
        console.info('[ProjectsService] Cache cleared');
    }

    // ===========================================
    // FILTER UTILITIES
    // ===========================================

    /**
     * Filter projects by program
     * @param {Array} projects - Array of projects
     * @param {string} programSlug - 'energy', 'environment', 'natural-resources', 'gesi'
     * @returns {Array} Filtered projects
     */
    function filterByProgram(projects, programSlug) {
        if (!projects || !programSlug) return projects || [];
        return projects.filter(p => p.programs?.includes(programSlug));
    }

    /**
     * Filter projects by activity type
     * @param {Array} projects - Array of projects
     * @param {string} activityType - 'capacity-building', 'policy-advisory', 'technical-assistance', 'research'
     * @returns {Array} Filtered projects
     */
    function filterByActivity(projects, activityType) {
        if (!projects || !activityType) return projects || [];
        return projects.filter(p =>
            p.activities?.some(a => a.activityType === activityType)
        );
    }

    /**
     * Filter projects by province
     * @param {Array} projects - Array of projects
     * @param {string} provinceSlug - e.g., 'jakarta', 'jawa-barat'
     * @returns {Array} Filtered projects
     */
    function filterByProvince(projects, provinceSlug) {
        if (!projects || !provinceSlug) return projects || [];
        return projects.filter(p => p.provinces?.includes(provinceSlug));
    }

    /**
     * Filter projects by status
     * @param {Array} projects - Array of projects
     * @param {string} status - 'ongoing', 'completed', 'planned'
     * @returns {Array} Filtered projects
     */
    function filterByStatus(projects, status) {
        if (!projects || !status) return projects || [];
        return projects.filter(p => p.status === status);
    }

    /**
     * Get specific activity data from a project
     * @param {Object} project - Single project object
     * @param {string} activityType - Type of activity to extract
     * @returns {Object|null} Activity object or null
     */
    function getActivityData(project, activityType) {
        if (!project?.activities) return null;
        return project.activities.find(a => a.activityType === activityType) || null;
    }

    // ===========================================
    // BILINGUAL HELPER FUNCTIONS
    // ===========================================

    /**
     * Get current language from i18n system or default to 'id'
     * @returns {string} 'id' or 'en'
     */
    function getCurrentLang() {
        return window.i18n?.currentLang || localStorage.getItem('ireem-lang') || 'id';
    }

    /**
     * Get text from bilingual field
     * Handles both old string format and new { id, en } format
     * @param {string|Object} field - Field value (string or { id, en })
     * @param {string} lang - Language code ('id' or 'en')
     * @returns {string} Resolved text
     */
    function getText(field, lang) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        lang = lang || getCurrentLang();
        return field[lang] || field.id || '';
    }

    /**
     * Get array from bilingual array field
     * Handles both old array format and new { id: [], en: [] } format
     * Falls back to Indonesian if requested language array is empty
     * @param {Array|Object} field - Field value (array or { id: [], en: [] })
     * @param {string} lang - Language code ('id' or 'en')
     * @returns {Array} Resolved array
     */
    function getArray(field, lang) {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        lang = lang || getCurrentLang();

        // Check if requested language has data
        const langArray = field[lang];
        if (langArray && langArray.length > 0) {
            return langArray;
        }

        // Fallback to Indonesian
        const idArray = field.id;
        if (idArray && idArray.length > 0) {
            return idArray;
        }

        return [];
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================

    /**
     * Format project period for display
     * @param {string} start - Start date
     * @param {string} end - End date (optional)
     * @returns {string} Formatted period string
     */
    function formatPeriod(start, end) {
        if (!start) return '';

        const startYear = new Date(start).getFullYear();

        if (!end) {
            return `${startYear}–ongoing`;
        }

        const endYear = new Date(end).getFullYear();

        if (startYear === endYear) {
            return `${startYear}`;
        }

        return `${startYear}–${endYear}`;
    }

    /**
     * Get status label (bilingual)
     * @param {string} status - Status value
     * @param {string} lang - Language code ('id' or 'en')
     * @returns {string} Localized label
     */
    function getStatusLabel(status, lang) {
        lang = lang || getCurrentLang();
        const labels = {
            'ongoing': { id: 'Berlangsung', en: 'Ongoing' },
            'completed': { id: 'Selesai', en: 'Completed' },
            'planned': { id: 'Direncanakan', en: 'Planned' }
        };
        const label = labels[status];
        if (!label) return status;
        return label[lang] || label.id;
    }

    /**
     * Get activity type label (bilingual)
     * @param {string} activityType - Activity type value
     * @param {string} lang - Language code ('id' or 'en')
     * @returns {string} Localized label
     */
    function getActivityLabel(activityType, lang) {
        lang = lang || getCurrentLang();
        const labels = {
            'capacity-building': { id: 'Capacity Building', en: 'Capacity Building' },
            'policy-advisory': { id: 'Kebijakan & Regulasi', en: 'Policy & Regulation' },
            'technical-assistance': { id: 'Pendampingan Teknis', en: 'Technical Assistance' },
            'research': { id: 'Riset & Studi', en: 'Research & Study' }
        };
        const label = labels[activityType];
        if (!label) return activityType;
        return label[lang] || label.id;
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===========================================
    // EXPORT SERVICE
    // ===========================================

    const ProjectsService = {
        // Core
        fetchAll,
        clearCache,

        // Filters
        filterByProgram,
        filterByActivity,
        filterByProvince,
        filterByStatus,
        getActivityData,

        // Bilingual helpers
        getCurrentLang,
        getText,
        getArray,

        // Utilities
        formatPeriod,
        getStatusLabel,
        getActivityLabel,
        escapeHtml,

        // Config (for debugging)
        config: SANITY_CONFIG
    };

    // Expose to global scope
    global.ProjectsService = ProjectsService;

    console.info('[ProjectsService] Initialized');

})(window);
