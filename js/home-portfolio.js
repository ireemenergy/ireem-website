/**
 * Home Featured Projects
 * Loads featured projects from Sanity CMS - Homepage > Proyek Unggulan
 */

(function () {
    'use strict';

    // Sanity CMS Configuration
    const SANITY_PROJECT_ID = '1zvl0z92';
    const SANITY_DATASET = 'production';
    const SANITY_API_VERSION = '2023-05-03';

    // Program labels for projects
    const PROGRAM_LABELS = {
        'energy': { id: 'Energi', en: 'Energy' },
        'environment': { id: 'Lingkungan', en: 'Environment' },
        'natural-resources': { id: 'Sumber Daya Alam', en: 'Natural Resources' },
        'gesi': { id: 'GEDSI', en: 'GEDSI' }
    };

    function getProgramLabel(programs, lang) {
        if (!programs || !programs.length) return lang === 'en' ? 'Project' : 'Proyek';
        const program = programs[0];
        return PROGRAM_LABELS[program]?.[lang] || program;
    }

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

    async function loadFeaturedProjects() {
        const container = document.getElementById('home-portfolio-grid');
        if (!container) return;

        // Show loading state
        container.innerHTML = `
            <div class="portfolio-card portfolio-loading">
                <div class="portfolio-skeleton"></div>
            </div>
            <div class="portfolio-card portfolio-loading">
                <div class="portfolio-skeleton"></div>
            </div>
            <div class="portfolio-card portfolio-loading">
                <div class="portfolio-skeleton"></div>
            </div>
        `;

        try {
            // Query from featuredProjectsSection with override support
            const query = `*[_type == "featuredProjectsSection"][0] {
                projects[] {
                    "category": category.id,
                    "categoryEn": category.en,
                    "overrideTitle": overrideTitle.id,
                    "overrideTitleEn": overrideTitle.en,
                    "overrideDescription": overrideDescription.id,
                    "overrideDescriptionEn": overrideDescription.en,
                    "overrideImage": overrideImage.asset->url,
                    "overrideImageAlt": overrideImage.alt,
                    "project": project-> {
                        _id,
                        "title": title.id,
                        "titleEn": title.en,
                        "slug": slug.current,
                        "shortDescription": shortDescription.id,
                        "shortDescriptionEn": shortDescription.en,
                        "bannerImage": bannerImage.asset->url,
                        "bannerImageAlt": bannerImage.alt,
                        status,
                        "donor": donor.id
                    }
                }
            }`;

            const url = getSanityUrl(query);
            console.info('[HomeFeatured] Fetching featured projects from Sanity...');
            const response = await fetch(url);
            const data = await response.json();

            if (data.result?.projects?.length > 0) {
                console.info('[HomeFeatured] Loaded', data.result.projects.length, 'featured projects');
                renderProjects(data.result.projects, container);
            } else {
                console.warn('[HomeFeatured] No featured projects found, using placeholders');
                renderPlaceholderProjects(container);
            }
        } catch (error) {
            console.error('[HomeFeatured] Error loading featured projects:', error);
            renderPlaceholderProjects(container);
        }
    }

    function renderProjects(projects, container) {
        const lang = getCurrentLanguage();

        container.innerHTML = projects.map(item => {
            // Use override if available, otherwise fallback to project data
            const title = lang === 'en'
                ? (item.overrideTitleEn || item.project?.titleEn || item.project?.title || 'Untitled')
                : (item.overrideTitle || item.project?.title || 'Untitled');

            const description = lang === 'en'
                ? (item.overrideDescriptionEn || item.project?.shortDescriptionEn || item.project?.shortDescription || '')
                : (item.overrideDescription || item.project?.shortDescription || '');

            const category = lang === 'en'
                ? (item.categoryEn || item.category || 'Project')
                : (item.category || item.categoryEn || 'Proyek');

            const imageUrl = item.overrideImage || item.project?.bannerImage || 'images/placeholder-project.jpg';
            const slug = item.project?.slug || '';

            return `
                <a href="${slug ? `portfolio/detail.html?slug=${slug}` : 'portfolio/'}" class="portfolio-card">
                    <div class="portfolio-image">
                        <img src="${imageUrl}" alt="${escapeHtml(title)}" loading="lazy" onerror="this.src='images/placeholder-project.jpg'">
                    </div>
                    <div class="portfolio-content">
                        <span class="portfolio-category">${escapeHtml(category)}</span>
                        <h4 class="portfolio-title">${escapeHtml(title)}</h4>
                        <p class="portfolio-description">${escapeHtml(description)}</p>
                    </div>
                </a>
            `;
        }).join('');

        addPortfolioStyles();
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function renderPlaceholderProjects(container) {
        const lang = getCurrentLanguage();
        const placeholders = [
            {
                title: lang === 'en' ? 'INTENS - Energy Efficiency Program' : 'INTENS - Program Efisiensi Energi',
                description: lang === 'en' ? 'Integrated Energy Efficiency Programme for Building Sector.' : 'Program terpadu efisiensi energi untuk sektor bangunan gedung.',
                category: lang === 'en' ? 'Energy' : 'Energi'
            },
            {
                title: lang === 'en' ? 'AKSELERASI' : 'AKSELERASI',
                description: lang === 'en' ? 'Accelerating GHG Reduction and Energy Transition.' : 'Akselerasi Penurunan Emisi Gas Rumah Kaca dan Transisi Energi.',
                category: lang === 'en' ? 'Energy' : 'Energi'
            },
            {
                title: lang === 'en' ? 'Women in Energy' : 'Perempuan dalam Sektor Energi',
                description: lang === 'en' ? 'Strengthening gender equality and women participation in energy sector.' : 'Penguatan kesetaraan gender dan partisipasi perempuan di sektor energi.',
                category: 'GEDSI'
            }
        ];

        container.innerHTML = placeholders.map(item => `
            <a href="portfolio/" class="portfolio-card">
                <div class="portfolio-image">
                    <div class="portfolio-placeholder-img" style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);"></div>
                </div>
                <div class="portfolio-content">
                    <span class="portfolio-category">${item.category}</span>
                    <h4 class="portfolio-title">${item.title}</h4>
                    <p class="portfolio-description">${item.description}</p>
                </div>
            </a>
        `).join('');

        addPortfolioStyles();
    }

    function addPortfolioStyles() {
        if (document.getElementById('portfolio-styles')) return;

        const style = document.createElement('style');
        style.id = 'portfolio-styles';
        style.textContent = `
            .portfolio-card {
                display: block;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                text-decoration: none;
            }

            .portfolio-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
            }

            .portfolio-image {
                height: 180px;
                overflow: hidden;
            }

            .portfolio-image img,
            .portfolio-placeholder-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s ease;
            }

            .portfolio-card:hover .portfolio-image img {
                transform: scale(1.1);
            }

            .portfolio-content {
                padding: 1.5rem;
            }

            .portfolio-category {
                display: inline-block;
                font-size: 0.75rem;
                font-weight: 700;
                color: var(--color-accent);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 0.5rem;
            }

            .portfolio-title {
                color: var(--color-primary);
                font-size: 1.1rem;
                font-weight: 700;
                line-height: 1.4;
                margin: 0 0 0.75rem 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .portfolio-description {
                color: var(--color-muted);
                font-size: 0.9rem;
                line-height: 1.6;
                margin: 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .portfolio-loading .portfolio-skeleton {
                height: 280px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeletonLoading 1.5s infinite;
            }

            @keyframes skeletonLoading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            @media (max-width: 768px) {
                .portfolio-image {
                    height: 150px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', loadFeaturedProjects);

    // Re-render on language change
    document.addEventListener('languageChanged', loadFeaturedProjects);
})();
