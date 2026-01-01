/**
 * IREEM News Pagination
 * Handles pagination for the news listing page
 */

(function () {
    'use strict';

    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;
    let allArticles = [];
    let totalPages = 1;

    // DOM Elements
    let newsGrid, paginationContainer;

    // Initialize pagination
    async function init() {
        newsGrid = document.getElementById('news-grid');
        paginationContainer = document.getElementById('pagination');

        if (!newsGrid || !paginationContainer) {
            console.error('Missing required elements');
            return;
        }

        // Load articles from index
        try {
            const response = await fetch('data/articles-index.json');
            if (!response.ok) throw new Error('Failed to load articles');
            const data = await response.json();
            allArticles = data.articles || [];
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
            console.error('Error loading articles:', error);
            newsGrid.innerHTML = '<p class="text-center">Gagal memuat berita.</p>';
        }
    }

    // Render articles for current page
    function renderPage(page) {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageArticles = allArticles.slice(start, end);

        newsGrid.innerHTML = pageArticles.map(article => createArticleCard(article)).join('');

        // Scroll to top of news section
        if (page !== 1 || window.scrollY > 200) {
            document.querySelector('.news-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Create article card HTML
    function createArticleCard(article) {
        return `
            <article class="news-card">
                <p class="news-card__date">${article.date}</p>
                <h4 class="news-card__title">${article.title}</h4>
                <img src="${article.thumbnail}" alt="${article.title}" class="news-card__image" loading="lazy">
                <div class="news-card__footer">
                    <a href="detail.html?slug=${article.slug}" class="btn-news">
                        Baca Selengkapnya
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

    // Render pagination controls
    function renderPagination() {
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let html = '<div class="pagination">';

        // Previous button
        html += `
            <button class="pagination__btn pagination__prev ${currentPage === 1 ? 'disabled' : ''}" 
                    ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="goToPage(${currentPage - 1})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
                Sebelumnya
            </button>
        `;

        // Page numbers
        html += '<div class="pagination__numbers">';

        // Logic for showing page numbers
        const showPages = getPageNumbers(currentPage, totalPages);
        showPages.forEach((pageNum, index) => {
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
                Selanjutnya
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>
        `;

        html += '</div>';
        paginationContainer.innerHTML = html;
    }

    // Get page numbers to display (with ellipsis logic)
    function getPageNumbers(current, total) {
        const pages = [];

        if (total <= 7) {
            // Show all pages if 7 or less
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            // Always show first page
            pages.push(1);

            if (current > 3) {
                pages.push('...');
            }

            // Pages around current
            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (current < total - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(total);
        }

        return pages;
    }

    // Go to specific page
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

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
