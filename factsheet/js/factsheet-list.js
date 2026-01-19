/**
 * FactSheet List Page
 * Loads and displays factsheet cards with category filtering
 * Data fetched from Sanity CMS
 */

(function () {
    'use strict';

    // Sanity Configuration
    const SANITY_PROJECT_ID = '1zvl0z92';
    const SANITY_DATASET = 'production';
    const SANITY_API_VERSION = '2023-05-03';

    // Category labels for display
    const CATEGORY_LABELS = {
        energi: { id: 'Energi', en: 'Energy' },
        lingkungan: { id: 'Lingkungan', en: 'Environment' },
        sda: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
        gedsi: { id: 'GEDSI', en: 'GEDSI' }
    };

    // Fallback data if Sanity fetch fails
    const FALLBACK_FACTSHEETS = [
        {
            slug: 'uk-pact-phase-1-summary',
            title: { id: 'Ringkasan Dampak UK-PACT Fase 1', en: 'UK-PACT Phase 1 Impact Summary' },
            category: 'energi',
            publishDate: '2024-06-15',
            thumbnail: { url: '../images/factsheets/onepager-1.png' },
            description: { id: 'Rangkuman satu halaman pencapaian proyek UK-PACT Fase 1.', en: 'One-page summary of UK-PACT Phase 1 achievements.' }
        }
    ];

    let factsheets = [];
    let currentFilter = 'all';

    // ===========================================
    // SANITY FETCH FUNCTIONS
    // ===========================================

    function getSanityUrl(query) {
        const baseUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
        const encodedQuery = encodeURIComponent(query);
        return `${baseUrl}?query=${encodedQuery}`;
    }

    async function fetchFactsheetsFromSanity() {
        const query = `*[_type == "factsheet"] | order(publishDate desc) {
            _id,
            title,
            "slug": slug.current,
            category,
            program,
            publishDate,
            description,
            "thumbnail": thumbnail {
                "url": asset->url,
                alt
            },
            "factsheetPages": factsheetPages[] {
                "url": asset->url,
                alt,
                pageNumber
            },
            tags,
            "projectReference": projectReference-> {
                _id,
                "slug": slug.current,
                title
            },
            "relatedFactsheets": relatedFactsheets[]-> {
                _id,
                "slug": slug.current,
                title,
                category,
                "thumbnail": thumbnail.asset->url
            }
        }`;

        try {
            const url = getSanityUrl(query);
            console.info('[FactsheetList] Fetching from Sanity:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.result && Array.isArray(data.result)) {
                console.info(`[FactsheetList] Loaded ${data.result.length} factsheets from Sanity`);
                return data.result;
            } else {
                console.warn('[FactsheetList] Empty or invalid result from Sanity');
                return [];
            }
        } catch (error) {
            console.error('[FactsheetList] Error fetching from Sanity:', error);
            return null; // Return null to indicate error
        }
    }

    // ===========================================
    // HELPER FUNCTIONS
    // ===========================================

    function getCurrentLanguage() {
        if (window.i18n && typeof window.i18n.getCurrentLang === 'function') {
            return window.i18n.getCurrentLang();
        }
        return localStorage.getItem('ireem_lang') || 'id';
    }

    function getText(field, lang) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[lang] || field.id || field.en || '';
    }

    function formatDate(dateStr, lang) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', options);
    }

    function getCategoryLabel(category, lang) {
        return CATEGORY_LABELS[category]?.[lang] || category || '';
    }

    // ===========================================
    // RENDER FUNCTIONS
    // ===========================================

    function renderLoading() {
        const grid = document.getElementById('factsheet-grid');
        if (!grid) return;

        grid.innerHTML = `
            <div class="factsheet-card loading">
                <div class="card-thumbnail skeleton"></div>
                <div class="card-body">
                    <div class="skeleton" style="height: 20px; width: 60px; margin-bottom: 0.5rem;"></div>
                    <div class="skeleton" style="height: 24px; width: 80%;"></div>
                </div>
            </div>
            <div class="factsheet-card loading">
                <div class="card-thumbnail skeleton"></div>
                <div class="card-body">
                    <div class="skeleton" style="height: 20px; width: 60px; margin-bottom: 0.5rem;"></div>
                    <div class="skeleton" style="height: 24px; width: 80%;"></div>
                </div>
            </div>
            <div class="factsheet-card loading">
                <div class="card-thumbnail skeleton"></div>
                <div class="card-body">
                    <div class="skeleton" style="height: 20px; width: 60px; margin-bottom: 0.5rem;"></div>
                    <div class="skeleton" style="height: 24px; width: 80%;"></div>
                </div>
            </div>
        `;
    }

    function renderError() {
        const grid = document.getElementById('factsheet-grid');
        const lang = getCurrentLanguage();
        if (!grid) return;

        const errorText = lang === 'en'
            ? 'Failed to load factsheets. Please try again later.'
            : 'Gagal memuat factsheet. Silakan coba lagi nanti.';

        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-muted);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p>${errorText}</p>
            </div>
        `;
    }

    function renderCards() {
        const grid = document.getElementById('factsheet-grid');
        const emptyState = document.getElementById('empty-state');
        const lang = getCurrentLanguage();

        if (!grid) return;

        // Filter factsheets
        const filtered = currentFilter === 'all'
            ? factsheets
            : factsheets.filter(f => f.category === currentFilter);

        if (filtered.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        grid.innerHTML = filtered.map(factsheet => {
            const title = getText(factsheet.title, lang);
            const categoryLabel = getCategoryLabel(factsheet.category, lang);
            const date = formatDate(factsheet.publishDate, lang);
            // Use first page from factsheetPages as cover, fallback to thumbnail
            const thumbnail = (factsheet.factsheetPages && factsheet.factsheetPages[0]?.url)
                || factsheet.thumbnail?.url
                || '../images/placeholder-factsheet.jpg';

            return `
                <a href="detail.html?slug=${factsheet.slug}" class="factsheet-card">
                    <div class="card-thumbnail">
                        <img src="${thumbnail}" alt="${title}" loading="lazy"
                             onerror="this.src='../images/placeholder-factsheet.jpg'">
                        <div class="card-overlay">
                            <span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                                ${lang === 'en' ? 'View Detail' : 'Lihat Detail'}
                            </span>
                        </div>
                    </div>
                    <div class="card-body">
                        <span class="card-category">${categoryLabel}</span>
                        <h4 class="card-title">${title}</h4>
                        <p class="card-date">${date}</p>
                    </div>
                </a>
            `;
        }).join('');

    }

    // ===========================================
    // FILTER FUNCTIONS
    // ===========================================

    function initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update filter and re-render
                currentFilter = btn.dataset.category;
                renderCards();
            });
        });
    }

    function getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function applyFilterFromURL() {
        const categoryParam = getURLParameter('category');
        if (categoryParam) {
            // Map URL parameter to internal category values
            const categoryMap = {
                'energy': 'energi',
                'energi': 'energi',
                'environment': 'lingkungan',
                'lingkungan': 'lingkungan',
                'sda': 'sda',
                'natural-resources': 'sda',
                'gedsi': 'gedsi'
            };

            const mappedCategory = categoryMap[categoryParam.toLowerCase()] || categoryParam;
            currentFilter = mappedCategory;

            // Update active button state
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.category === mappedCategory) {
                    btn.classList.add('active');
                }
            });
        }
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================

    async function init() {
        console.info('[FactsheetList] Initializing...');

        // Show loading state
        renderLoading();

        // Apply URL filters first
        applyFilterFromURL();
        initFilters();

        // Fetch data from Sanity
        const sanityData = await fetchFactsheetsFromSanity();

        if (sanityData === null) {
            // Fetch failed, use fallback data
            console.warn('[FactsheetList] Using fallback data');
            factsheets = FALLBACK_FACTSHEETS;
        } else if (sanityData.length === 0) {
            // No data returned from Sanity, use fallback
            console.warn('[FactsheetList] No data from Sanity, using fallback');
            factsheets = FALLBACK_FACTSHEETS;
        } else {
            // Success! Use Sanity data
            factsheets = sanityData;
        }

        // Render cards
        renderCards();

        // Re-render on language change
        document.addEventListener('languageChanged', renderCards);

        console.info('[FactsheetList] Initialized successfully');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for debugging
    window.FactsheetList = {
        getFactsheets: () => factsheets,
        refresh: init
    };
})();
