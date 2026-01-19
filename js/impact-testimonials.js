/**
 * Impact Page Testimonials
 * Fetches testimonials from Sanity CMS testimonialsSection
 */

(function () {
    'use strict';

    // Sanity CMS Configuration
    const SANITY_PROJECT_ID = '1zvl0z92';
    const SANITY_DATASET = 'production';
    const SANITY_API_VERSION = '2023-05-03';

    let currentSlide = 0;
    let totalSlides = 0;
    let autoplayInterval = null;

    // Category labels for display
    const CATEGORY_LABELS = {
        pemerintah: { id: 'Pemerintah', en: 'Government' },
        industri: { id: 'Industri', en: 'Industry' },
        akademisi: { id: 'Akademisi', en: 'Academia' },
        komunitas: { id: 'Komunitas', en: 'Community' }
    };

    // Placeholder testimonials (fallback)
    const PLACEHOLDER_TESTIMONIALS = [
        {
            slug: 'hendro-gunawan',
            category: 'pemerintah',
            quote: {
                id: 'Pencapaian terbesar dari proyek UK-PACT Fase 1 IREEM adalah meningkatkan manajemen energi di gedung-gedung pemerintah.',
                en: 'The greatest achievement of IREEM\'s UK-PACT Phase 1 project was enhancing energy management in government buildings.'
            },
            name: 'Hendro Gunawan',
            position: {
                id: 'Koordinator Bimbingan Teknis dan Kerja Sama',
                en: 'Coordinator for Technical Guidance and Cooperation'
            },
            organization: {
                id: 'Direktorat Konservasi Energi, Kementerian ESDM',
                en: 'Directorate of Energy Conservation, MEMR'
            },
            photo: { url: '../images/testimonials/hendro-gunawan.png' },
            organizationLogo: { url: '../images/partners/kementerian-esdm.png' },
            isFeaturedStory: true
        }
    ];

    function getSanityUrl(query) {
        const baseUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
        const encodedQuery = encodeURIComponent(query);
        return `${baseUrl}?query=${encodedQuery}`;
    }

    function getCurrentLanguage() {
        if (window.i18n) {
            if (typeof window.i18n.getCurrentLang === 'function') {
                return window.i18n.getCurrentLang();
            }
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

    function getCategoryLabel(category, lang) {
        return CATEGORY_LABELS[category]?.[lang] || category || '';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    async function loadTestimonials() {
        const track = document.getElementById('impact-spotlight-track');
        const dotsContainer = document.getElementById('impact-spotlight-dots');

        if (!track) return;

        try {
            // Fetch all testimonials from testimonialsSection
            const query = `*[_type == "testimonialsSection"][0] {
                testimonials[] {
                    quote,
                    name,
                    "slug": slug.current,
                    position,
                    organization,
                    category,
                    isFeaturedStory,
                    "photo": photo {
                        "url": asset->url,
                        hotspot
                    },
                    "organizationLogo": organizationLogo {
                        "url": asset->url
                    }
                }
            }`;

            const url = getSanityUrl(query);
            console.info('[ImpactTestimonials] Fetching from Sanity...');
            const response = await fetch(url);
            const data = await response.json();

            if (data.result && data.result.testimonials && data.result.testimonials.length > 0) {
                const lang = getCurrentLanguage();
                const validTestimonials = data.result.testimonials.filter(item => {
                    if (!item) return false;
                    const quote = getText(item.quote, lang);
                    const name = item.name;
                    return quote && name;
                });

                if (validTestimonials.length > 0) {
                    console.info('[ImpactTestimonials] Loaded', validTestimonials.length, 'testimonials from Sanity');
                    renderTestimonials(validTestimonials, track, dotsContainer);
                } else {
                    console.warn('[ImpactTestimonials] No valid testimonials, using fallback');
                    renderTestimonials(PLACEHOLDER_TESTIMONIALS, track, dotsContainer);
                }
            } else {
                console.warn('[ImpactTestimonials] No testimonials from Sanity, using fallback');
                renderTestimonials(PLACEHOLDER_TESTIMONIALS, track, dotsContainer);
            }
        } catch (error) {
            console.error('[ImpactTestimonials] Error loading:', error);
            renderTestimonials(PLACEHOLDER_TESTIMONIALS, track, dotsContainer);
        }
    }

    function renderTestimonials(testimonials, track, dotsContainer) {
        const lang = getCurrentLanguage();
        const validTestimonials = testimonials.filter(item => item != null);
        totalSlides = validTestimonials.length;

        // Generate slides HTML
        track.innerHTML = validTestimonials.map((item, index) => {
            const quote = escapeHtml(getText(item.quote, lang));
            const name = escapeHtml(item.name || '');
            const position = escapeHtml(getText(item.position, lang));
            const organization = escapeHtml(getText(item.organization, lang));

            // Category badge
            const category = getCategoryLabel(item.category, lang).toUpperCase();

            // Image URLs
            const imageUrl = item.photo?.url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0E3A5D&color=F2A900&size=280`;
            const orgLogo = item.organizationLogo?.url || '';

            // Slug for detail page link - only show link if isFeaturedStory
            const slug = item.slug || name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 50);
            const readMoreLabel = lang === 'en' ? 'Read Full Story' : 'Baca Cerita Lengkap';
            const showReadMore = item.isFeaturedStory && slug;

            return `<div class="spotlight-slide" data-index="${index}"><div class="spotlight-photo-wrapper"><img src="${imageUrl}" alt="${name}" class="spotlight-image" loading="lazy" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0E3A5D&color=F2A900&size=280'"></div><div class="spotlight-content"><div class="spotlight-quote-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-accent)"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg></div><p class="spotlight-quote">${quote}</p><div class="spotlight-author-info"><div class="spotlight-author-details"><p class="spotlight-author">${name}</p><p class="spotlight-position">${position}</p></div><div class="spotlight-org">${orgLogo ? `<img src="${orgLogo}" alt="${organization}" class="spotlight-org-logo" onerror="this.style.display='none'">` : ''}<span class="spotlight-org-name">${organization}</span></div></div>${showReadMore ? `<a href="success-story.html?slug=${slug}" class="spotlight-read-more">${readMoreLabel} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>` : ''}<span class="spotlight-badge">${category}</span></div></div>`;
        }).join('');

        // Render dots
        if (dotsContainer) {
            dotsContainer.innerHTML = validTestimonials.map((_, index) => `
                <button class="spotlight-dot ${index === 0 ? 'active' : ''}" 
                        data-index="${index}" 
                        aria-label="Slide ${index + 1}"></button>
            `).join('');

            // Add click handlers to dots
            dotsContainer.querySelectorAll('.spotlight-dot').forEach(dot => {
                dot.addEventListener('click', () => {
                    goToSlide(parseInt(dot.dataset.index));
                });
            });
        }

        // Initialize first slide
        goToSlide(0);
        startAutoplay();
    }

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;

        const track = document.getElementById('impact-spotlight-track');
        const slides = track?.querySelectorAll('.spotlight-slide');
        const dots = document.querySelectorAll('#impact-spotlight-dots .spotlight-dot');

        if (slides) {
            slides.forEach((slide, i) => {
                // Desktop: translate slides
                if (window.innerWidth > 768) {
                    slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
                } else {
                    // Mobile: fade transition
                    slide.style.opacity = i === currentSlide ? '1' : '0';
                    slide.style.pointerEvents = i === currentSlide ? 'auto' : 'none';
                }
            });
        }

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        loadTestimonials();

        // Add navigation button handlers
        const prevBtn = document.getElementById('impact-spotlight-prev');
        const nextBtn = document.getElementById('impact-spotlight-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoplay();
                prevSlide();
                startAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoplay();
                nextSlide();
                startAutoplay();
            });
        }
    });

    // Language change
    document.addEventListener('languageChanged', loadTestimonials);

    // Export
    window.ImpactTestimonials = {
        goToSlide,
        nextSlide,
        prevSlide,
        reload: loadTestimonials
    };
})();
