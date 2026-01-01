/**
 * Team Detail Page - Sanity CMS Integration with Bilingual Support
 * Defensive rendering with proper error handling
 * Supports Indonesian/English content
 * 
 * @file team-detail.js
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

    function getSanityUrl(query, params = {}) {
        const baseUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`;
        const encodedQuery = encodeURIComponent(query);
        let paramString = '';
        for (const [key, value] of Object.entries(params)) {
            paramString += `&$${key}="${encodeURIComponent(value)}"`;
        }
        return `${baseUrl}?query=${encodedQuery}${paramString}`;
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

    // GROQ Query with bilingual fields
    const TEAM_MEMBER_QUERY = `*[_type == "person" && slug.current == $slug][0]{
        _id,
        name,
        "slug": slug.current,
        positionTitle,
        shortBio,
        fullBio,
        skills,
        "photo": {
            "url": photo.asset->url,
            "alt": photo.alt
        },
        experiences[] {
            role,
            organization,
            startYear,
            endYear
        },
        educations[] {
            degree,
            field,
            institution
        },
        contact {
            email,
            linkedin
        }
    }`;

    // ===========================================
    // DOM ELEMENTS
    // ===========================================
    const getEl = (id) => document.getElementById(id);

    // Store profile data for re-rendering
    let profileData = null;

    // ===========================================
    // MAIN EXECUTION
    // ===========================================
    document.addEventListener('DOMContentLoaded', async function () {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        const loadingState = getEl('loading-state');
        const errorState = getEl('error-state');
        const profileWrapper = getEl('profile-wrapper');

        if (!slug) {
            showError();
            return;
        }

        try {
            const profile = await fetchProfile(slug);

            if (!profile) {
                throw new Error('Profile data is null');
            }

            profileData = profile;
            renderProfile(profile);

            // Listen for language changes
            document.addEventListener('languageChange', () => {
                console.info('[TeamDetail] Language changed, re-rendering...');
                if (profileData) {
                    renderProfile(profileData);
                }
            });

        } catch (err) {
            console.error('[TeamDetail] Fatal error:', err);
            showError();
        }

        // ===========================================
        // FETCH PROFILE
        // ===========================================
        async function fetchProfile(slug) {
            console.info('[TeamDetail] Fetching from Sanity...');
            const url = getSanityUrl(TEAM_MEMBER_QUERY, { slug });
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.result || !data.result.name) {
                throw new Error('Profile not found');
            }

            console.info('[TeamDetail] ✓ Found in Sanity');
            return data.result;
        }

        // ===========================================
        // RENDER PROFILE
        // ===========================================
        function renderProfile(profile) {
            const lang = getCurrentLanguage();
            console.info('[TeamDetail] Rendering with language:', lang);

            // Hide loading, show profile
            if (loadingState) loadingState.style.display = 'none';
            if (profileWrapper) profileWrapper.style.display = 'block';

            // Update page title
            document.title = `${profile.name} – IREEM`;

            // Render each section
            renderHeader(profile, lang);
            renderPhoto(profile);
            renderBio(profile, lang);
            renderExpertise(profile, lang);
            renderExperience(profile, lang);
            renderEducation(profile, lang);
            renderContact(profile.contact, lang);
        }

        // ===========================================
        // SECTION RENDERERS
        // ===========================================

        function renderHeader(profile, lang) {
            const nameEl = getEl('profile-name');
            const titleEl = getEl('profile-title');

            if (nameEl) nameEl.textContent = profile.name || '';
            if (titleEl) titleEl.textContent = getText(profile.positionTitle, lang) || '';
        }

        function renderPhoto(profile) {
            const photoEl = getEl('profile-photo');

            if (photoEl) {
                const photoUrl = profile.photo?.url || '../images/placeholder-person.jpg';
                photoEl.src = photoUrl;
                photoEl.alt = profile.name || 'Profile Photo';
            }
        }

        function renderBio(profile, lang) {
            const container = getEl('profile-bio');
            if (!container) return;

            // Get bilingual bio (fullBio or shortBio)
            const bioContent = getArray(profile.fullBio, lang);
            const shortBio = getText(profile.shortBio, lang);

            if (Array.isArray(bioContent) && bioContent.length > 0) {
                // Portable Text blocks
                container.innerHTML = portableTextToHtml(bioContent);
            } else if (shortBio) {
                container.innerHTML = `<p>${escapeHtml(shortBio)}</p>`;
            } else {
                const emptyText = lang === 'en' ? 'Biography not available yet.' : 'Biografi belum tersedia.';
                container.innerHTML = `<p class="empty-state">${emptyText}</p>`;
            }
        }

        function renderExpertise(profile, lang) {
            const container = getEl('profile-expertise');
            if (!container) return;

            const skills = getArray(profile.skills, lang);

            if (skills.length > 0) {
                container.innerHTML = skills
                    .map(skill => `<span class="expertise-tag">${escapeHtml(skill)}</span>`)
                    .join('');
            } else {
                const emptyText = lang === 'en' ? 'Expertise not available yet.' : 'Keahlian belum tersedia.';
                container.innerHTML = `<span class="empty-state">${emptyText}</span>`;
            }
        }

        function renderExperience(profile, lang) {
            const container = getEl('profile-experience');
            if (!container) return;

            const experiences = profile.experiences || [];
            const presentText = lang === 'en' ? 'Present' : 'Sekarang';

            if (experiences.length > 0) {
                container.innerHTML = experiences.map(exp => {
                    const role = getText(exp.role, lang) || exp.position || '';
                    const period = exp.startYear
                        ? `${exp.startYear} – ${exp.endYear || presentText}`
                        : '';

                    return `
                        <li>
                            <svg class="list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                            </svg>
                            <div class="experience-item">
                                <div class="position">${escapeHtml(role)}</div>
                                <div class="org">${escapeHtml(exp.organization || '')}</div>
                                <div class="period">${escapeHtml(period)}</div>
                            </div>
                        </li>
                    `;
                }).join('');
            } else {
                const emptyText = lang === 'en' ? 'Experience not available yet.' : 'Pengalaman belum tersedia.';
                container.innerHTML = `<li class="empty-state">${emptyText}</li>`;
            }
        }

        function renderEducation(profile, lang) {
            const container = getEl('profile-education');
            if (!container) return;

            const educations = profile.educations || [];

            if (educations.length > 0) {
                container.innerHTML = educations.map(edu => {
                    const degree = getText(edu.degree, lang) || '';
                    const field = getText(edu.field, lang) || '';

                    return `
                        <li>
                            <svg class="list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                            </svg>
                            <div class="experience-item">
                                <div class="position">${escapeHtml(degree)}${degree && field ? ' – ' : ''}${escapeHtml(field)}</div>
                                <div class="org">${escapeHtml(edu.institution || '')}</div>
                            </div>
                        </li>
                    `;
                }).join('');
            } else {
                const emptyText = lang === 'en' ? 'Education not available yet.' : 'Pendidikan belum tersedia.';
                container.innerHTML = `<li class="empty-state">${emptyText}</li>`;
            }
        }

        function renderContact(contact, lang) {
            const container = getEl('profile-social');
            if (!container) return;

            let html = '';

            if (contact?.email) {
                html += `
                    <a href="mailto:${escapeHtml(contact.email)}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <path d="M22 6l-10 7L2 6"/>
                        </svg>
                        ${escapeHtml(contact.email)}
                    </a>
                `;
            }

            if (contact?.linkedin) {
                html += `
                    <a href="${escapeHtml(contact.linkedin)}" target="_blank">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                    </a>
                `;
            }

            if (!html) {
                const emptyText = lang === 'en' ? 'Contact not available yet.' : 'Kontak belum tersedia.';
                html = `<p class="empty-state">${emptyText}</p>`;
            }

            container.innerHTML = html;
        }

        // ===========================================
        // UTILITIES
        // ===========================================
        function portableTextToHtml(blocks) {
            if (!Array.isArray(blocks)) return '';

            return blocks.map(block => {
                if (block._type === 'block') {
                    const text = (block.children || [])
                        .map(child => escapeHtml(child.text || ''))
                        .join('');

                    switch (block.style) {
                        case 'h2': return `<h2>${text}</h2>`;
                        case 'h3': return `<h3>${text}</h3>`;
                        case 'h4': return `<h4>${text}</h4>`;
                        default: return text ? `<p>${text}</p>` : '';
                    }
                }
                return '';
            }).join('');
        }

        function escapeHtml(text) {
            if (text === null || text === undefined) return '';
            const div = document.createElement('div');
            div.textContent = String(text);
            return div.innerHTML;
        }

        function showError() {
            if (loadingState) loadingState.style.display = 'none';
            if (errorState) errorState.style.display = 'block';
        }
    });
})();
