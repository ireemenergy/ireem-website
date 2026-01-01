/**
 * IREEM Impact Projects Renderer
 * 
 * Renders projects by activity type (Capacity Building, Policy, Pilot) 
 * on the Impact page using nested activities structure from Sanity.
 * 
 * @file impact-projects.js
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

    // Map UI button to activityType in Sanity
    const TAB_ACTIVITY_MAP = {
        'capacity-building': 'capacity-building',
        'policy-regulation': 'policy-advisory',
        'policy-advisory': 'policy-advisory',
        'pilot-project': 'technical-assistance'  // pilot-project tab shows technical-assistance
    };

    // Border colors for variety
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

    // ===========================================
    // RENDER FUNCTIONS
    // ===========================================

    /**
     * Render activity details (forms & achievements) - bilingual
     */
    function renderActivityDetails(activity) {
        if (!activity) return '';

        const lang = ProjectsService.getCurrentLang();
        const activityConfig = ACTIVITY_TYPES[activity.activityType];
        const formLabelText = activityConfig?.formLabel
            ? ProjectsService.getText(activityConfig.formLabel, lang)
            : (lang === 'en' ? 'Activity Forms' : 'Bentuk Aktivitas');

        // Get forms array (may be { id: [], en: [] })
        const formsArray = ProjectsService.getArray(activity.forms, lang);

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
            const label = ProjectsService.getText(a.label, lang);
            return `<li>${ProjectsService.escapeHtml(a.value)} ${ProjectsService.escapeHtml(label)}</li>`;
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

    /**
     * Render a single project card - bilingual
     */
    function renderProjectCard(project, activityType, index) {
        const lang = ProjectsService.getCurrentLang();
        const matchedActivity = ProjectsService.getActivityData(project, activityType);
        const config = ACTIVITY_TYPES[activityType] || ACTIVITY_TYPES['capacity-building'];
        const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

        // Use getText for bilingual fields
        const title = ProjectsService.escapeHtml(ProjectsService.getText(project.title, lang));
        const description = ProjectsService.escapeHtml(ProjectsService.getText(project.shortDescription, lang));
        const donor = ProjectsService.escapeHtml(ProjectsService.getText(project.donor, lang));
        const statusLabel = ProjectsService.getStatusLabel(project.status, lang);

        // Parse period
        const startYear = project.periodStart ? new Date(project.periodStart).getFullYear() : '';
        const endYear = project.periodEnd ? new Date(project.periodEnd).getFullYear() : '';

        return `
            <div class="project-card" 
                 style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-left: 4px solid ${borderColor}; transition: transform 0.3s ease, box-shadow 0.3s ease;">
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
                        
                        ${renderActivityDetails(matchedActivity)}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render projects grid for a specific activity type
     */
    function renderProjectsGrid(projects, activityType) {
        if (!projects.length) {
            return createEmptyState(activityType);
        }

        return `
            <div class="project-cards-grid" style="display: grid; gap: 1.5rem;">
                ${projects.map((p, i) => renderProjectCard(p, activityType, i)).join('')}
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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                     stroke-width="2" style="animation: spin 1s linear infinite; margin-bottom: 1rem;">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/>
                </svg>
                <p style="margin: 0;">${loadingText}</p>
                <style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>
            </div>
        `;
    }

    function createEmptyState(activityType) {
        const lang = ProjectsService.getCurrentLang();
        const activityConfig = ACTIVITY_TYPES[activityType];
        const label = activityConfig?.label
            ? ProjectsService.getText(activityConfig.label, lang)
            : (lang === 'en' ? 'this activity' : 'aktivitas ini');
        const emptyText = lang === 'en'
            ? `No projects available for ${label} yet.`
            : `Belum ada proyek untuk ${label}.`;
        return `
            <div style="text-align: center; padding: 3rem; color: var(--color-muted);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                     stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                </svg>
                <p style="margin: 0;">${emptyText}</p>
            </div>
        `;
    }

    function createErrorState() {
        const lang = ProjectsService.getCurrentLang();
        const errorText = lang === 'en' ? 'Failed to load project data.' : 'Gagal memuat data proyek.';
        const retryText = lang === 'en' ? 'Try Again' : 'Coba Lagi';
        return `
            <div style="text-align: center; padding: 3rem; color: #dc2626;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                     stroke-width="1.5" style="margin-bottom: 1rem;">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4m0 4h.01"/>
                </svg>
                <p style="margin: 0 0 1rem 0;">${errorText}</p>
                <button onclick="ImpactProjectsRenderer.loadTab(ImpactProjectsRenderer.currentTab)" 
                        style="padding: 0.5rem 1rem; background: var(--color-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                    ${retryText}
                </button>
            </div>
        `;
    }

    // ===========================================
    // TAB MANAGEMENT
    // ===========================================

    let currentTab = 'capacity-building';

    /**
     * Load and render projects for a specific tab
     */
    async function loadTab(tabId) {
        const container = document.getElementById(tabId);
        if (!container) {
            console.warn(`[ImpactProjects] Container #${tabId} not found`);
            return;
        }

        currentTab = tabId;

        // Map tab ID to actual activity type in Sanity
        const activityType = TAB_ACTIVITY_MAP[tabId] || tabId;

        // Show loading
        container.innerHTML = createLoadingState();

        try {
            const allProjects = await ProjectsService.fetchAll();
            const filteredProjects = ProjectsService.filterByActivity(allProjects, activityType);

            console.info(`[ImpactProjects] Tab "${tabId}" → Activity "${activityType}" → ${filteredProjects.length} projects`);

            container.innerHTML = renderProjectsGrid(filteredProjects, activityType);

        } catch (error) {
            console.error('[ImpactProjects] Error:', error);
            container.innerHTML = createErrorState();
        }
    }

    /**
     * Initialize all tabs on page load
     */
    async function init() {
        console.info('[ImpactProjects] Initializing...');

        // Load the default active tab first
        await loadTab('capacity-building');

        // Setup tab click handlers
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();

                // Get tab ID from onclick attribute or data
                const onClickAttr = this.getAttribute('onclick');
                const match = onClickAttr?.match(/openTab\(event,\s*'([^']+)'\)/);
                const tabId = match ? match[1] : null;

                if (tabId) {
                    loadTab(tabId);
                }
            });
        });

        console.info('[ImpactProjects] Initialized');
    }

    // ===========================================
    // UPDATE EXISTING openTab FUNCTION
    // ===========================================

    // Store original openTab if exists
    const originalOpenTab = window.openTab;

    window.openTab = function (evt, tabId) {
        // Call original for UI state (tab switching)
        if (typeof originalOpenTab === 'function') {
            originalOpenTab(evt, tabId);
        } else {
            // Default tab switching logic
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'none';
            });
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.style.background = 'white';
                btn.style.color = 'var(--color-primary)';
                btn.style.border = '2px solid var(--color-primary)';
            });

            const activeTab = document.getElementById(tabId);
            if (activeTab) {
                activeTab.style.display = 'block';
            }

            if (evt?.currentTarget) {
                evt.currentTarget.style.background = 'var(--color-primary)';
                evt.currentTarget.style.color = 'white';
                evt.currentTarget.style.border = 'none';
            }
        }

        // Load dynamic content
        loadTab(tabId);
    };

    // ===========================================
    // EXPORT & AUTO-INIT
    // ===========================================

    window.ImpactProjectsRenderer = {
        init,
        loadTab,
        currentTab: currentTab
    };

    // Listen for language changes to re-render
    document.addEventListener('languageChanged', function (e) {
        console.info('[ImpactProjects] Language changed, re-rendering current tab:', currentTab);
        loadTab(currentTab);
    });

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
