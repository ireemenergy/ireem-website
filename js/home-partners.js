/**
 * Home Partners Logos Renderer - Sanity CMS Integration
 * 
 * Fetches partner data from Sanity CMS and dynamically renders partner logos
 * with automatic duplication for seamless infinite horizontal scrolling.
 * 
 * @file home-partners.js
 * @version 2.0 - Sanity CMS Integration
 */

(function () {
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

    // Build Sanity API URL
    function getSanityUrl(query) {
        const baseUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`;
        const encodedQuery = encodeURIComponent(query);
        return `${baseUrl}?query=${encodedQuery}`;
    }

    // DOM elements
    const partnersTrack = document.querySelector('#home-partners-track');
    const partnersSection = document.querySelector('.partners-section');

    // Exit if partners track doesn't exist on page
    if (!partnersTrack) {
        console.warn('[Home Partners] Partners track not found');
        return;
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================
    async function init() {
        console.info('[Home Partners] Initializing Sanity partners...');
        await fetchPartnersData();
    }

    // ===========================================
    // DATA FETCHING
    // ===========================================
    async function fetchPartnersData() {
        // GROQ Query for partners section
        const query = `*[_type == "partnersSection"][0]{
            sectionTitle,
            sectionSubtitle,
            partners[]{
                name,
                url,
                logo{
                    asset->{ url }
                }
            }
        }`;

        try {
            const url = getSanityUrl(query);
            console.info('[Home Partners] Fetching from Sanity...');

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.info('[Home Partners] Sanity result:', data);

            if (data.result && data.result.partners && data.result.partners.length > 0) {
                // Filter out partners without logos
                const validPartners = data.result.partners.filter(p => p.logo?.asset?.url);

                if (validPartners.length > 0) {
                    renderPartners(validPartners);
                    console.info(`[Home Partners] Loaded ${validPartners.length} partners`);
                } else {
                    console.warn('[Home Partners] No partners with valid logos, hiding section');
                    hideSection();
                }
            } else {
                console.warn('[Home Partners] No partners found, hiding section');
                hideSection();
            }
        } catch (error) {
            console.error('[Home Partners] Error loading partners:', error);
            // Gracefully fail - hide the section
            hideSection();
        }
    }

    // ===========================================
    // RENDERING
    // ===========================================

    /**
     * Render partner logos with automatic duplication for infinite scroll
     */
    function renderPartners(partners) {
        // Clear existing content
        partnersTrack.innerHTML = '';

        // Create first set of logos
        const firstSet = createLogoSet(partners, 'set-1');

        // Create duplicate set for seamless infinite loop
        const duplicateSet = createLogoSet(partners, 'set-2');

        // Append both sets to track
        partnersTrack.appendChild(firstSet);
        partnersTrack.appendChild(duplicateSet);
    }

    /**
     * Create a document fragment containing all partner logos
     */
    function createLogoSet(partners, setId) {
        const fragment = document.createDocumentFragment();

        partners.forEach((partner, index) => {
            const logo = createLogoItem(partner, `${setId}-${index}`);
            fragment.appendChild(logo);
        });

        return fragment;
    }

    /**
     * Create a single partner logo item element
     */
    function createLogoItem(partner, uniqueId) {
        // Create logo container with proper styling
        const item = document.createElement('div');
        item.className = 'logo-item';
        item.id = `partner-${uniqueId}`;

        // Apply inline styles matching original HTML
        item.style.cssText = 'display: flex; flex-direction: column; align-items: center; min-width: 180px; padding: 1rem 2rem;';

        const name = escapeHtml(partner.name || '');
        const logoUrl = partner.logo?.asset?.url || '';

        // Build logo HTML
        // If partner has a URL, wrap in anchor tag for external link
        if (partner.url) {
            item.innerHTML = `
                <a href="${partner.url}" target="_blank" rel="noopener noreferrer" 
                   style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                    <img src="${logoUrl}" alt="${name}" loading="lazy"
                         style="height: 60px; object-fit: contain; margin-bottom: 0.75rem;">
                    <span style="font-size: 0.75rem; color: var(--color-muted); font-weight: 500;">${name}</span>
                </a>
            `;
        } else {
            item.innerHTML = `
                <img src="${logoUrl}" alt="${name}" loading="lazy"
                     style="height: 60px; object-fit: contain; margin-bottom: 0.75rem;">
                <span style="font-size: 0.75rem; color: var(--color-muted); font-weight: 500;">${name}</span>
            `;
        }

        return item;
    }

    /**
     * Hide partners section if no data
     */
    function hideSection() {
        if (partnersSection) {
            partnersSection.style.display = 'none';
        }
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
