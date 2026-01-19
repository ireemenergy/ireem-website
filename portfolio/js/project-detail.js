/**
 * IREEM Project Detail - Sanity CMS Integration
 * 
 * Fetches project content from Sanity headless CMS
 * Usage: detail.html?slug=project-slug
 * 
 * Updated with full Portable Text rendering (images, quotes, lists, etc)
 * 
 * @author IREEM Development Team
 * @version 2.1 - Full Portable Text Support
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

    // Build Sanity API URL
    function getSanityUrl(query, params = {}) {
        const baseUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`;
        const encodedQuery = encodeURIComponent(query);
        let paramsString = '';
        for (const [key, value] of Object.entries(params)) {
            paramsString += `&$${key}="${encodeURIComponent(value)}"`;
        }
        return `${baseUrl}?query=${encodedQuery}${paramsString}`;
    }

    // Build Sanity image CDN URL from asset reference
    function sanityImageUrl(ref) {
        if (!ref) return '';
        const parts = ref.replace('image-', '').split('-');
        if (parts.length < 2) return '';
        const id = parts[0];
        const dimensions = parts.length > 2 ? parts.slice(1, -1).join('-') : '';
        const format = parts[parts.length - 1];
        if (dimensions) {
            return `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}-${dimensions}.${format}`;
        }
        return `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}.${format}`;
    }

    // ===========================================
    // LANGUAGE SUPPORT (Bilingual)
    // ===========================================

    function getCurrentLanguage() {
        return window.IREEM_i18n?.currentLanguage || localStorage.getItem('ireem_lang') || 'id';
    }

    function getText(idText, enText) {
        const lang = getCurrentLanguage();
        if (lang === 'en' && enText) return enText;
        return idText || enText || '';
    }

    // ===========================================
    // LABELS
    // ===========================================
    const STATUS_LABELS = {
        id: { planned: 'Mendatang', ongoing: 'Berlangsung', completed: 'Selesai' },
        en: { planned: 'Planned', ongoing: 'Ongoing', completed: 'Completed' }
    };

    const PROGRAM_LABELS = {
        id: { 'energy': 'Energi', 'environment': 'Lingkungan', 'natural-resources': 'Sumber Daya Alam', 'gesi': 'GEDSI' },
        en: { 'energy': 'Energy', 'environment': 'Environment', 'natural-resources': 'Natural Resources', 'gesi': 'GEDSI' }
    };

    // Color palette for program tags
    const PROGRAM_COLORS = {
        'energy': { bg: '#fef3c7', text: '#92400e' },
        'environment': { bg: '#d1fae5', text: '#065f46' },
        'natural-resources': { bg: '#dbeafe', text: '#1e40af' },
        'gesi': { bg: '#fce7f3', text: '#9d174d' }
    };

    // ===========================================
    // DOM ELEMENTS
    // ===========================================
    const loadingEl = document.getElementById('project-loading');
    const errorEl = document.getElementById('project-error');
    const containerEl = document.getElementById('project-container');

    // ===========================================
    // PORTABLE TEXT RENDERER
    // ===========================================

    let currentMarkDefs = [];

    function renderPortableText(blocks, lang = 'id') {
        if (!blocks || !Array.isArray(blocks)) return '';

        let html = '';
        let inList = false;
        let listType = '';

        blocks.forEach((block) => {
            if (block.markDefs) currentMarkDefs = block.markDefs;

            switch (block._type) {
                case 'block':
                    if (block.listItem) {
                        const newListType = block.listItem === 'number' ? 'ol' : 'ul';
                        if (!inList || listType !== newListType) {
                            if (inList) html += `</${listType}>`;
                            listType = newListType;
                            html += `<${listType}>`;
                            inList = true;
                        }
                        html += renderBlock(block);
                    } else {
                        if (inList) {
                            html += `</${listType}>`;
                            inList = false;
                        }
                        html += renderBlock(block);
                    }
                    break;
                case 'image':
                    if (inList) { html += `</${listType}>`; inList = false; }
                    html += renderImage(block, lang);
                    break;
                case 'quoteBlock':
                    if (inList) { html += `</${listType}>`; inList = false; }
                    html += renderQuoteBlock(block, lang);
                    break;
                case 'youtubeEmbed':
                    if (inList) { html += `</${listType}>`; inList = false; }
                    html += renderYouTubeEmbed(block);
                    break;
            }
        });

        if (inList) html += `</${listType}>`;
        return html;
    }

    function renderBlock(block) {
        const style = block.style || 'normal';
        const children = renderChildren(block.children || [], block.markDefs || []);

        if (block.listItem) return `<li>${children}</li>`;

        switch (style) {
            case 'h2': return `<h2>${children}</h2>`;
            case 'h3': return `<h3>${children}</h3>`;
            case 'h4': return `<h4>${children}</h4>`;
            case 'blockquote':
                return `<blockquote class="project-quote"><p>${children}</p></blockquote>`;
            default:
                return children ? `<p>${children}</p>` : '';
        }
    }

    function renderChildren(children, markDefs = []) {
        return children.map(child => {
            if (child._type !== 'span') return child.text || '';

            let text = escapeHtml(child.text || '');
            if (!text) return '';

            (child.marks || []).forEach(markKey => {
                switch (markKey) {
                    case 'strong': text = `<strong>${text}</strong>`; break;
                    case 'em': text = `<em>${text}</em>`; break;
                    case 'underline': text = `<u>${text}</u>`; break;
                    default:
                        // Check for link annotation
                        const linkDef = markDefs.find(d => d._key === markKey && d._type === 'link');
                        if (linkDef) {
                            text = `<a href="${linkDef.href || '#'}" target="_blank" rel="noopener">${text}</a>`;
                        }
                }
            });
            return text;
        }).join('');
    }

    function renderImage(block, lang) {
        let url = block.asset?.url || '';
        if (!url && block.asset?._ref) url = sanityImageUrl(block.asset._ref);
        if (!url) return '';

        const alt = escapeHtml(getText(block.alt, block.altEn) || '');
        const caption = getText(block.caption?.id, block.caption?.en) || getText(block.caption, '') || '';

        return `
            <figure class="project-content-image">
                <img src="${url}" alt="${alt}" loading="lazy">
                ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
            </figure>
        `;
    }

    function renderQuoteBlock(block, lang) {
        // Handle both bilingual object {id, en} and direct string formats
        let quoteText = '';
        if (typeof block.text === 'object' && block.text !== null) {
            quoteText = getText(block.text?.id, block.text?.en);
        } else {
            quoteText = block.text || block.quote || '';
        }

        let citeText = '';
        if (typeof block.cite === 'object' && block.cite !== null) {
            citeText = getText(block.cite?.id, block.cite?.en);
        } else {
            citeText = block.cite || block.source || '';
        }

        return `
            <blockquote class="project-quote">
                ${quoteText ? `<p><em>"${escapeHtml(quoteText)}"</em></p>` : ''}
                ${citeText ? `<cite>— ${escapeHtml(citeText)}</cite>` : ''}
            </blockquote>
        `;
    }

    function renderYouTubeEmbed(block) {
        const url = block.url || '';
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        const videoId = match ? match[1] : '';
        if (!videoId) return '';

        return `
            <div class="video-embed">
                <div class="video-embed__wrapper">
                    <iframe src="https://www.youtube.com/embed/${videoId}" 
                            title="YouTube video" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen></iframe>
                </div>
            </div>
        `;
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================

    async function init() {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        if (!slug) { showError(); return; }
        await loadProject(slug);
    }

    // ===========================================
    // DATA FETCHING
    // ===========================================

    async function loadProject(projectSlug) {
        const query = `*[_type == "project" && slug.current == $slug][0] {
            _id,
            "title": title.id,
            "titleEn": title.en,
            "slug": slug.current,
            "projectName": projectName.id,
            "projectNameEn": projectName.en,
            "shortDescription": shortDescription.id,
            "shortDescriptionEn": shortDescription.en,
            fullDescription,
            "donor": donor.id,
            "donorEn": donor.en,
            status,
            periodStart,
            periodEnd,
            programs,
            provinces,
            "bannerImage": bannerImage.asset->url,
            "bannerImageAlt": bannerImage.alt,
            "bannerCaption": bannerImage.caption.id,
            "bannerCaptionEn": bannerImage.caption.en,
            activities[] {
                activityType,
                "forms": forms.id,
                "formsEn": forms.en,
                achievements[] {
                    "label": label.id,
                    "labelEn": label.en
                }
            },
            "relatedProjects": relatedProjects[]->{
                _id,
                "title": title.id,
                "slug": slug.current,
                "thumbnail": coalesce(bannerImage.asset->url, coverImage.asset->url)
            },
            "relatedNews": relatedNews[]->{
                _id,
                "title": title.id,
                "slug": slug.current,
                "thumbnail": coverImage.asset->url
            },
            "relatedFactsheets": relatedFactsheets[]->{
                _id,
                "title": title.id,
                "slug": slug.current,
                "thumbnail": coalesce(coverImage.asset->url, thumbnail.asset->url)
            },
            "relatedPublications": relatedPublications[]->{
                _id,
                "title": title.id,
                "slug": slug.current,
                "thumbnail": coalesce(bannerImage.asset->url, coverImage.asset->url)
            }
        }`;

        try {
            const url = getSanityUrl(query, { slug: projectSlug });
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (data.result) {
                renderProject(data.result);
            } else {
                showError();
            }
        } catch (error) {
            console.error('[Project Detail] Error:', error);
            showError();
        }
    }

    // ===========================================
    // RENDERING
    // ===========================================

    function renderProject(project) {
        const lang = getCurrentLanguage();
        const title = getText(project.title, project.titleEn);
        const projectName = getText(project.projectName, project.projectNameEn) || title;
        const shortDesc = getText(project.shortDescription, project.shortDescriptionEn);

        document.title = `${title} - IREEM`;

        // Breadcrumb
        const breadcrumbTitle = document.getElementById('project-breadcrumb-title');
        if (breadcrumbTitle) {
            breadcrumbTitle.textContent = title.length > 50 ? title.substring(0, 50) + '...' : title;
        }

        // Status badge
        const statusBadge = document.getElementById('project-status-badge');
        if (statusBadge) {
            const statusLabels = lang === 'en' ? STATUS_LABELS.en : STATUS_LABELS.id;
            statusBadge.textContent = statusLabels[project.status] || project.status;
            statusBadge.className = `status-badge ${project.status}`;
        }

        // Year
        const yearEl = document.getElementById('project-year');
        if (yearEl) {
            const startYear = project.periodStart ? new Date(project.periodStart).getFullYear() : null;
            const endYear = project.periodEnd ? new Date(project.periodEnd).getFullYear() : null;
            if (startYear && endYear) yearEl.textContent = `${startYear} - ${endYear}`;
            else if (startYear) yearEl.textContent = `${startYear} - ${lang === 'en' ? 'Present' : 'Sekarang'}`;
        }

        // Title & Excerpt
        const titleEl = document.getElementById('project-title');
        if (titleEl) titleEl.textContent = title;
        const excerptEl = document.getElementById('project-excerpt');
        if (excerptEl) excerptEl.textContent = shortDesc;

        // Banner Image - FULL WIDTH with caption below
        if (project.bannerImage) {
            const bannerContainer = document.getElementById('project-banner-container');
            const bannerImage = document.getElementById('project-banner-image');
            const bannerCaption = document.getElementById('project-banner-caption');

            if (bannerContainer && bannerImage) {
                bannerImage.src = project.bannerImage;
                bannerImage.alt = project.bannerImageAlt || title;
                bannerContainer.style.display = 'block';

                if (bannerCaption) {
                    const caption = getText(project.bannerCaption, project.bannerCaptionEn);
                    if (caption) {
                        bannerCaption.textContent = caption;
                        bannerCaption.style.display = 'block';
                    } else {
                        bannerCaption.style.display = 'none';
                    }
                }
            }
        }

        // Narrative content (Full Portable Text rendering)
        const narrativeEl = document.getElementById('project-narrative');
        if (narrativeEl) {
            // Get localized content - fullDescription may have id/en or be array directly
            let blocks = project.fullDescription;
            if (project.fullDescription?.id || project.fullDescription?.en) {
                blocks = lang === 'en' && project.fullDescription.en?.length
                    ? project.fullDescription.en
                    : project.fullDescription.id;
            }

            if (blocks && Array.isArray(blocks) && blocks.length > 0) {
                narrativeEl.innerHTML = renderPortableText(blocks, lang);
            } else if (shortDesc) {
                narrativeEl.innerHTML = `<p>${shortDesc}</p>`;
            }
        }

        // Activities Section
        renderActivities(project.activities, lang);

        // Sidebar metadata
        document.getElementById('meta-project-name').textContent = projectName;
        document.getElementById('meta-donor').textContent = getText(project.donor, project.donorEn) || '-';

        const periodEl = document.getElementById('meta-period');
        if (periodEl) {
            const startYear = project.periodStart ? new Date(project.periodStart).getFullYear() : null;
            const endYear = project.periodEnd ? new Date(project.periodEnd).getFullYear() : null;
            if (startYear && endYear) periodEl.textContent = `${startYear} - ${endYear}`;
            else if (startYear) periodEl.textContent = `${startYear} - ${lang === 'en' ? 'Present' : 'Sekarang'}`;
            else periodEl.textContent = '-';
        }

        const statusEl = document.getElementById('meta-status');
        if (statusEl) {
            const statusLabels = lang === 'en' ? STATUS_LABELS.en : STATUS_LABELS.id;
            statusEl.textContent = statusLabels[project.status] || project.status || '-';
        }

        // Programs tags - OVAL STYLE
        const programsEl = document.getElementById('meta-programs');
        if (programsEl && project.programs?.length > 0) {
            const labels = lang === 'en' ? PROGRAM_LABELS.en : PROGRAM_LABELS.id;
            programsEl.innerHTML = project.programs.map(p => {
                const colors = PROGRAM_COLORS[p] || { bg: '#f3f4f6', text: '#374151' };
                return `<span class="program-tag" style="background: ${colors.bg}; color: ${colors.text};">${labels[p] || p}</span>`;
            }).join('');
        }

        // Achievements
        renderAchievements(project.activities, lang);

        // Related items WITH IMAGES
        if (project.relatedProjects?.length > 0) renderRelatedProjects(project.relatedProjects, lang);
        if (project.relatedNews?.length > 0) renderRelatedNews(project.relatedNews, lang);
        if (project.relatedFactsheets?.length > 0) renderRelatedFactsheets(project.relatedFactsheets, lang);
        if (project.relatedPublications?.length > 0) renderRelatedPublications(project.relatedPublications, lang);

        hideLoading();
        containerEl.style.display = 'block';
    }

    // ===========================================
    // ACTIVITIES & ACHIEVEMENTS
    // ===========================================

    function renderActivities(activities, lang) {
        if (!activities || activities.length === 0) return;

        const activitiesSection = document.getElementById('project-activities-section');
        const activitiesList = document.getElementById('project-activities');
        if (!activitiesSection || !activitiesList) return;

        const allForms = [];
        activities.forEach(activity => {
            // Prioritize English if language is 'en' AND English forms exist
            let forms = activity.forms || [];
            if (lang === 'en' && activity.formsEn && Array.isArray(activity.formsEn) && activity.formsEn.length > 0) {
                forms = activity.formsEn;
            }
            if (forms && forms.length > 0) allForms.push(...forms);
        });

        if (allForms.length > 0) {
            activitiesList.innerHTML = allForms.map(form => `<li>${escapeHtml(form)}</li>`).join('');
            activitiesSection.style.display = 'block';
        }
    }

    function renderAchievements(activities, lang) {
        if (!activities || activities.length === 0) return;

        const achievementsCard = document.getElementById('achievements-card');
        const achievementsList = document.getElementById('project-achievements');
        if (!achievementsCard || !achievementsList) return;

        const allAchievements = [];
        activities.forEach(activity => {
            if (activity.achievements && Array.isArray(activity.achievements)) {
                activity.achievements.forEach(ach => {
                    // Prioritize English if language is 'en' AND English label exists
                    let label = ach.label || '';
                    if (lang === 'en' && ach.labelEn) {
                        label = ach.labelEn;
                    }
                    if (label) allAchievements.push(label);
                });
            }
        });

        if (allAchievements.length > 0) {
            achievementsList.innerHTML = allAchievements.map(ach => `<li>${escapeHtml(ach)}</li>`).join('');
            achievementsCard.style.display = 'block';
        }
    }

    // ===========================================
    // RELATED ITEMS (WITH IMAGES)
    // ===========================================

    function renderRelatedProjects(projects, lang) {
        const section = document.getElementById('related-projects-section');
        const container = document.getElementById('related-projects');
        if (!section || !container) return;

        container.innerHTML = projects.map(p => `
            <a href="detail.html?slug=${p.slug}" class="related-card">
                ${p.thumbnail ? `<img src="${p.thumbnail}" alt="" class="related-card__image">` : '<div class="related-card__image-placeholder"></div>'}
                <div class="related-card__content">
                    <span class="related-card__category">${lang === 'en' ? 'Project' : 'Proyek'}</span>
                    <h4 class="related-card__title">${escapeHtml(p.title)}</h4>
                </div>
            </a>
        `).join('');
        section.style.display = 'block';
    }

    function renderRelatedNews(news, lang) {
        const section = document.getElementById('related-news-section');
        const container = document.getElementById('related-news');
        if (!section || !container) return;

        container.innerHTML = news.map(n => `
            <a href="../berita/detail.html?slug=${n.slug}" class="related-card">
                ${n.thumbnail ? `<img src="${n.thumbnail}" alt="" class="related-card__image">` : '<div class="related-card__image-placeholder"></div>'}
                <div class="related-card__content">
                    <span class="related-card__category">${lang === 'en' ? 'News' : 'Berita'}</span>
                    <h4 class="related-card__title">${escapeHtml(n.title)}</h4>
                </div>
            </a>
        `).join('');
        section.style.display = 'block';
    }

    function renderRelatedFactsheets(factsheets, lang) {
        const section = document.getElementById('related-factsheets-section');
        const container = document.getElementById('related-factsheets');
        if (!section || !container) return;

        container.innerHTML = factsheets.map(f => `
            <a href="../factsheet/detail.html?slug=${f.slug}" class="related-card">
                ${f.thumbnail ? `<img src="${f.thumbnail}" alt="" class="related-card__image">` : '<div class="related-card__image-placeholder"></div>'}
                <div class="related-card__content">
                    <span class="related-card__category">FactSheet</span>
                    <h4 class="related-card__title">${escapeHtml(f.title)}</h4>
                </div>
            </a>
        `).join('');
        section.style.display = 'block';
    }

    function renderRelatedPublications(publications, lang) {
        const section = document.getElementById('related-publications-section');
        const container = document.getElementById('related-publications');
        if (!section || !container) return;

        container.innerHTML = publications.map(p => `
            <a href="../publikasi/detail.html?slug=${p.slug}" class="related-card">
                ${p.thumbnail ? `<img src="${p.thumbnail}" alt="" class="related-card__image">` : '<div class="related-card__image-placeholder"></div>'}
                <div class="related-card__content">
                    <span class="related-card__category">${lang === 'en' ? 'Publication' : 'Publikasi'}</span>
                    <h4 class="related-card__title">${escapeHtml(p.title)}</h4>
                </div>
            </a>
        `).join('');
        section.style.display = 'block';
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================

    function hideLoading() {
        if (loadingEl) loadingEl.style.display = 'none';
    }

    function showError() {
        hideLoading();
        if (errorEl) errorEl.style.display = 'flex';
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Language change listener
    document.addEventListener('languageChange', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        if (slug) loadProject(slug);
    });

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
