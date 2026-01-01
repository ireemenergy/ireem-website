/**
 * IREEM Program Projects Renderer - TABLE Mode
 * 
 * Renders projects in table format for Program pages
 * Uses ProjectsService for data fetching and filtering
 * 
 * @file program-projects.js
 * @version 1.0
 */

(function () {
    'use strict';

    // ===========================================
    // CONFIGURATION
    // ===========================================

    // Program slug mapping based on page
    const PROGRAM_SLUGS = {
        'energi.html': 'energy',
        'lingkungan.html': 'environment',
        'sumber-daya.html': 'natural-resources',
        'gesi.html': 'gesi'
    };

    // NOTE: init() function has been moved to the RUN ON DOM READY section
    // with caching support for language change re-renders

    // ===========================================
    // TABLE RENDERER
    // ===========================================

    function renderTable(projects) {
        const lang = ProjectsService.getCurrentLang();

        const rows = projects.map((project, index) => {
            // Use bilingual getText for fields that may be { id, en } objects
            const title = ProjectsService.escapeHtml(ProjectsService.getText(project.title, lang));
            const donor = ProjectsService.escapeHtml(ProjectsService.getText(project.donor, lang));
            const period = ProjectsService.formatPeriod(project.periodStart, project.periodEnd);
            const description = ProjectsService.escapeHtml(ProjectsService.getText(project.shortDescription, lang));
            const bgColor = index % 2 === 0 ? '#f8fafc' : 'white';

            return `
                <tr style="background: ${bgColor}; border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 1rem; font-weight: 600; color: var(--color-primary);">
                        ${title}
                    </td>
                    <td style="padding: 1rem;">
                        ${donor}
                    </td>
                    <td style="padding: 1rem; text-align: center; white-space: nowrap; min-width: 120px;">
                        ${period}
                    </td>
                    <td style="padding: 1rem;">
                        ${description}
                    </td>
                </tr>
            `;
        }).join('');

        // Bilingual table headers
        const headers = {
            projectTitle: lang === 'en' ? 'Project Title' : 'Judul Proyek',
            donor: lang === 'en' ? 'Donor / Partner' : 'Donor / Mitra',
            period: lang === 'en' ? 'Period' : 'Periode',
            description: lang === 'en' ? 'Description' : 'Deskripsi'
        };

        return `
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                    <thead>
                        <tr style="background: var(--color-primary); color: white;">
                            <th style="padding: 1rem; text-align: left; font-weight: 600;">${headers.projectTitle}</th>
                            <th style="padding: 1rem; text-align: left; font-weight: 600;">${headers.donor}</th>
                            <th style="padding: 1rem; text-align: center; font-weight: 600; min-width: 120px;">${headers.period}</th>
                            <th style="padding: 1rem; text-align: left; font-weight: 600;">${headers.description}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }

    // ===========================================
    // STATE RENDERERS
    // ===========================================

    function createLoadingState() {
        const lang = ProjectsService.getCurrentLang();
        const loadingText = lang === 'en' ? 'Loading projects...' : 'Memuat proyek...';

        return `
            <div style="text-align: center; padding: 3rem; color: var(--color-muted);">
                <svg width="40" height="40" viewBox="0 0 40 40" style="animation: spin 1s linear infinite; margin-bottom: 1rem;">
                    <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="80" stroke-linecap="round"/>
                </svg>
                <p>${loadingText}</p>
                <style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>
            </div>
        `;
    }

    function createEmptyState() {
        const lang = ProjectsService.getCurrentLang();
        const emptyText = lang === 'en' ? 'No projects available for this program yet.' : 'Belum ada proyek untuk program ini.';

        return `
            <div style="text-align: center; padding: 3rem; color: var(--color-muted);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
                    <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"/>
                </svg>
                <p>${emptyText}</p>
            </div>
        `;
    }

    function createErrorState() {
        const lang = ProjectsService.getCurrentLang();
        const errorText = lang === 'en' ? 'Failed to load project data.' : 'Gagal memuat data proyek.';
        const retryText = lang === 'en' ? 'Try Again' : 'Coba Lagi';

        return `
            <div style="text-align: center; padding: 3rem; color: #dc2626;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem;">
                    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
                <p>${errorText}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--color-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                    ${retryText}
                </button>
            </div>
        `;
    }

    // ===========================================
    // RUN ON DOM READY
    // ===========================================

    // Store current program slug for re-render
    let currentProgramSlug = null;
    let cachedProjects = null;

    async function init() {
        const container = document.getElementById('projects-container');

        if (!container) {
            console.warn('[ProgramProjects] No #projects-container found');
            return;
        }

        // Detect current program from page filename
        const currentPage = window.location.pathname.split('/').pop() || 'energi.html';
        currentProgramSlug = container.dataset.program || PROGRAM_SLUGS[currentPage];

        if (!currentProgramSlug) {
            console.error('[ProgramProjects] No program slug detected');
            container.innerHTML = createErrorState();
            return;
        }

        console.info(`[ProgramProjects] Loading projects for program: ${currentProgramSlug}`);

        // Show loading state
        container.innerHTML = createLoadingState();

        try {
            // Fetch and filter projects
            const allProjects = await ProjectsService.fetchAll();
            cachedProjects = ProjectsService.filterByProgram(allProjects, currentProgramSlug);

            console.info(`[ProgramProjects] Found ${cachedProjects.length} projects`);

            // Render
            if (cachedProjects.length === 0) {
                container.innerHTML = createEmptyState();
            } else {
                container.innerHTML = renderTable(cachedProjects);
            }

        } catch (error) {
            console.error('[ProgramProjects] Error:', error);
            container.innerHTML = createErrorState();
        }
    }

    /**
     * Re-render projects with current language (no re-fetch needed)
     */
    function reRenderProjects() {
        const container = document.getElementById('projects-container');
        if (!container || !cachedProjects) return;

        console.info('[ProgramProjects] Re-rendering for language change');

        if (cachedProjects.length === 0) {
            container.innerHTML = createEmptyState();
        } else {
            container.innerHTML = renderTable(cachedProjects);
        }
    }

    // Listen for language changes
    document.addEventListener('languageChanged', function (e) {
        console.info('[ProgramProjects] Language changed to:', e.detail?.lang || 'unknown');
        reRenderProjects();
    });

    // Alternative: Listen on localStorage change for language (for cross-tab sync)
    window.addEventListener('storage', function (e) {
        if (e.key === 'ireem-lang') {
            console.info('[ProgramProjects] Language storage changed to:', e.newValue);
            reRenderProjects();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose reRender for manual trigger if needed
    window.ProgramProjects = {
        reRender: reRenderProjects
    };

})();
