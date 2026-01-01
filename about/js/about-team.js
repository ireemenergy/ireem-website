/**
 * About Page - Team Members Renderer
 * Fetches team structure from Sanity teamPage document
 * Supports bilingual content (Indonesian/English)
 * 
 * @file about-team.js
 * @version 4.0 - Bilingual Support
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

    // Fetch team page with all sections
    const TEAM_PAGE_QUERY = `*[_type == "teamPage"][0]{
        pageTitle,
        executiveBoard[]-> {
            name,
            "slug": slug.current,
            positionTitle,
            photo { asset->{ url } }
        },
        programmeCoordinators[]-> {
            name,
            "slug": slug.current,
            positionTitle,
            photo { asset->{ url } }
        },
        staff[]-> {
            name,
            "slug": slug.current,
            positionTitle,
            photo { asset->{ url } }
        }
    }`;

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
                console.info('[AboutTeam] Language changed, re-rendering...');
                if (teamPageData) {
                    renderTeamPage(teamPageData);
                }
            });
        } catch (error) {
            console.error('[AboutTeam] Error:', error);
            showError();
        }
    });

    /**
     * Fetch team page from Sanity
     */
    async function fetchTeamPage() {
        console.info('[AboutTeam] Fetching team page...');

        const url = getSanityUrl(TEAM_PAGE_QUERY);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.result) {
            throw new Error('Team page not found');
        }

        console.info('[AboutTeam] Loaded team page:', data.result.pageTitle);
        return data.result;
    }

    /**
     * Render team page sections
     */
    function renderTeamPage(teamPage) {
        const lang = getCurrentLanguage();
        console.info('[AboutTeam] Rendering with language:', lang);

        // Render Executive Board
        const execContainer = document.getElementById('executive-board-grid');
        if (execContainer && teamPage.executiveBoard) {
            renderSection(execContainer, teamPage.executiveBoard, lang);
        }

        // Render Programme Coordinators
        const coordContainer = document.getElementById('coordinators-grid');
        if (coordContainer && teamPage.programmeCoordinators) {
            renderSection(coordContainer, teamPage.programmeCoordinators, lang);
        }

        // Render Staff
        const staffContainer = document.getElementById('staff-grid');
        if (staffContainer && teamPage.staff) {
            renderSection(staffContainer, teamPage.staff, lang);
        }
    }

    /**
     * Render a section of team members
     */
    function renderSection(container, members, lang) {
        if (!container) return;

        if (!members || members.length === 0) {
            const noDataText = lang === 'en' ? 'No data available' : 'Tidak ada data';
            container.innerHTML = `<p class="text-center" style="grid-column: 1/-1; color: var(--color-muted);">${noDataText}</p>`;
            return;
        }

        container.innerHTML = '';
        members.forEach(member => {
            if (member) {
                container.appendChild(createMemberCard(member, lang));
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
        // Use getText for bilingual positionTitle
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
     * Show error message
     */
    function showError() {
        const lang = getCurrentLanguage();
        const containers = [
            document.getElementById('executive-board-grid'),
            document.getElementById('coordinators-grid'),
            document.getElementById('staff-grid')
        ];

        const errorText = lang === 'en' ? 'Failed to load team data' : 'Gagal memuat data tim';
        const errorMsg = `<p class="text-center" style="grid-column: 1/-1; color: var(--color-danger);">${errorText}</p>`;

        containers.forEach(container => {
            if (container) container.innerHTML = errorMsg;
        });
    }

    /**
     * Escape HTML
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }
})();
