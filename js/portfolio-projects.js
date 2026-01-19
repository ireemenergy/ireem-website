/**
 * IREEM Portfolio Projects
 * 
 * Handles featured projects and filterable project database
 * for the Portfolio page.
 * 
 * @file portfolio-projects.js
 * @version 1.0
 */

(function () {
    'use strict';

    // ===========================================
    // CONFIGURATION
    // ===========================================

    const ACTIVITY_TYPES = {
        'capacity-building': {
            label: { id: 'Capacity Building', en: 'Capacity Building' },
            color: '#2563eb',
            gradient: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            formLabel: { id: 'Bentuk Capacity Building', en: 'Capacity Building Forms' }
        },
        'policy-advisory': {
            label: { id: 'Kebijakan & Regulasi', en: 'Policy & Regulation' },
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            formLabel: { id: 'Bentuk Kebijakan/Regulasi', en: 'Policy/Regulation Forms' }
        },
        'technical-assistance': {
            label: { id: 'Pendampingan Teknis', en: 'Technical Assistance' },
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            formLabel: { id: 'Bentuk Technical Assistance', en: 'Technical Assistance Forms' }
        },
        'pilot-project': {
            label: { id: 'Proyek Percontohan', en: 'Pilot Project' },
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            formLabel: { id: 'Bentuk Pilot Project', en: 'Pilot Project Forms' }
        },
        'research': {
            label: { id: 'Riset & Studi', en: 'Research & Study' },
            color: '#06b6d4',
            gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            formLabel: { id: 'Bentuk Penelitian/Studi', en: 'Research/Study Forms' }
        }
    };

    const BORDER_COLORS = [
        'var(--color-accent)',
        'var(--color-primary)',
        '#10b981',
        '#8b5cf6',
        '#0891b2',
        '#f59e0b',
        '#ec4899',
        '#16a34a'
    ];

    // State
    let allProjects = [];
    let filteredProjects = [];
    let uniqueYears = [];
    let uniqueDonors = [];

    // ===========================================
    // FILTER FUNCTIONS
    // ===========================================

    function getFilters() {
        return {
            year: document.getElementById('filter-year')?.value || '',
            sector: document.getElementById('filter-sector')?.value || '',
            donor: document.getElementById('filter-donor')?.value || '',
            activity: document.getElementById('filter-activity')?.value || ''
        };
    }

    function applyFilters() {
        const filters = getFilters();
        const lang = ProjectsService.getCurrentLang();

        let results = [...allProjects];

        // Filter by Year
        if (filters.year) {
            results = results.filter(p => {
                const startYear = p.periodStart ? new Date(p.periodStart).getFullYear() : null;
                return startYear === parseInt(filters.year);
            });
        }

        // Filter by Sector/Program
        if (filters.sector) {
            results = ProjectsService.filterByProgram(results, filters.sector);
        }

        // Filter by Donor
        if (filters.donor) {
            results = results.filter(p => {
                const donorText = ProjectsService.getText(p.donor, lang);
                return donorText === filters.donor;
            });
        }

        // Filter by Activity
        if (filters.activity) {
            results = ProjectsService.filterByActivity(results, filters.activity);
        }

        filteredProjects = results;

        // Update UI
        renderProjectCards(filteredProjects);
        updateFilterCount(filteredProjects.length);
    }

    function resetFilters() {
        document.getElementById('filter-year').value = '';
        document.getElementById('filter-sector').value = '';
        document.getElementById('filter-donor').value = '';
        document.getElementById('filter-activity').value = '';

        applyFilters();
    }

    function updateFilterCount(count) {
        const activeFiltersDiv = document.getElementById('active-filters');
        const filterCountSpan = document.getElementById('filter-count');

        if (activeFiltersDiv && filterCountSpan) {
            filterCountSpan.textContent = count;
            activeFiltersDiv.style.display = 'block';
        }
    }

    // ===========================================
    // POPULATE DYNAMIC FILTERS
    // ===========================================

    function populateYearFilter() {
        const select = document.getElementById('filter-year');
        if (!select) return;

        // Extract unique years from projects
        const years = new Set();
        allProjects.forEach(p => {
            if (p.periodStart) {
                years.add(new Date(p.periodStart).getFullYear());
            }
        });

        uniqueYears = Array.from(years).sort((a, b) => b - a); // Descending

        // Add options
        uniqueYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            select.appendChild(option);
        });
    }

    function populateDonorFilter() {
        const select = document.getElementById('filter-donor');
        if (!select) return;

        const lang = ProjectsService.getCurrentLang();

        // Extract unique donors
        const donors = new Set();
        allProjects.forEach(p => {
            if (p.donor) {
                const donorText = ProjectsService.getText(p.donor, lang);
                if (donorText) donors.add(donorText);
            }
        });

        uniqueDonors = Array.from(donors).sort();

        // Add options
        uniqueDonors.forEach(donor => {
            const option = document.createElement('option');
            option.value = donor;
            option.textContent = donor;
            select.appendChild(option);
        });
    }

    // ===========================================
    // RENDER FUNCTIONS
    // ===========================================

    function renderActivityDetails(activity) {
        if (!activity) return '';

        const lang = ProjectsService.getCurrentLang();
        const activityConfig = ACTIVITY_TYPES[activity.activityType];
        const formLabelText = activityConfig?.formLabel
            ? ProjectsService.getText(activityConfig.formLabel, lang)
            : (lang === 'en' ? 'Activity Forms' : 'Bentuk Aktivitas');

        // Use formsEn if language is English and English forms exist, otherwise use Indonesian forms
        let formsArray = activity.forms || [];
        if (lang === 'en' && activity.formsEn && Array.isArray(activity.formsEn) && activity.formsEn.length > 0) {
            formsArray = activity.formsEn;
        }

        const formsHtml = formsArray.length ? `
            <div>
                <p style="font-size: 0.7rem; text-transform: uppercase; color: var(--color-muted); margin-bottom: 0.25rem;">
                    ${formLabelText}
                </p>
                <ul style="font-size: 0.8rem; margin: 0; padding-left: 1rem;">
                    ${formsArray.map(f => `<li>${ProjectsService.escapeHtml(f)}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        const achievementsLabel = lang === 'en' ? 'Key Achievements' : 'Capaian Utama';
        const achievementsHtml = activity.achievements?.length ? `
            <div>
                <p style="font-size: 0.7rem; text-transform: uppercase; color: var(--color-muted); margin-bottom: 0.25rem;">
                    ${achievementsLabel}
                </p>
                <ul style="font-size: 0.8rem; margin: 0; padding-left: 1rem;">
                    ${activity.achievements.map(a => {
            // Use labelEn if language is English and it exists, otherwise use label
            let labelText = a.label || '';
            if (lang === 'en' && a.labelEn) {
                labelText = a.labelEn;
            }
            // Also include value if available
            const valueText = a.value ? ProjectsService.escapeHtml(a.value) + ' ' : '';
            return `<li>${valueText}${ProjectsService.escapeHtml(labelText)}</li>`;
        }).join('')}
                </ul>
            </div>
        ` : '';

        if (!formsHtml && !achievementsHtml) return '';

        return `
            <div class="project-activity-grid" style="background: #f8fafc; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                ${formsHtml}
                ${achievementsHtml}
            </div>
        `;
    }

    function renderProjectCard(project, index) {
        const lang = ProjectsService.getCurrentLang();

        // Get first activity for styling
        const firstActivity = project.activities?.[0];
        const activityType = firstActivity?.activityType || 'capacity-building';
        const config = ACTIVITY_TYPES[activityType] || ACTIVITY_TYPES['capacity-building'];
        const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

        const title = ProjectsService.escapeHtml(ProjectsService.getText(project.title, project.titleEn));
        const description = ProjectsService.escapeHtml(ProjectsService.getText(project.shortDescription, project.shortDescriptionEn));
        const donor = ProjectsService.escapeHtml(ProjectsService.getText(project.donor, project.donorEn));
        const statusLabel = ProjectsService.getStatusLabel(project.status, lang);
        const slug = project.slug || '';

        const startYear = project.periodStart ? new Date(project.periodStart).getFullYear() : '';
        const endYear = project.periodEnd ? new Date(project.periodEnd).getFullYear() : '';

        return `
            <a href="detail.html?slug=${slug}" class="project-card-link" style="text-decoration: none; display: block;">
                <div class="project-card" 
                     style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-left: 4px solid ${borderColor}; transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer;"
                     onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.12)';"
                     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)';">
                    <div style="display: grid; grid-template-columns: 100px 1fr; gap: 2rem; align-items: start;">
                        <div style="background: ${config.gradient}; color: white; padding: 1rem; border-radius: 12px; text-align: center;">
                            <div style="font-size: 1.5rem; font-weight: 800;">${startYear}</div>
                            ${endYear ? `<div style="font-size: 0.75rem; opacity: 0.8;">${endYear}</div>` : ''}
                        </div>
                        <div>
                            <h4 style="margin-bottom: 0.5rem; color: var(--color-primary);">${title}</h4>
                            <p style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: 1rem;">${description}</p>
                            
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                                <span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                                    ${donor}
                                </span>
                                ${project.status === 'ongoing' ? `
                                    <span style="background: #d1fae5; color: #047857; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                                        ${statusLabel}
                                    </span>
                                ` : ''}
                            </div>
                            
                            ${firstActivity ? renderActivityDetails(firstActivity) : ''}
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    function renderProjectCards(projects) {
        const container = document.getElementById('projects-container');
        if (!container) return;

        if (!projects.length) {
            const lang = ProjectsService.getCurrentLang();
            const emptyText = lang === 'en'
                ? 'No projects found matching your filters.'
                : 'Tidak ada proyek yang sesuai dengan filter Anda.';

            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-muted);">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                         stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                    </svg>
                    <p style="margin: 0;">${emptyText}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="project-cards-grid" style="display: grid; gap: 1.5rem;">
                ${projects.map((p, i) => renderProjectCard(p, i)).join('')}
            </div>
        `;
    }

    // ===========================================
    // FEATURED PROJECTS (Replacing Featured Factsheets)
    // ===========================================

    // Sanity configuration
    const SANITY_PROJECT_ID = '1zvl0z92';
    const SANITY_DATASET = 'production';
    const SANITY_API_VERSION = '2023-05-03';

    // Program labels for featured projects
    const FEATURED_PROGRAM_LABELS = {
        'energy': { id: 'Energi', en: 'Energy' },
        'environment': { id: 'Lingkungan', en: 'Environment' },
        'natural-resources': { id: 'Sumber Daya Alam', en: 'Natural Resources' },
        'gesi': { id: 'GEDSI', en: 'GEDSI' }
    };

    function getSanityUrl(query) {
        const baseUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
        const encodedQuery = encodeURIComponent(query);
        return `${baseUrl}?query=${encodedQuery}`;
    }

    async function loadFeaturedProjects() {
        const container = document.getElementById('featured-projects-container');
        if (!container) return;

        // Show loading state
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                <div class="portfolio-card portfolio-loading"><div class="portfolio-skeleton"></div></div>
                <div class="portfolio-card portfolio-loading"><div class="portfolio-skeleton"></div></div>
                <div class="portfolio-card portfolio-loading"><div class="portfolio-skeleton"></div></div>
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
            console.info('[PortfolioProjects] Fetching featured projects from Sanity...');
            const response = await fetch(url);
            const data = await response.json();

            if (data.result?.projects?.length > 0) {
                console.info('[PortfolioProjects] Loaded', data.result.projects.length, 'featured projects');
                renderFeaturedProjects(data.result.projects, container);
            } else {
                console.warn('[PortfolioProjects] No featured projects found');
                renderPlaceholderProjects(container);
            }
        } catch (error) {
            console.error('[PortfolioProjects] Error loading featured projects:', error);
            renderPlaceholderProjects(container);
        }
    }

    function renderFeaturedProjects(projects, container) {
        const lang = ProjectsService.getCurrentLang();

        const cardsHtml = projects.map(item => {
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

            const imageUrl = item.overrideImage || item.project?.bannerImage || '../images/placeholder-project.jpg';
            const slug = item.project?.slug || '';

            return `
                <a href="${slug ? `detail.html?slug=${slug}` : './'}" class="portfolio-card">
                    <div class="portfolio-image">
                        <img src="${imageUrl}" alt="${ProjectsService.escapeHtml(title)}" loading="lazy" onerror="this.src='../images/placeholder-project.jpg'">
                    </div>
                    <div class="portfolio-content">
                        <span class="portfolio-category">${ProjectsService.escapeHtml(category)}</span>
                        <h4 class="portfolio-title">${ProjectsService.escapeHtml(title)}</h4>
                        <p class="portfolio-description">${ProjectsService.escapeHtml(description)}</p>
                    </div>
                </a>
            `;
        }).join('');

        container.innerHTML = `
            <div class="portfolio-grid">
                ${cardsHtml}
            </div>
        `;

        addPortfolioStyles();
    }

    function renderPlaceholderProjects(container) {
        const lang = ProjectsService.getCurrentLang();

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

        const cardsHtml = placeholders.map(item => `
            <a href="./" class="portfolio-card">
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

        container.innerHTML = `
            <div class="portfolio-grid">
                ${cardsHtml}
            </div>
        `;

        addPortfolioStyles();
    }

    function addPortfolioStyles() {
        if (document.getElementById('portfolio-featured-styles')) return;

        const style = document.createElement('style');
        style.id = 'portfolio-featured-styles';
        style.textContent = `
            .portfolio-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
            }

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
                font-family: 'Inter', sans-serif;
                font-size: 0.75rem;
                font-weight: 700;
                color: var(--color-accent);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 0.5rem;
            }

            .portfolio-title {
                color: var(--color-primary);
                font-family: 'Inter', sans-serif;
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
                font-family: 'Inter', sans-serif;
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

    // ===========================================
    // URL PARAMETER HANDLING
    // ===========================================

    function getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function applyFiltersFromURL() {
        // Check for sector parameter
        const sectorParam = getURLParameter('sector');
        if (sectorParam) {
            const sectorSelect = document.getElementById('filter-sector');
            if (sectorSelect) {
                // Map various parameter formats to option values
                const sectorMap = {
                    'energy': 'energy',
                    'energi': 'energy',
                    'environment': 'environment',
                    'lingkungan': 'environment',
                    'natural-resources': 'natural-resources',
                    'sda': 'natural-resources',
                    'gesi': 'gesi',
                    'gedsi': 'gesi'
                };

                const mappedSector = sectorMap[sectorParam.toLowerCase()] || sectorParam;
                sectorSelect.value = mappedSector;
            }
        }

        // Check for year parameter
        const yearParam = getURLParameter('year');
        if (yearParam) {
            const yearSelect = document.getElementById('filter-year');
            if (yearSelect) {
                yearSelect.value = yearParam;
            }
        }

        // Check for activity parameter
        const activityParam = getURLParameter('activity');
        if (activityParam) {
            const activitySelect = document.getElementById('filter-activity');
            if (activitySelect) {
                activitySelect.value = activityParam;
            }
        }
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================

    async function init() {
        console.info('[PortfolioProjects] Initializing...');

        try {
            // Fetch all projects
            allProjects = await ProjectsService.fetchAll();
            console.info(`[PortfolioProjects] Loaded ${allProjects.length} projects`);

            // Populate dynamic filters
            populateYearFilter();
            populateDonorFilter();

            // Apply filters from URL parameters BEFORE rendering
            applyFiltersFromURL();

            // Render featured projects
            loadFeaturedProjects();

            // Apply filters (which will use any URL params)
            applyFilters();

            // Setup filter event listeners
            document.getElementById('filter-year')?.addEventListener('change', applyFilters);
            document.getElementById('filter-sector')?.addEventListener('change', applyFilters);
            document.getElementById('filter-donor')?.addEventListener('change', applyFilters);
            document.getElementById('filter-activity')?.addEventListener('change', applyFilters);
            document.getElementById('reset-filters')?.addEventListener('click', resetFilters);

            console.info('[PortfolioProjects] Initialized successfully');

        } catch (error) {
            console.error('[PortfolioProjects] Error initializing:', error);

            const container = document.getElementById('projects-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #dc2626;">
                        <p>Gagal memuat data proyek. Silakan refresh halaman.</p>
                    </div>
                `;
            }
        }
    }

    // Listen for language changes
    document.addEventListener('languageChanged', function () {
        console.info('[PortfolioProjects] Language changed, re-rendering...');

        // Re-populate donor filter with new language
        const donorSelect = document.getElementById('filter-donor');
        if (donorSelect) {
            // Clear existing options except first
            while (donorSelect.options.length > 1) {
                donorSelect.remove(1);
            }
            populateDonorFilter();
        }

        // Re-render
        loadFeaturedProjects();
        renderProjectCards(filteredProjects);
    });

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for debugging
    window.PortfolioProjects = {
        init,
        applyFilters,
        resetFilters,
        getProjects: () => allProjects,
        getFiltered: () => filteredProjects
    };

})();
