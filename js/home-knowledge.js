/**
 * Home Featured Knowledge
 * Loads latest publications from Sanity CMS
 */

(function () {
    'use strict';

    // Sanity CMS Configuration
    const SANITY_PROJECT_ID = '1zvl0z92';
    const SANITY_DATASET = 'production';
    const SANITY_API_VERSION = '2024-01-01';

    function getSanityUrl(query, params = {}) {
        const baseUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
        const encodedQuery = encodeURIComponent(query);
        let url = `${baseUrl}?query=${encodedQuery}`;

        for (const [key, value] of Object.entries(params)) {
            url += `&$${key}="${encodeURIComponent(value)}"`;
        }
        return url;
    }

    async function loadPublications() {
        const container = document.getElementById('home-knowledge-grid');
        if (!container) return;

        // Show loading state
        container.innerHTML = `
            <div class="knowledge-card knowledge-loading">
                <div class="knowledge-skeleton"></div>
            </div>
            <div class="knowledge-card knowledge-loading">
                <div class="knowledge-skeleton"></div>
            </div>
            <div class="knowledge-card knowledge-loading">
                <div class="knowledge-skeleton"></div>
            </div>
        `;

        try {
            // Full query with publication reference
            const query = `*[_type == "reportsSection"][0] {
                items[] {
                    category,
                    overrideTitle,
                    overrideDescription,
                    "publication": publication-> {
                        _id,
                        "slug": slug.current,
                        title,
                        sidebarTitle,
                        publishedDate,
                        publicationType,
                        "coverImageUrl": coverImage.asset->url,
                        "bannerImageUrl": bannerImage.asset->url,
                        "pdfUrl": pdfFile.asset->url
                    }
                }
            }`;

            const url = getSanityUrl(query);
            console.log('[Knowledge] Fetching from URL:', url);
            const response = await fetch(url);

            if (!response.ok) {
                console.error('[Knowledge] Fetch failed with status:', response.status);
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('[Knowledge] Sanity response:', data);
            console.log('[Knowledge] Result:', data.result);

            if (data.result && data.result.items && data.result.items.length > 0) {
                renderPublications(data.result.items, container);
            } else {
                console.log('[Knowledge] No items found, using placeholders');
                renderPlaceholderPublications(container);
            }
        } catch (error) {
            console.error('Error loading publications:', error);
            renderPlaceholderPublications(container);
        }
    }

    // Helper function to get text from bilingual field
    function getText(field, lang) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[lang] || field.id || field.en || '';
    }

    function renderPublications(items, container) {
        const lang = window.i18n?.getCurrentLang?.() ||
            window.i18n?.getCurrentLanguage?.() ||
            localStorage.getItem('ireem_lang') || 'id';

        console.log('[Knowledge] Rendering with language:', lang);

        const readMoreText = lang === 'id' ? 'Baca Selengkapnya' : 'Read More';

        container.innerHTML = items.map(item => {
            const pub = item.publication;
            if (!pub) {
                console.warn('[Knowledge] Item has no publication reference:', item);
                return '';
            }

            // Use override if exists, fallback to publication data
            const title = getText(item.overrideTitle, lang) || getText(pub.title, lang) || 'Untitled';
            const imageUrl = pub.coverImageUrl || pub.bannerImageUrl || 'images/placeholder-publication.jpg';
            const date = pub.publishedDate ? formatDate(pub.publishedDate, lang) : '';
            const slug = pub.slug || '';

            console.log(`[Knowledge] Rendering: ${title}`);

            return `
                <div class="publication-card" style="background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; transition: transform 0.3s, box-shadow 0.3s;">
                    <p class="small" style="padding: 1.25rem 1.25rem 0.5rem; color: var(--color-muted); font-weight: 500;">${date}</p>
                    <h4 style="padding: 0 1.25rem 1rem; color: var(--color-primary); font-size: 1rem; line-height: 1.4;">${title}</h4>
                    <div style="padding: 0 1.25rem;">
                        <img src="${imageUrl}" alt="${title}" loading="lazy"
                            style="width: 100%; height: 320px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
                            onerror="this.src='images/placeholder-publication.jpg';">
                    </div>
                    <div style="padding: 1.25rem;">
                        <a href="publikasi/detail.html?slug=${slug}" class="btn btn-primary"
                            style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem; font-size: 0.85rem; border-radius: 8px;">
                            ${readMoreText}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8l4 4-4 4M8 12h8" />
                            </svg>
                        </a>
                    </div>
                </div>
            `;
        }).filter(html => html !== '').join('');

        addKnowledgeStyles();
    }

    function renderPlaceholderPublications(container) {
        const placeholders = [
            {
                title: 'Laporan Tahunan IREEM 2024',
                excerpt: 'Ringkasan kegiatan dan pencapaian IREEM selama tahun 2024.',
                category: 'Laporan',
                date: 'Desember 2024'
            },
            {
                title: 'Policy Brief: Transisi Energi Berkeadilan',
                excerpt: 'Rekomendasi kebijakan untuk transisi energi yang inklusif.',
                category: 'Policy Brief',
                date: 'November 2024'
            },
            {
                title: 'Studi Potensi Efisiensi Energi Industri',
                excerpt: 'Analisis peluang penghematan energi di sektor industri Indonesia.',
                category: 'Kajian',
                date: 'Oktober 2024'
            }
        ];

        container.innerHTML = placeholders.map(pub => `
            <a href="publikasi/" class="knowledge-card">
                <div class="knowledge-image">
                    <div class="knowledge-placeholder-img" style="background: linear-gradient(135deg, #1a5276 0%, #2980b9 100%); display: flex; align-items: center; justify-content: center;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5">
                            <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <span class="knowledge-category">${pub.category}</span>
                </div>
                <div class="knowledge-content">
                    <p class="knowledge-date">${pub.date}</p>
                    <h4 class="knowledge-title">${pub.title}</h4>
                    <p class="knowledge-excerpt">${pub.excerpt}</p>
                </div>
            </a>
        `).join('');

        addKnowledgeStyles();
    }

    function formatDate(dateString, lang) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', options);
    }

    function addKnowledgeStyles() {
        if (document.getElementById('knowledge-styles')) return;

        const style = document.createElement('style');
        style.id = 'knowledge-styles';
        style.textContent = `
            .publication-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            }

            .knowledge-loading .knowledge-skeleton {
                height: 380px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeletonLoading 1.5s infinite;
                border-radius: 16px;
            }

            @keyframes skeletonLoading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;

        document.head.appendChild(style);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', loadPublications);

    // Re-render on language change
    document.addEventListener('languageChanged', function () {
        console.log('[Knowledge] Language changed, reloading publications');
        loadPublications();
    });
})();
