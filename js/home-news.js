/**
 * Home Dynamic News
 * Loads latest news from Sanity CMS - Homepage > Galeri Kegiatan > Dalam Aksi > Gallery Items
 */

(function () {
    'use strict';

    // Sanity CMS Configuration - same as home-gallery.js
    const SANITY_PROJECT_ID = '1zvl0z92';
    const SANITY_DATASET = 'production';
    const SANITY_API_VERSION = '2023-05-03';

    function getSanityUrl(query) {
        const baseUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
        const encodedQuery = encodeURIComponent(query);
        return `${baseUrl}?query=${encodedQuery}`;
    }

    function getCurrentLanguage() {
        if (window.i18n && window.i18n.getCurrentLang) {
            return window.i18n.getCurrentLang();
        }
        return localStorage.getItem('ireem_lang') || 'id';
    }

    function getText(field, lang) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object') {
            return field[lang] || field.id || field.en || '';
        }
        return '';
    }

    async function loadNews() {
        const container = document.getElementById('home-news-track');
        if (!container) return;

        // Show loading state
        container.innerHTML = `
            <div class="news-carousel-loading"></div>
            <div class="news-carousel-loading"></div>
            <div class="news-carousel-loading"></div>
            <div class="news-carousel-loading"></div>
        `;

        try {
            // Query from homeGallerySection - same structure as home-gallery.js
            const query = `*[_type == "homeGallerySection"][0]{
                items[] {
                    _key,
                    overrideTitle,
                    overrideDescription,
                    "overrideImageUrl": overrideImage.asset->url,
                    news-> {
                        _id,
                        "slug": slug.current,
                        title,
                        excerpt,
                        publishedAt,
                        category,
                        "coverImageUrl": coverImage.asset->url
                    }
                }
            }`;

            const url = getSanityUrl(query);
            const response = await fetch(url);
            const data = await response.json();

            if (data.result && data.result.items && data.result.items.length > 0) {
                // Use all items for carousel
                renderNews(data.result.items, container);
            } else {
                renderPlaceholderNews(container);
            }
        } catch (error) {
            console.error('Error loading news:', error);
            renderPlaceholderNews(container);
        }
    }

    function renderNews(items, container) {
        const lang = getCurrentLanguage();

        // Create cards HTML
        const cardsHTML = items.map(item => {
            const news = item.news || {};

            // Title: override first, fallback to news title
            const title = getText(item.overrideTitle, lang)
                || getText(news.title, lang)
                || 'Untitled';

            // Description: override first, fallback to news excerpt
            const excerpt = getText(item.overrideDescription, lang)
                || getText(news.excerpt, lang)
                || '';

            // Image: override first, fallback to news cover
            const imageUrl = item.overrideImageUrl || news.coverImageUrl || 'images/placeholder-news.jpg';

            const category = news.category || 'Berita';
            const date = news.publishedAt ? formatDate(news.publishedAt, lang) : '';
            const slug = news.slug || '';

            return `
                <a href="${slug ? `berita/detail.html?slug=${slug}` : 'berita/'}" class="news-carousel-card">
                    <div class="news-carousel-image">
                        <img src="${imageUrl}" alt="${title}" loading="lazy" onerror="this.src='images/placeholder-news.jpg'">
                        <span class="news-carousel-category">${category}</span>
                    </div>
                    <div class="news-carousel-content">
                        <p class="news-carousel-date">${date}</p>
                        <h4 class="news-carousel-title">${title}</h4>
                        <p class="news-carousel-excerpt">${excerpt}</p>
                    </div>
                </a>
            `;
        }).join('');

        // Duplicate cards for seamless infinite scroll
        container.innerHTML = cardsHTML + cardsHTML;
    }

    function renderPlaceholderNews(container) {
        const placeholders = [
            {
                title: 'IREEM Gelar Pelatihan Audit Energi Level 2',
                excerpt: 'Program pelatihan untuk meningkatkan kapasitas auditor energi di Indonesia.',
                category: 'Pelatihan',
                date: 'Desember 2024'
            },
            {
                title: 'Kolaborasi dengan UK-PACT untuk Dekarbonisasi Industri',
                excerpt: 'Kemitraan strategis untuk mendorong transisi energi sektor industri.',
                category: 'Kemitraan',
                date: 'November 2024'
            },
            {
                title: 'Workshop Efisiensi Energi Bangunan Gedung',
                excerpt: 'Kegiatan peningkatan kapasitas untuk pengelola bangunan komersial.',
                category: 'Workshop',
                date: 'Oktober 2024'
            },
            {
                title: 'Bimtek Manajemen Energi Kalimantan',
                excerpt: 'Pelatihan teknis untuk optimalisasi penggunaan energi di wilayah Kalimantan.',
                category: 'Bimtek',
                date: 'September 2024'
            }
        ];

        const cardsHTML = placeholders.map(item => `
            <a href="berita/" class="news-carousel-card">
                <div class="news-carousel-image">
                    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); display: flex; align-items: center; justify-content: center;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5">
                            <path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                        </svg>
                    </div>
                    <span class="news-carousel-category">${item.category}</span>
                </div>
                <div class="news-carousel-content">
                    <p class="news-carousel-date">${item.date}</p>
                    <h4 class="news-carousel-title">${item.title}</h4>
                    <p class="news-carousel-excerpt">${item.excerpt}</p>
                </div>
            </a>
        `).join('');

        // Duplicate for seamless infinite scroll
        container.innerHTML = cardsHTML + cardsHTML;
    }

    function formatDate(dateString, lang) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', options);
    }

    function addNewsStyles() {
        if (document.getElementById('news-home-styles')) return;

        const style = document.createElement('style');
        style.id = 'news-home-styles';
        style.textContent = `
            .news-home-card {
                display: block;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                text-decoration: none;
            }

            .news-home-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
            }

            .news-home-image {
                height: 180px;
                overflow: hidden;
                position: relative;
            }

            .news-home-image img,
            .news-home-placeholder-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s ease;
            }

            .news-home-card:hover .news-home-image img {
                transform: scale(1.1);
            }

            .news-home-category {
                position: absolute;
                top: 1rem;
                left: 1rem;
                padding: 0.25rem 0.75rem;
                background: var(--color-secondary);
                color: white;
                font-size: 0.7rem;
                font-weight: 700;
                border-radius: 20px;
                text-transform: uppercase;
            }

            .news-home-content {
                padding: 1.25rem;
            }

            .news-home-date {
                font-size: 0.75rem;
                color: var(--color-accent);
                font-weight: 600;
                margin: 0 0 0.5rem 0;
            }

            .news-home-title {
                color: var(--color-primary);
                font-size: 1.05rem;
                font-weight: 700;
                line-height: 1.4;
                margin: 0 0 0.5rem 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .news-home-excerpt {
                color: var(--color-muted);
                font-size: 0.85rem;
                line-height: 1.5;
                margin: 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .news-loading .news-skeleton {
                height: 300px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeletonLoading 1.5s infinite;
            }
        `;

        document.head.appendChild(style);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', loadNews);

    // Re-render on language change
    if (window.i18n && window.i18n.onLanguageChange) {
        window.i18n.onLanguageChange(loadNews);
    }
})();
