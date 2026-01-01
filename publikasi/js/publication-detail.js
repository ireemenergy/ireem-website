/**
 * Publication Detail Page Loader - Sanity CMS Integration
 * Fetches publication data from Sanity CMS and populates the template
 * Supports bilingual content (Indonesian/English)
 * 
 * Usage: detail.html?slug=publication-slug
 * 
 * @author IREEM Development Team
 * @version 3.0 - Bilingual Support
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
    function getSanityUrl(query, params = {}) {
        const baseUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`;
        const encodedQuery = encodeURIComponent(query);

        let paramsString = '';
        for (const [key, value] of Object.entries(params)) {
            paramsString += `&$${key}="${encodeURIComponent(value)}"`;
        }

        return `${baseUrl}?query=${encodedQuery}${paramsString}`;
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

    /**
     * Get content blocks from bilingual localizedBlock field
     * @param {Object|Array} content - Either blocks array or {id: [...], en: [...]}
     * @param {string} lang - Current language
     * @returns {Array} Content blocks
     */
    function getContentBlocks(content, lang) {
        if (!content) return [];
        if (Array.isArray(content)) return content;
        if (typeof content === 'object') {
            return content[lang] || content.id || content.en || [];
        }
        return [];
    }

    // ===========================================
    // DOM ELEMENTS
    // ===========================================
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const publicationWrapper = document.getElementById('publication-wrapper');

    // Get slug from URL parameter
    const slug = new URLSearchParams(window.location.search).get('slug');

    // Store publication data for re-rendering
    let publicationData = null;

    // ===========================================
    // INITIALIZATION
    // ===========================================
    async function init() {
        console.log('[Publication Detail] Initializing with bilingual support, slug:', slug);

        // If no slug provided, show error
        if (!slug) {
            console.error('[Publication Detail] No slug provided');
            showError();
            return;
        }

        await fetchPublication(slug);

        // Listen for language changes
        document.addEventListener('languageChange', () => {
            console.info('[Publication Detail] Language changed, re-rendering...');
            if (publicationData) {
                renderPublication(publicationData);
            }
        });
    }

    // ===========================================
    // DATA FETCHING
    // ===========================================
    async function fetchPublication(slug) {
        // GROQ Query for single publication with bilingual fields
        const query = `*[_type == "publication" && slug.current == $slug][0]{
            _id,
            "slug": slug.current,
            title,
            sidebarTitle,
            publishedDate,
            downloadLink,
            content,
            "bannerImage": {
                "url": bannerImage.asset->url,
                "caption": bannerImage.caption,
                "alt": bannerImage.alt
            },
            "coverImage": {
                "url": coverImage.asset->url,
                "alt": coverImage.alt
            },
            meta {
                fullTitle,
                contributor,
                author,
                publisher,
                language,
                program,
                supporter
            }
        }`;

        try {
            console.log('[Publication Detail] Fetching from Sanity...');
            const url = getSanityUrl(query, { slug });
            console.log('[Publication Detail] API URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[Publication Detail] Sanity result:', data.result);

            if (!data.result) {
                console.error('[Publication Detail] No publication found for slug:', slug);
                showError();
                return;
            }

            publicationData = data.result;
            renderPublication(data.result);

        } catch (error) {
            console.error('[Publication Detail] Error loading publication:', error);
            showError();
        }
    }

    // ===========================================
    // RENDERING
    // ===========================================
    function renderPublication(pub) {
        const lang = getCurrentLanguage();
        console.info('[Publication Detail] Rendering with language:', lang);

        // Hide loading, show content
        if (loadingState) loadingState.style.display = 'none';
        if (publicationWrapper) publicationWrapper.style.display = 'block';

        // Get bilingual title
        const title = getText(pub.title, lang) || 'Publikasi';

        // Update page title
        document.title = `${title} - IREEM`;

        // Populate header
        const dateField = pub.publishedDate;
        setTextContent('publication-date', formatDate(dateField, lang));
        setTextContent('publication-title', title);

        // Populate main content - banner image
        const bannerImg = document.getElementById('publication-banner');
        if (bannerImg) {
            const bannerUrl = pub.bannerImage?.url || pub.coverImage?.url || '';
            if (bannerUrl) {
                bannerImg.src = bannerUrl;
                bannerImg.alt = getText(pub.bannerImage?.alt, lang) || title;
            } else {
                bannerImg.style.display = 'none';
            }
        }

        // Banner caption (if exists)
        const bannerCaption = document.getElementById('publication-banner-caption');
        if (bannerCaption) {
            const caption = getText(pub.bannerImage?.caption, lang);
            if (caption) {
                bannerCaption.textContent = caption;
                bannerCaption.style.display = 'block';
            } else {
                bannerCaption.style.display = 'none';
            }
        }

        // Populate content (Portable Text - bilingual)
        const contentEl = document.getElementById('publication-content');
        if (contentEl && pub.content) {
            const contentBlocks = getContentBlocks(pub.content, lang);
            if (Array.isArray(contentBlocks) && contentBlocks.length > 0) {
                contentEl.innerHTML = renderPortableText(contentBlocks);
            } else if (typeof pub.content === 'string') {
                contentEl.innerHTML = pub.content;
            }
        }

        // Download link
        const downloadLink = document.getElementById('publication-download-link');
        if (downloadLink && pub.downloadLink) {
            downloadLink.href = pub.downloadLink;
            // Update button text based on language
            const downloadText = lang === 'en' ? 'Download PDF' : 'Unduh PDF';
            if (downloadLink.querySelector('span')) {
                downloadLink.querySelector('span').textContent = downloadText;
            } else {
                downloadLink.textContent = downloadText;
            }
        }

        // Populate sidebar - cover image
        const coverImg = document.getElementById('publication-cover');
        if (coverImg) {
            const coverUrl = pub.coverImage?.url || '';
            if (coverUrl) {
                coverImg.src = coverUrl;
                const sidebarTitle = getText(pub.sidebarTitle, lang) || title;
                coverImg.alt = sidebarTitle;
            } else {
                coverImg.style.display = 'none';
            }
        }

        setTextContent('publication-sidebar-title', getText(pub.sidebarTitle, lang) || title);

        // Populate metadata (bilingual where applicable)
        const meta = pub.meta || {};
        setTextContent('meta-full-title', getText(meta.fullTitle, lang) || title);
        setTextContent('meta-contributor', getText(meta.contributor, lang) || '-');
        setTextContent('meta-author', getText(meta.author, lang) || '-');
        setTextContent('meta-publisher', meta.publisher || 'IREEM'); // Single-language
        setTextContent('meta-date', formatDate(dateField, lang));
        setTextContent('meta-language', getText(meta.language, lang) || (lang === 'en' ? 'Indonesian' : 'Indonesia'));
        setTextContent('meta-program', meta.program || '-'); // Single-language
        setTextContent('meta-supporter', meta.supporter || '-'); // Single-language

        console.log('[Publication Detail] Rendered successfully');
    }

    // ===========================================
    // PORTABLE TEXT RENDERER (Basic)
    // ===========================================
    function renderPortableText(blocks) {
        if (!blocks || !Array.isArray(blocks)) return '';

        return blocks.map(block => {
            if (block._type === 'block') {
                const text = (block.children || [])
                    .map(child => {
                        let childText = escapeHtml(child.text || '');
                        // Handle marks (bold, italic, etc.)
                        if (child.marks && child.marks.length > 0) {
                            child.marks.forEach(mark => {
                                if (mark === 'strong') childText = `<strong>${childText}</strong>`;
                                if (mark === 'em') childText = `<em>${childText}</em>`;
                            });
                        }
                        return childText;
                    })
                    .join('');

                switch (block.style) {
                    case 'h1': return `<h1>${text}</h1>`;
                    case 'h2': return `<h2>${text}</h2>`;
                    case 'h3': return `<h3>${text}</h3>`;
                    case 'h4': return `<h4>${text}</h4>`;
                    case 'blockquote': return `<blockquote>${text}</blockquote>`;
                    default: return text ? `<p>${text}</p>` : '';
                }
            }
            // Handle list items
            if (block._type === 'list') {
                const listItems = (block.children || [])
                    .map(item => {
                        const itemText = (item.children || [])
                            .map(c => escapeHtml(c.text || ''))
                            .join('');
                        return `<li>${itemText}</li>`;
                    })
                    .join('');
                return block.listItem === 'number' ? `<ol>${listItems}</ol>` : `<ul>${listItems}</ul>`;
            }
            return '';
        }).join('');
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================
    function showError() {
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
    }

    function setTextContent(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

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
