/**
 * Home Gallery Renderer - Sanity CMS Integration
 * 
 * Fetches gallery data from Sanity CMS and dynamically renders gallery slides
 * with automatic duplication for seamless infinite horizontal scrolling.
 * Supports bilingual content (Indonesian/English).
 * 
 * @file home-gallery.js
 * @version 3.1 - Fixed bilingual support
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

    // Placeholder image for failed loads
    const PLACEHOLDER_IMAGE = 'images/placeholder-gallery.jpg';
    const MAX_ITEMS = 8;

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
        // Check i18n system first
        if (window.i18n && window.i18n.getCurrentLang) {
            return window.i18n.getCurrentLang();
        }
        // Fallback to localStorage
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

        // If it's a string, return as-is
        if (typeof field === 'string') return field;

        // If it's an object with language keys
        if (typeof field === 'object') {
            return field[lang] || field.id || field.en || '';
        }

        return '';
    }

    // DOM elements
    const galleryTrack = document.querySelector('#home-gallery-track');
    const gallerySection = document.querySelector('.gallery-section-light');

    // Exit if gallery track doesn't exist on page
    if (!galleryTrack) {
        console.warn('[Home Gallery] Gallery track not found');
        return;
    }

    // Store current data for re-rendering on language change
    let galleryData = null;

    // ===========================================
    // INITIALIZATION
    // ===========================================
    async function init() {
        console.info('[Home Gallery] Initializing Sanity gallery with bilingual support...');
        await fetchGalleryData();

        // Listen for language changes
        document.addEventListener('languageChange', () => {
            console.info('[Home Gallery] Language changed, re-rendering...');
            if (galleryData) {
                renderGallery(galleryData);
            }
        });
    }

    // ===========================================
    // DATA FETCHING
    // ===========================================
    async function fetchGalleryData() {
        // GROQ Query for home gallery section with bilingual fields
        // Note: overrideTitle and overrideDescription are localizedString/localizedText objects
        const query = `*[_type == "homeGallerySection"][0]{
            sectionTitle,
            sectionSubtitle,
            sectionDescription,
            items[] {
                _key,
                overrideTitle,
                overrideDescription,
                "overrideImageUrl": overrideImage.asset->url,
                "overrideImageAlt": overrideImage.alt,
                news-> {
                    _id,
                    "slug": slug.current,
                    title,
                    excerpt,
                    publishedAt,
                    category,
                    "coverImageUrl": coverImage.asset->url,
                    "coverImageAlt": coverImage.alt
                }
            }
        }`;

        try {
            const url = getSanityUrl(query);
            console.info('[Home Gallery] Fetching from Sanity:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.info('[Home Gallery] Sanity result:', data.result);

            if (data.result && data.result.items && data.result.items.length > 0) {
                galleryData = data.result;
                renderGallery(data.result);
                console.info(`[Home Gallery] Loaded ${data.result.items.length} items`);
            } else {
                console.warn('[Home Gallery] No gallery items found, hiding section');
                hideSection();
            }
        } catch (error) {
            console.error('[Home Gallery] Error loading gallery:', error);
            hideSection();
        }
    }

    // ===========================================
    // RENDERING
    // ===========================================

    /**
     * Render gallery items with automatic duplication for infinite scroll
     */
    function renderGallery(data) {
        const lang = getCurrentLanguage();
        console.info('[Home Gallery] Rendering with language:', lang);

        // Limit to MAX_ITEMS
        const items = (data.items || []).slice(0, MAX_ITEMS);

        // Clear existing content
        galleryTrack.innerHTML = '';

        // Transform Sanity data to gallery format with bilingual support
        const galleryItems = items.map((item, index) => {
            const news = item.news || {};

            // Title: override first, fallback to news title
            const title = getText(item.overrideTitle, lang)
                || getText(news.title, lang)
                || 'Untitled';

            // Description: override first, fallback to news excerpt
            const description = getText(item.overrideDescription, lang)
                || getText(news.excerpt, lang)
                || '';

            // Image: override first, fallback to news cover
            const image = item.overrideImageUrl || news.coverImageUrl || PLACEHOLDER_IMAGE;

            // Alt text for image
            const imageAlt = getText(item.overrideImageAlt, lang)
                || getText(news.coverImageAlt, lang)
                || title;

            // Debug log for first item
            if (index === 0) {
                console.info('[Home Gallery] First item:', {
                    overrideTitle: item.overrideTitle,
                    newsTitle: news.title,
                    resolvedTitle: title,
                    lang
                });
            }

            return {
                title,
                description,
                image,
                imageAlt,
                link: news.slug ? `berita/detail.html?slug=${news.slug}` : null
            };
        });

        // Create first set of slides
        const firstSet = createSlideSet(galleryItems, 'set-1');

        // Create duplicate set for seamless infinite loop
        const duplicateSet = createSlideSet(galleryItems, 'set-2');

        // Append both sets to track
        galleryTrack.appendChild(firstSet);
        galleryTrack.appendChild(duplicateSet);
    }

    /**
     * Create a document fragment containing all gallery slides
     */
    function createSlideSet(items, setId) {
        const fragment = document.createDocumentFragment();

        items.forEach((item, index) => {
            const slide = createSlide(item, `${setId}-${index}`);
            fragment.appendChild(slide);
        });

        return fragment;
    }

    /**
     * Create a single gallery slide element
     */
    function createSlide(item, uniqueId) {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide-light';
        slide.id = `gallery-${uniqueId}`;

        const title = escapeHtml(item.title);
        const description = escapeHtml(item.description);
        const image = item.image;
        const imageAlt = escapeHtml(item.imageAlt || item.title);

        // Build slide HTML with link if available
        if (item.link) {
            slide.innerHTML = `
                <a href="${item.link}" class="gallery-link" style="text-decoration: none; color: inherit; display: block;">
                    <div class="gallery-image-light">
                        <img src="${image}" alt="${imageAlt}" loading="lazy" onerror="this.src='${PLACEHOLDER_IMAGE}'">
                    </div>
                    <div class="gallery-caption-light">
                        <h4>${title}</h4>
                        <p>${description}</p>
                    </div>
                </a>
            `;
        } else {
            slide.innerHTML = `
                <div class="gallery-image-light">
                    <img src="${image}" alt="${imageAlt}" loading="lazy" onerror="this.src='${PLACEHOLDER_IMAGE}'">
                </div>
                <div class="gallery-caption-light">
                    <h4>${title}</h4>
                    <p>${description}</p>
                </div>
            `;
        }

        return slide;
    }

    /**
     * Hide gallery section if no data
     */
    function hideSection() {
        if (gallerySection) {
            gallerySection.style.display = 'none';
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
