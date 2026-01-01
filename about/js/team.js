/**
 * Team Page Data Renderer - Sanity CMS Integration
 * Fetches team members from Sanity CMS
 * Supports bilingual content (Indonesian/English)
 * 
 * @file team.js
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

    function getSanityUrl(query) {
        const baseUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`;
        const encodedQuery = encodeURIComponent(query);
        return `${baseUrl}?query=${encodedQuery}`;
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

    function getText(field, lang) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object') {
            return field[lang] || field.id || field.en || '';
        }
        return '';
    }

    function getArray(field, lang) {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'object') {
            return field[lang] || field.id || field.en || [];
        }
        return [];
    }

    // Fetch team page with all referenced members (curated list)
    const TEAM_PAGE_QUERY = `*[_type == "teamPage"][0]{
        executiveBoard[]->{
            name,
            "slug": slug.current,
            role,
            positionTitle,
            photo { asset->{ url } },
            shortBio,
            active
        },
        programmeCoordinators[]->{
            name,
            "slug": slug.current,
            role,
            positionTitle,
            photo { asset->{ url } },
            shortBio,
            active
        },
        staff[]->{
            name,
            "slug": slug.current,
            role,
            positionTitle,
            photo { asset->{ url } },
            shortBio,
            active
        }
    }`;

    // ===========================================
    // DOM ELEMENTS
    // ===========================================
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const contentWrapper = document.getElementById('content-wrapper');

    // Store data for re-rendering
    let teamPageData = null;

    // ===========================================
    // MAIN EXECUTION
    // ===========================================
    document.addEventListener('DOMContentLoaded', async function () {
        try {
            const teamPage = await fetchTeamPage();
            teamPageData = teamPage;
            renderTeamPage(teamPage);

            // Listen for language changes
            document.addEventListener('languageChange', () => {
                console.info('[Team] Language changed, re-rendering...');
                if (teamPageData) {
                    renderTeamPage(teamPageData);
                }
            });
        } catch (error) {
            console.error('[Team] Error loading team data:', error);
            showError();
        }
    });

    /**
     * Fetch team page from Sanity (with referenced members)
     */
    async function fetchTeamPage() {
        console.info('[Team] Fetching team page from Sanity...');

        const url = getSanityUrl(TEAM_PAGE_QUERY);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.result) {
            throw new Error('Team page not found');
        }

        console.info(`[Team] Loaded team page`);
        return data.result;
    }

    /**
     * Render team page with bilingual support
     */
    function renderTeamPage(teamPage) {
        const lang = getCurrentLanguage();
        console.info('[Team] Rendering with language:', lang);

        loadingState.style.display = 'none';
        contentWrapper.style.display = 'block';

        // Update page title based on language
        document.title = lang === 'en' ? 'Team & Expert Network - IREEM' : 'Tim & Jejaring Ahli - IREEM';

        // Render Team Members by Sections
        renderSection('executive-board-grid', teamPage.executiveBoard, lang);
        renderSection('coordinators-grid', teamPage.programmeCoordinators, lang);
        renderSection('staff-grid', teamPage.staff, lang);

        // Render Expert Pool
        renderExpertPool(lang);

        // Render CTA
        renderCTA(lang);
    }

    /**
     * Render a section of team members
     */
    function renderSection(gridId, members, lang) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        grid.innerHTML = '';

        if (!members || members.length === 0) {
            const noDataText = lang === 'en' ? 'No data available' : 'Tidak ada data';
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--color-muted);">${noDataText}</p>`;
            return;
        }

        members.forEach(member => {
            if (member && member.slug) {
                const card = createMemberCard(member, lang);
                grid.appendChild(card);
            }
        });
    }

    /**
     * Create member card element with bilingual support
     */
    function createMemberCard(member, lang) {
        const link = document.createElement('a');
        link.href = `team-detail.html?slug=${member.slug}`;
        link.style.cssText = `
            display: block;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            border: 1px solid #f0f0f0;
        `;

        const photoUrl = member.photo?.asset?.url || '../images/placeholder-person.jpg';
        // Bilingual position title
        const jobTitle = getText(member.positionTitle, lang);

        link.innerHTML = `
            <div style="
                position: relative; 
                height: 320px; 
                overflow: hidden; 
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                padding: 1rem;
                margin: 1rem;
                border-radius: 12px;
            ">
                <img src="${escapeHtml(photoUrl)}" 
                     alt="${escapeHtml(member.name)}"
                     style="
                         width: 100%; 
                         height: 100%; 
                         object-fit: contain;
                         object-position: center bottom;
                     ">
            </div>
            <div style="padding: 1.75rem 1.5rem; text-align: center;">
                <h3 style="
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: #1e293b;
                    line-height: 1.4;
                    margin: 0 0 0.5rem 0;
                ">${escapeHtml(member.name)}</h3>
                <p style="
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #0e3a5d;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    margin: 0;
                    opacity: 0.8;
                ">${escapeHtml(jobTitle)}</p>
            </div>
        `;

        // Hover effect
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-6px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1), 0 12px 28px rgba(0,0,0,0.08)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)';
        });

        return link;
    }

    /**
     * Render expert pool section with bilingual support
     */
    function renderExpertPool(lang) {
        const expertGrid = document.getElementById('expert-pool-grid');
        if (!expertGrid) return;

        const experts = lang === 'en' ? [
            { count: '50+', name: 'Energy Experts', description: 'Renewable energy and energy efficiency specialists' },
            { count: '30+', name: 'Environment Experts', description: 'Environmental and natural resource management experts' },
            { count: '20+', name: 'Policy Experts', description: 'Public policy and regulation consultants' }
        ] : [
            { count: '50+', name: 'Ahli Energi', description: 'Spesialis energi terbarukan dan efisiensi energi' },
            { count: '30+', name: 'Ahli Lingkungan', description: 'Pakar pengelolaan lingkungan dan sumber daya alam' },
            { count: '20+', name: 'Ahli Kebijakan', description: 'Konsultan kebijakan publik dan regulasi' }
        ];

        expertGrid.innerHTML = '';
        experts.forEach(expert => {
            const card = document.createElement('div');
            card.className = 'expert-card';
            card.innerHTML = `
                <div class="count">${escapeHtml(expert.count)}</div>
                <h4>${escapeHtml(expert.name)}</h4>
                <p>${escapeHtml(expert.description)}</p>
            `;
            expertGrid.appendChild(card);
        });
    }

    /**
     * Render CTA section (handled by i18n system via data-i18n attributes)
     */
    function renderCTA(lang) {
        // CTA text is now handled by i18n system
    }

    /**
     * Show error state
     */
    function showError() {
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }
})();
