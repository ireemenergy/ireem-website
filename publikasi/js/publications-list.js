/**
 * IREEM Publications List - Sanity CMS Integration
 * 
 * Fetches publications from Sanity headless CMS
 * Displays publication cards sorted by date
 * Supports bilingual content (Indonesian/English)
 * 
 * @author IREEM Development Team
 * @version 2.0 - Bilingual Support
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

    // ===========================================
    // LANGUAGE DETECTION
    // ===========================================
    function getCurrentLanguage() {
        if (window.i18n && window.i18n.getCurrentLang) {
            return window.i18n.getCurrentLang();
        }
        return localStorage.getItem('ireem_lang') || 'id';
    }

    /**
     * Get text from bilingual object
     * @param {Object|string} field - Either a string or {id: '...', en: '...'}
     * @param {string} lang - Current language ('id' or 'en')
     * @returns {string} The localized text
     */
    function getText(field, lang) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object') {
            return field[lang] || field.id || field.en || '';
        }
        return '';
    }

    // ===========================================
    // DOM ELEMENTS
    // ===========================================
    let publicationsGrid;
    let publicationsData = null;

    // ===========================================
    // INITIALIZATION
    // ===========================================

    async function init() {
        console.info('[IREEM Publications] Initializing Sanity publications list with bilingual support...');

        publicationsGrid = document.getElementById('publications-grid');

        if (!publicationsGrid) {
            console.error('[IREEM Publications] Missing publications-grid element');
            return;
        }

        // Show loading state
        const lang = getCurrentLanguage();
        const loadingText = lang === 'en' ? 'Loading publications...' : 'Memuat publikasi...';
        publicationsGrid.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 4rem 0;">
                <p style="color: var(--color-muted);">${loadingText}</p>
            </div>
        `;

        await loadPublications();

        // Listen for language changes
        document.addEventListener('languageChange', () => {
            console.info('[IREEM Publications] Language changed, re-rendering...');
            if (publicationsData) {
                renderPublications(publicationsData);
            }
        });
    }

    // ===========================================
    // DATA FETCHING
    // ===========================================

    async function loadPublications() {
        // GROQ Query for all publications with bilingual fields
        const query = `*[_type == "publication"] | order(publishedDate desc) {
            _id,
            "slug": slug.current,
            title,
            sidebarTitle,
            publishedDate,
            "coverImageUrl": coverImage.asset->url,
            "coverImageAlt": coverImage.alt
        }`;

        try {
            console.info('[IREEM Publications] Fetching from Sanity...');
            const url = getSanityUrl(query);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const publications = data.result || [];

            console.info(`[IREEM Publications] Loaded ${publications.length} publications`);

            if (publications.length === 0) {
                showEmptyState();
                return;
            }

            publicationsData = publications;
            renderPublications(publications);

        } catch (error) {
            console.error('[IREEM Publications] Error loading publications:', error);
            showError(error.message);
        }
    }

    // ===========================================
    // RENDERING
    // ===========================================

    function renderPublications(publications) {
        const lang = getCurrentLanguage();
        console.info('[IREEM Publications] Rendering with language:', lang);
        publicationsGrid.innerHTML = publications.map(pub => createPublicationCard(pub, lang)).join('');
    }

    function createPublicationCard(publication, lang) {
        const formattedDate = formatDate(publication.publishedDate, lang);
        const imageUrl = publication.coverImageUrl || '../images/placeholder-publication.jpg';

        // Bilingual title and sidebarTitle
        const title = getText(publication.title, lang) || 'Untitled';
        const sidebarTitle = getText(publication.sidebarTitle, lang);
        const altText = getText(publication.coverImageAlt, lang) || title;

        const slug = publication.slug || '';
        const readMoreText = lang === 'en' ? 'Read More' : 'Baca Selengkapnya';

        return `
            <div class="publication-card"
                style="background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; transition: transform 0.3s, box-shadow 0.3s;">
                <p class="small"
                    style="padding: 1.25rem 1.25rem 0.5rem; color: var(--color-muted); font-weight: 500;">${formattedDate}</p>
                <h4
                    style="padding: 0 1.25rem 1rem; color: var(--color-primary); font-size: 1rem; line-height: 1.4;">
                    ${escapeHtml(title)}</h4>
                <div style="padding: 0 1.25rem;">
                    <img src="${imageUrl}" alt="${escapeHtml(altText)}"
                        style="width: 100%; height: 320px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
                        onerror="this.src='../images/placeholder-publication.jpg'">
                </div>
                <div style="padding: 1.25rem;">
                    <a href="detail.html?slug=${slug}" class="btn btn-primary"
                        style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem; font-size: 0.85rem; border-radius: 8px;">
                        ${readMoreText}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8l4 4-4 4M8 12h8" />
                        </svg>
                    </a>
                </div>
            </div>
        `;
    }

    function showEmptyState() {
        const lang = getCurrentLanguage();
        const emptyText = lang === 'en' ? 'No publications available yet.' : 'Belum ada publikasi tersedia.';
        publicationsGrid.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 4rem 0;">
                <p style="color: var(--color-muted);">${emptyText}</p>
            </div>
        `;
    }

    function showError(message) {
        const lang = getCurrentLanguage();
        const errorTitle = lang === 'en' ? 'Failed to load publications.' : 'Gagal memuat publikasi.';
        const retryText = lang === 'en' ? 'Try Again' : 'Coba Lagi';
        publicationsGrid.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 4rem 0;">
                <p style="color: var(--color-error); margin-bottom: 1rem;">${errorTitle}</p>
                <p style="color: var(--color-muted); font-size: 0.875rem;">${escapeHtml(message)}</p>
                <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                    ${retryText}
                </button>
            </div>
        `;
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================

    function formatDate(dateString, lang) {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return dateString;
            }

            const locale = lang === 'en' ? 'en-US' : 'id-ID';
            return date.toLocaleDateString(locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

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
