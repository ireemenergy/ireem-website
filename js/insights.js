/**
 * Insights Page - Load and render cards for Publications, FactSheets, and News
 */

(function () {
    'use strict';

    // Sanity CMS Configuration
    const SANITY_PROJECT_ID = '1zvl0z92';
    const SANITY_DATASET = 'production';
    const SANITY_API_VERSION = '2023-05-03';

    // Placeholder FactSheet data (proyek IREEM)
    const PLACEHOLDER_FACTSHEETS = [
        {
            slug: 'uk-pact-phase-2',
            image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
            category: 'PROYEK',
            title: {
                id: 'Scaling-Up Strategies for Transforming Actions in Energy Efficiency',
                en: 'Scaling-Up Strategies for Transforming Actions in Energy Efficiency'
            },
            description: {
                id: 'Pengembangan kebijakan perluasan efisiensi energi (UK PACT Phase 2) untuk sektor industri dan bangunan.',
                en: 'Developing energy efficiency scaling policies (UK PACT Phase 2) for industry and building sectors.'
            }
        },
        {
            slug: 'energy-audits-level-2',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
            category: 'PROYEK',
            title: {
                id: 'Energy Audits Level 2 (Berbagai Gedung Pemerintah)',
                en: 'Energy Audits Level 2 (Various Government Buildings)'
            },
            description: {
                id: 'Audit energi pada gedung kementerian, provinsi, rumah sakit, dan universitas.',
                en: 'Energy audits on ministry buildings, provincial offices, hospitals, and universities.'
            }
        },
        {
            slug: 'akselerasi-mrv',
            image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop',
            category: 'PROYEK',
            title: {
                id: 'AKSELERASI – Sistem MRV untuk Mitigasi GRK Sektor Energi',
                en: 'AKSELERASI – MRV System for Energy Sector GHG Mitigation'
            },
            description: {
                id: 'Platform digital MRV untuk pemantauan dan pelaporan aksi mitigasi GRK sektor energi.',
                en: 'Digital MRV platform for monitoring and reporting energy sector GHG mitigation actions.'
            }
        },
        {
            slug: 'iso-50001',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
            category: 'PROYEK',
            title: {
                id: 'Implementasi SNI ISO 50001 di Sektor Industri',
                en: 'SNI ISO 50001 Implementation in Industry Sector'
            },
            description: {
                id: 'Pendampingan teknis implementasi sistem manajemen energi standar ISO 50001.',
                en: 'Technical assistance for ISO 50001 energy management system implementation.'
            }
        }
    ];

    // Placeholder publications if Sanity fails
    const PLACEHOLDER_PUBLICATIONS = [
        {
            slug: 'gesi-card-book',
            date: '10 Juni 2025',
            title: 'Buku Kartu GESI – Wanita Teladan dan Pemimpin di Sektor Efisiensi Energi',
            image: '../images/publications/gesi-cover.png'
        },
        {
            slug: 'model-bisnis-efisiensi-energi',
            date: '1 Maret 2025',
            title: 'Kajian Model Bisnis Efisiensi Energi di Sarana dan Prasarana Pemerintah dan Pemerintah Daerah',
            image: '../images/publications/model-bisnis.png'
        },
        {
            slug: 'modul-pengukuran-verifikasi',
            date: '11 Februari 2025',
            title: 'Modul Pengukuran dan Verifikasi Kinerja Energi',
            image: '../images/publications/modul-mv.png'
        },
        {
            slug: 'panduan-audit-energi',
            date: '5 Januari 2025',
            title: 'Panduan Audit Energi untuk Gedung Pemerintah',
            image: '../images/publications/panduan-audit.png'
        }
    ];

    // Placeholder news if Sanity fails
    const PLACEHOLDER_NEWS = [
        {
            slug: 'team-outing-lampung',
            date: '22 Desember 2025',
            title: 'Perkuat Soliditas Tim, IREEM Gelar Team Outing di Pulau Pahawang, Lampung',
            excerpt: 'Kegiatan team building untuk memperkuat kekompakan tim IREEM di lokasi wisata alam.',
            category: 'Kegiatan',
            image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop'
        },
        {
            slug: 'asar-humanity-banjir',
            date: '22 Desember 2025',
            title: 'IREEM Bersama ASAR Humanity Salurkan Bantuan Kemanusiaan untuk Penyintas Banjir di Sumatera',
            excerpt: 'Kolaborasi kemanusiaan untuk membantu masyarakat terdampak bencana banjir.',
            category: 'CSR',
            image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop'
        },
        {
            slug: 'gesi-grk-perempuan',
            date: '8 Desember 2025',
            title: 'IREEM & Direktorat Konservasi Energi Perkuat Upaya GESI dan Pengurangan GRK',
            excerpt: '40,6% perempuan berperan sentral dalam program efisiensi energi nasional.',
            category: 'Workshop',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
        },
        {
            slug: 'pelatihan-auditor-energi-batch-16',
            date: '1 Desember 2025',
            title: 'Pelatihan Auditor Energi Batch 16 Sukses Digelar di Jakarta',
            excerpt: 'Program sertifikasi auditor energi untuk meningkatkan kapasitas profesional.',
            category: 'Pelatihan',
            image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop'
        }
    ];

    function getSanityUrl(query) {
        const baseUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
        const encodedQuery = encodeURIComponent(query);
        return `${baseUrl}?query=${encodedQuery}`;
    }

    function getCurrentLanguage() {
        if (window.i18n && typeof window.i18n.getCurrentLang === 'function') {
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

    // ============== PUBLICATIONS ==============
    function renderPublicationCard(pub) {
        const lang = getCurrentLanguage();
        const title = getText(pub.title, lang) || pub.title;
        const date = pub.date || pub.publishedAt || '';
        const image = pub.coverImage?.url || pub.image || '../images/placeholder-publication.jpg';
        const slug = pub.slug?.current || pub.slug || '#';

        return `
            <div class="publication-card" style="background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; transition: transform 0.3s, box-shadow 0.3s;">
                <p class="small" style="padding: 1.25rem 1.25rem 0.25rem; margin: 0; color: var(--color-muted); font-weight: 500;">${date}</p>
                <h4 style="padding: 0 1.25rem 1rem; margin: 0; color: var(--color-primary); font-size: 0.95rem; line-height: 1.4; min-height: 60px;">${title}</h4>
                <div style="padding: 0 1.25rem;">
                    <img src="${image}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" onerror="this.src='../images/placeholder-publication.jpg'">
                </div>
                <div style="padding: 1.25rem;">
                    <a href="../publikasi/detail.html?slug=${slug}" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem; font-size: 0.85rem; border-radius: 8px;">
                        Baca Selengkapnya
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8l4 4-4 4M8 12h8"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    }

    async function loadPublications() {
        const container = document.getElementById('insights-publications-grid');
        if (!container) return;

        try {
            // Fetch publications from Sanity - using publishedDate (same as publications-list.js)
            const query = `*[_type == "publication"] | order(publishedDate desc)[0...4] {
                "slug": slug.current,
                title,
                publishedDate,
                "coverImage": coverImage {
                    "url": asset->url
                }
            }`;

            const url = getSanityUrl(query);
            console.info('[Insights] Fetching publications from Sanity...');
            const response = await fetch(url);
            const data = await response.json();

            if (data.result && data.result.length > 0) {
                console.info('[Insights] Loaded', data.result.length, 'publications from Sanity');
                const lang = getCurrentLanguage();
                const pubs = data.result.map(pub => ({
                    ...pub,
                    date: pub.publishedDate ? new Date(pub.publishedDate).toLocaleDateString(
                        lang === 'en' ? 'en-GB' : 'id-ID',
                        { day: 'numeric', month: 'long', year: 'numeric' }
                    ) : ''
                }));
                container.innerHTML = pubs.map(renderPublicationCard).join('');
            } else {
                console.warn('[Insights] No publications from Sanity, using placeholder');
                container.innerHTML = PLACEHOLDER_PUBLICATIONS.map(renderPublicationCard).join('');
            }
        } catch (error) {
            console.error('[Insights] Error loading publications:', error);
            container.innerHTML = PLACEHOLDER_PUBLICATIONS.map(renderPublicationCard).join('');
        }
    }

    // ============== FACTSHEETS ==============
    function renderFactsheetCard(fact) {
        const lang = getCurrentLanguage();
        const title = getText(fact.title, lang);
        const description = getText(fact.description, lang);
        // Use thumbnail for Wawasan page (thumbnail/cover field from Sanity)
        const image = fact.thumbnail?.url || fact.coverImage?.url || fact.image || '../images/placeholder-factsheet.jpg';
        const category = getCategoryLabel(fact.category, lang);
        const slug = fact.slug?.current || fact.slug || '#';

        return `
            <a href="../factsheet/detail.html?slug=${slug}" class="factsheet-card" style="display: block; text-decoration: none; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; transition: transform 0.3s, box-shadow 0.3s;">
                <div style="position: relative;">
                    <img src="${image}" alt="${title}" style="width: 100%; height: 160px; object-fit: cover;" onerror="this.src='../images/placeholder-factsheet.jpg'">
                </div>
                <div style="padding: 1.25rem;">
                    <span style="display: inline-block; font-size: 0.7rem; font-weight: 700; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">${category}</span>
                    <h4 style="color: var(--color-primary); font-size: 0.95rem; line-height: 1.4; margin: 0 0 0.5rem 0; min-height: 45px;">${title}</h4>
                    <p style="color: var(--color-muted); font-size: 0.8rem; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${description}</p>
                </div>
            </a>
        `;
    }

    function getCategoryLabel(category, lang) {
        const labels = {
            energi: { id: 'Energi', en: 'Energy' },
            lingkungan: { id: 'Lingkungan', en: 'Environment' },
            sda: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
            gedsi: { id: 'GEDSI', en: 'GEDSI' }
        };
        return labels[category]?.[lang] || category || 'Proyek';
    }

    async function loadFactsheets() {
        const container = document.getElementById('insights-factsheets-grid');
        if (!container) return;

        try {
            // Fetch factsheets from Sanity - using thumbnail for cover image
            const query = `*[_type == "factsheet"] | order(publishDate desc)[0...4] {
                _id,
                title,
                "slug": slug.current,
                category,
                description,
                "thumbnail": thumbnail {
                    "url": asset->url,
                    alt
                }
            }`;

            const response = await fetch(getSanityUrl(query));
            const data = await response.json();

            if (data.result && data.result.length > 0) {
                console.info('[Insights] Loaded', data.result.length, 'factsheets from Sanity');
                container.innerHTML = data.result.map(renderFactsheetCard).join('');
            } else {
                console.warn('[Insights] No factsheets from Sanity, using placeholder');
                container.innerHTML = PLACEHOLDER_FACTSHEETS.map(renderFactsheetCard).join('');
            }
        } catch (error) {
            console.error('[Insights] Error loading factsheets:', error);
            container.innerHTML = PLACEHOLDER_FACTSHEETS.map(renderFactsheetCard).join('');
        }
    }

    // ============== NEWS ==============
    function renderNewsCard(news) {
        const lang = getCurrentLanguage();
        const title = getText(news.title, lang) || news.title;
        const date = news.date || news.publishedAt || '';
        const excerpt = getText(news.excerpt, lang) || news.excerpt || '';
        const category = news.category || 'Berita';
        const image = news.mainImage?.url || news.coverImageUrl || news.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop';
        const slug = news.slug?.current || news.slug || '#';

        // Homepage style card: image with category badge, then date, title, excerpt
        return `
            <a href="../berita/detail.html?slug=${slug}" class="news-card" style="display: block; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; text-decoration: none; padding: 0.5rem;">
                <div style="position: relative; height: 160px; overflow: hidden; border-radius: 10px;">
                    <img src="${image}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop'">
                    <span style="position: absolute; top: 0.5rem; left: 0.5rem; padding: 0.15rem 0.5rem; background: var(--color-secondary); color: white; font-size: 0.6rem; font-weight: 700; border-radius: 20px; text-transform: uppercase;">${category}</span>
                </div>
                <div style="padding: 0.75rem 0.75rem 0.5rem;">
                    <p style="font-size: 0.7rem; color: var(--color-accent); font-weight: 600; margin: 0 0 0.5rem 0;">${date}</p>
                    <h4 style="color: var(--color-primary); font-size: 0.95rem; font-weight: 700; line-height: 1.35; margin: 0 0 0.5rem 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${title}</h4>
                    <p style="color: var(--color-muted); font-size: 0.75rem; line-height: 1.4; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${excerpt}</p>
                </div>
            </a>
        `;
    }

    async function loadNews() {
        const container = document.getElementById('insights-news-grid');
        if (!container) return;

        try {
            // Fetch news from Sanity - using type "news" (same as news-list.js)
            const query = `*[_type == "news" && defined(publishedAt)] | order(publishedAt desc)[0...4] {
                title,
                "slug": slug.current,
                publishedAt,
                excerpt,
                category,
                "coverImageUrl": coverImage.asset->url
            }`;

            const url = getSanityUrl(query);
            console.info('[Insights] Fetching news from Sanity...');
            const response = await fetch(url);
            const data = await response.json();

            if (data.result && data.result.length > 0) {
                console.info('[Insights] Loaded', data.result.length, 'news from Sanity');
                const lang = getCurrentLanguage();
                const news = data.result.map(item => ({
                    ...item,
                    date: new Date(item.publishedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }),
                    category: getText(item.category, lang) || 'Berita',
                    excerpt: getText(item.excerpt, lang) || ''
                }));
                container.innerHTML = news.map(renderNewsCard).join('');
            } else {
                console.warn('[Insights] No news from Sanity, using placeholder');
                container.innerHTML = PLACEHOLDER_NEWS.map(renderNewsCard).join('');
            }
        } catch (error) {
            console.error('[Insights] Error loading news:', error);
            container.innerHTML = PLACEHOLDER_NEWS.map(renderNewsCard).join('');
        }
    }

    // ============== HOVER EFFECTS ==============
    function addHoverEffects() {
        const cards = document.querySelectorAll('.publication-card, .factsheet-card, .news-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            });
        });
    }

    // ============== INIT ==============
    async function init() {
        await Promise.all([
            loadPublications(),
            loadFactsheets(),
            loadNews()
        ]);
        addHoverEffects();
    }

    document.addEventListener('DOMContentLoaded', init);

    // Language change
    document.addEventListener('languageChanged', init);

    // Export
    window.InsightsPage = {
        reload: init
    };
})();
