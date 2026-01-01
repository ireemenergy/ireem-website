/**
 * IREEM News List - Sanity CMS Integration
 * 
 * Fetches news list from Sanity headless CMS
 * Displays news cards with pagination
 * 
 * @author IREEM Development Team
 * @version 1.0 - Sanity CMS Integration
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

    const ITEMS_PER_PAGE = 12;

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
    // LANGUAGE SUPPORT (Bilingual)
    // ===========================================

    /**
     * Get current language from i18n system
     * Falls back to 'id' if not available
     */
    function getCurrentLanguage() {
        return window.IREEM_i18n?.currentLanguage || localStorage.getItem('ireem_lang') || 'id';
    }

    /**
     * Get text from bilingual field with fallback
     * @param {Object} field - Bilingual object {id: '...', en: '...'}
     * @param {string} lang - Current language ('id' or 'en')
     * @returns {string} - Text in requested language or fallback to Indonesian
     */
    function getText(field, lang) {
        if (!field) return '';
        // If it's a string (old format), return as-is
        if (typeof field === 'string') return field;
        // New bilingual format
        return field[lang] || field.id || '';
    }

    // ===========================================
    // STATE
    // ===========================================
    let currentPage = 1;
    let allArticles = [];
    let totalPages = 1;

    // DOM Elements
    let newsGrid, paginationContainer;

    // ===========================================
    // INITIALIZATION
    // ===========================================

    async function init() {
        console.info('[IREEM News] Initializing Sanity news list...');

        newsGrid = document.getElementById('news-grid');
        paginationContainer = document.getElementById('pagination');

        if (!newsGrid) {
            console.error('[IREEM News] Missing news-grid element');
            return;
        }

        // Show loading state
        newsGrid.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 4rem 0;">
                <p style="color: var(--color-muted);">Memuat berita dari Sanity...</p>
            </div>
        `;

        await loadArticles();
    }

    // ===========================================
    // DATA FETCHING
    // ===========================================

    async function loadArticles() {
        // GROQ Query for all news articles - ordered by publishedAt
        const query = `*[_type == "news" && defined(publishedAt)] | order(publishedAt desc) {
            title,
            "slug": slug.current,
            publishedAt,
            excerpt,
            coverImage{
                asset->{url}
            }
        }`;

        try {
            console.info('[IREEM News] Fetching from Sanity...');
            const url = getSanityUrl(query);
            console.info('[IREEM News] API URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.info('[IREEM News] Sanity response:', data);

            allArticles = data.result || [];
            console.info(`[IREEM News] Loaded ${allArticles.length} articles`);

            if (allArticles.length === 0) {
                showEmptyState();
                return;
            }

            totalPages = Math.ceil(allArticles.length / ITEMS_PER_PAGE);

            // Check URL for page parameter
            const urlParams = new URLSearchParams(window.location.search);
            const pageParam = parseInt(urlParams.get('page'));
            if (pageParam && pageParam > 0 && pageParam <= totalPages) {
                currentPage = pageParam;
            }

            renderPage(currentPage);
            renderPagination();

        } catch (error) {
            console.error('[IREEM News] Error loading articles:', error);
            showError(error.message);
        }
    }

    // ===========================================
    // RENDERING
    // ===========================================

    function renderPage(page) {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageArticles = allArticles.slice(start, end);

        newsGrid.innerHTML = pageArticles.map(article => createArticleCard(article)).join('');

        // Scroll to top of news section (only if not first page load)
        if (page !== 1 || window.scrollY > 200) {
            document.querySelector('.news-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function createArticleCard(article) {
        const lang = getCurrentLanguage();
        const formattedDate = formatDate(article.publishedAt, lang);
        const imageUrl = article.coverImage?.asset?.url || '../images/placeholder-news.jpg';
        const title = escapeHtml(getText(article.title, lang) || 'Untitled');
        const slug = article.slug || '';

        // Localized "Read More" button text
        const readMoreText = lang === 'en' ? 'Read More' : 'Baca Selengkapnya';

        return `
            <article class="news-card">
                <p class="news-card__date">${formattedDate}</p>
                <h4 class="news-card__title">${title}</h4>
                <img src="${imageUrl}" alt="${title}" class="news-card__image" loading="lazy" 
                     onerror="this.src='../images/placeholder-news.jpg'">
                <div class="news-card__footer">
                    <a href="detail.html?slug=${slug}" class="btn-news">
                        ${readMoreText}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16l4-4-4-4"></path>
                            <path d="M8 12h8"></path>
                        </svg>
                    </a>
                </div>
            </article>
        `;
    }

    function showEmptyState() {
        const lang = getCurrentLanguage();
        const emptyText = lang === 'en' ? 'No news available yet.' : 'Belum ada berita tersedia.';
        newsGrid.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 4rem 0;">
                <p style="color: var(--color-muted);">${emptyText}</p>
            </div>
        `;
    }

    function showError(message) {
        const lang = getCurrentLanguage();
        const errorText = lang === 'en' ? 'Failed to load news.' : 'Gagal memuat berita.';
        const retryText = lang === 'en' ? 'Try Again' : 'Coba Lagi';
        newsGrid.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 4rem 0;">
                <p style="color: var(--color-error); margin-bottom: 1rem;">${errorText}</p>
                <p style="color: var(--color-muted); font-size: 0.875rem;">${escapeHtml(message)}</p>
                <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                    ${retryText}
                </button>
            </div>
        `;
    }
    // ===========================================
    // PAGINATION
    // ===========================================

    function renderPagination() {
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        const lang = getCurrentLanguage();
        const prevText = lang === 'en' ? 'Previous' : 'Sebelumnya';
        const nextText = lang === 'en' ? 'Next' : 'Selanjutnya';

        let html = '<div class="pagination">';

        // Previous button
        html += `
            <button class="pagination__btn pagination__prev ${currentPage === 1 ? 'disabled' : ''}" 
                    ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="goToPage(${currentPage - 1})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
                ${prevText}
            </button>
        `;

        // Page numbers
        html += '<div class="pagination__numbers">';
        const showPages = getPageNumbers(currentPage, totalPages);
        showPages.forEach((pageNum) => {
            if (pageNum === '...') {
                html += '<span class="pagination__ellipsis">...</span>';
            } else {
                html += `
                    <button class="pagination__num ${pageNum === currentPage ? 'active' : ''}" 
                            onclick="goToPage(${pageNum})">${pageNum}</button>
                `;
            }
        });
        html += '</div>';

        // Next button
        html += `
            <button class="pagination__btn pagination__next ${currentPage === totalPages ? 'disabled' : ''}" 
                    ${currentPage === totalPages ? 'disabled' : ''} 
                    onclick="goToPage(${currentPage + 1})">
                ${nextText}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>
        `;

        html += '</div>';
        paginationContainer.innerHTML = html;
    }

    function getPageNumbers(current, total) {
        const pages = [];

        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            pages.push(1);
            if (current > 3) pages.push('...');

            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);
            for (let i = start; i <= end; i++) pages.push(i);

            if (current < total - 2) pages.push('...');
            pages.push(total);
        }

        return pages;
    }

    // Global function for pagination buttons
    window.goToPage = function (page) {
        if (page < 1 || page > totalPages || page === currentPage) return;

        currentPage = page;

        // Update URL without reload
        const url = new URL(window.location);
        if (page === 1) {
            url.searchParams.delete('page');
        } else {
            url.searchParams.set('page', page);
        }
        window.history.pushState({}, '', url);

        renderPage(page);
        renderPagination();
    };

    // Handle browser back/forward
    window.addEventListener('popstate', function () {
        const urlParams = new URLSearchParams(window.location.search);
        const page = parseInt(urlParams.get('page')) || 1;
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            currentPage = page;
            renderPage(page);
            renderPagination();
        }
    });

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================

    function formatDate(dateString, lang = 'id') {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
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
    // LANGUAGE CHANGE LISTENER
    // ===========================================

    // Re-render page when language changes
    document.addEventListener('languageChange', () => {
        if (allArticles.length > 0) {
            renderPage(currentPage);
            renderPagination();
        }
    });

    // ===========================================
    // INITIALIZATION
    // ===========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
