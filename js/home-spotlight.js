/**
 * Home Impact Spotlight
 * Loads testimonials from Sanity CMS - Homepage > Testimoni
 */

(function () {
    'use strict';

    // Sanity CMS Configuration - same as other home components
    const SANITY_PROJECT_ID = '1zvl0z92';
    const SANITY_DATASET = 'production';
    const SANITY_API_VERSION = '2023-05-03';

    let currentSlide = 0;
    let totalSlides = 0;
    let autoplayInterval = null;

    // Placeholder testimonials (will be replaced by Sanity data)
    // Bilingual format: { id: 'Indonesian text', en: 'English text' }
    const PLACEHOLDER_TESTIMONIALS = [
        {
            type: 'Government',
            quote: {
                id: 'Pencapaian terbesar dari proyek UK-PACT Fase 1 IREEM adalah meningkatkan manajemen energi di gedung-gedung pemerintah—dengan melatih para ahli dan mendukung puluhan fasilitas publik dalam perjalanan mereka menuju keberlanjutan.',
                en: 'The greatest achievement of IREEM\'s UK-PACT Phase 1 project was enhancing energy management in government buildings—by training experts and supporting dozens of public facilities in their path to sustainability.'
            },
            author: 'Hendro Gunawan',
            position: {
                id: 'Koordinator Bimbingan Teknis dan Kerja Sama',
                en: 'Coordinator for Technical Guidance and Cooperation'
            },
            organization: {
                id: 'Direktorat Konservasi Energi, Kementerian ESDM',
                en: 'Directorate of Energy Conservation, MEMR'
            },
            image: 'images/testimonials/hendro-gunawan.png',
            orgLogo: 'images/partners/kementerian-esdm.png'
        },
        {
            type: 'Donor',
            quote: {
                id: 'UK-PACT sangat mengapresiasi kerja sama dengan IREEM dalam program dekarbonisasi industri. Pendekatan berbasis bukti yang mereka gunakan sangat efektif untuk mencapai target iklim nasional.',
                en: 'UK-PACT greatly appreciates the collaboration with IREEM in industrial decarbonization programs. Their evidence-based approach is highly effective in achieving national climate targets.'
            },
            author: 'UK-PACT Indonesia',
            position: {
                id: 'Program Pendanaan Iklim',
                en: 'Climate Finance Programme'
            },
            organization: {
                id: 'Kedutaan Besar Inggris Jakarta',
                en: 'British Embassy Jakarta'
            },
            image: 'images/partners/ukpact.png',
            orgLogo: 'images/partners/ukpact.png'
        },
        {
            type: 'Beneficiary',
            quote: {
                id: 'Pelatihan audit energi dari IREEM sangat membantu pengembangan karir kami. Sekarang kami bisa berkontribusi langsung dalam upaya efisiensi energi nasional.',
                en: 'The energy audit training from IREEM has greatly helped our career development. Now we can directly contribute to national energy efficiency efforts.'
            },
            author: {
                id: 'Peserta Training',
                en: 'Training Participant'
            },
            position: {
                id: 'Auditor Energi',
                en: 'Energy Auditor'
            },
            organization: {
                id: 'Kementerian Keuangan',
                en: 'Ministry of Finance'
            },
            image: 'images/testimonials/beneficiary.jpg',
            orgLogo: 'images/partners/kemenkeu.png'
        }
    ];

    function getSanityUrl(query) {
        const baseUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
        const encodedQuery = encodeURIComponent(query);
        return `${baseUrl}?query=${encodedQuery}`;
    }

    function getCurrentLanguage() {
        // Check for i18n module with various method names
        if (window.i18n) {
            if (typeof window.i18n.getCurrentLang === 'function') {
                return window.i18n.getCurrentLang();
            }
            if (typeof window.i18n.getCurrentLanguage === 'function') {
                return window.i18n.getCurrentLanguage();
            }
            if (typeof window.i18n.lang === 'string') {
                return window.i18n.lang;
            }
        }
        return localStorage.getItem('ireem_lang') || 'id';
    }

    function getText(field, lang) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object') {
            // Try the requested language first
            if (field[lang]) return field[lang];
            // Fallback to Indonesian
            if (field.id) return field.id;
            // Fallback to English
            if (field.en) return field.en;
            // If it's a block content array (Sanity rich text), return empty
            if (Array.isArray(field)) return '';
        }
        return '';
    }

    async function loadTestimonials() {
        const track = document.getElementById('home-spotlight-track');
        const dotsContainer = document.getElementById('home-spotlight-dots');
        if (!track || !dotsContainer) return;

        // Try to load from Sanity first
        try {
            const query = `*[_type == "testimonialsSection"][0] {
                testimonials[] {
                    quote,
                    name,
                    "slug": slug.current,
                    isFeaturedStory,
                    position,
                    organization,
                    category,
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
            const response = await fetch(url);
            const data = await response.json();

            console.log('Sanity testimonials response:', data); // Debug log

            if (data.result && data.result.testimonials && data.result.testimonials.length > 0) {
                // Log each item for debugging
                data.result.testimonials.forEach((item, idx) => {
                    console.log(`Testimonial ${idx}:`, {
                        name: item?.name,
                        hasQuoteId: !!item?.quote?.id,
                        hasQuoteEn: !!item?.quote?.en,
                        hasPhoto: !!item?.photo?.url
                    });
                });

                // Filter out empty/incomplete items - must have BOTH quote AND name
                const validTestimonials = data.result.testimonials.filter(item => {
                    if (!item) return false;

                    // Check if quote has actual content
                    const hasQuote = item.quote && (
                        (typeof item.quote === 'string' && item.quote.trim().length > 0) ||
                        (item.quote.id && item.quote.id.trim().length > 0) ||
                        (item.quote.en && item.quote.en.trim().length > 0)
                    );

                    // Check if name has actual content
                    const hasName = item.name && item.name.trim().length > 0;

                    // Require BOTH quote AND name for a valid testimonial
                    const isValid = hasQuote && hasName;
                    console.log(`Testimonial "${item?.name}": hasQuote=${hasQuote}, hasName=${hasName}, valid=${isValid}`);
                    return isValid;
                });

                console.log('Valid testimonials count:', validTestimonials.length); // Debug log

                if (validTestimonials.length > 0) {
                    renderTestimonials(validTestimonials, track, dotsContainer);
                } else {
                    console.log('No valid testimonials, using placeholders');
                    renderTestimonials(PLACEHOLDER_TESTIMONIALS, track, dotsContainer);
                }
            } else {
                console.log('No testimonials in response, using placeholders');
                renderTestimonials(PLACEHOLDER_TESTIMONIALS, track, dotsContainer);
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
            renderTestimonials(PLACEHOLDER_TESTIMONIALS, track, dotsContainer);
        }
    }

    function renderTestimonials(testimonials, track, dotsContainer) {
        const lang = getCurrentLanguage();
        console.log('Rendering testimonials with language:', lang); // Debug log

        // Filter out any null/undefined items
        const validTestimonials = testimonials.filter(item => item != null);
        totalSlides = validTestimonials.length;

        track.innerHTML = validTestimonials.map((item, index) => {
            // Helper to escape HTML special characters
            const escapeHtml = (str) => {
                if (!str) return '';
                return str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            };

            // Get bilingual fields - handle both Sanity structure and placeholder structure
            const quote = escapeHtml(getText(item.quote, lang));

            // Name: Sanity uses 'name', placeholder uses 'author'
            const name = escapeHtml(item.name || getText(item.author, lang) || 'Unknown');

            // Position and organization
            const position = escapeHtml(getText(item.position, lang));
            const organization = escapeHtml(getText(item.organization, lang));

            // Category/type badge - Sanity uses 'category', placeholder uses 'type'
            let category = getText(item.category, lang);
            if (!category && item.type) {
                // For placeholder data, translate type to proper category text
                const typeMap = {
                    'Government': { id: 'PEMERINTAH', en: 'GOVERNMENT' },
                    'Donor': { id: 'DONOR', en: 'DONOR' },
                    'Beneficiary': { id: 'PENERIMA MANFAAT', en: 'BENEFICIARY' }
                };
                const mapped = typeMap[item.type];
                category = mapped ? mapped[lang] || mapped.id : item.type;
            }
            category = escapeHtml(category);

            // Get image URLs - support both new (Sanity) and old (placeholder) field names
            const imageUrl = item.photo?.url || item.imageUrl || item.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0E3A5D&color=F2A900&size=280`;
            const orgLogo = item.organizationLogo?.url || item.orgLogo || '';

            // DEBUG: Log what we're rendering for each item
            console.log(`Render item ${index} "${name}":`, {
                quote: quote ? quote.substring(0, 50) + '...' : 'EMPTY',
                quoteRaw: item.quote,
                position,
                organization,
                category,
                hasPhoto: !!item.photo?.url,
                imageUrl
            });

            // Build the URL for success story if isFeaturedStory
            const storyUrl = item.isFeaturedStory && item.slug ? `impact/success-story.html?slug=${item.slug}` : null;

            return `<div class="spotlight-slide" data-index="${index}" ${storyUrl ? `data-story-url="${storyUrl}" style="cursor: pointer;"` : ''}><div class="spotlight-photo-wrapper"><img src="${imageUrl}" alt="${name}" class="spotlight-image" loading="lazy" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0E3A5D&color=F2A900&size=280'"></div><div class="spotlight-content"><div class="spotlight-quote-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-accent)"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg></div><p class="spotlight-quote">${quote}</p><div class="spotlight-author-info"><div class="spotlight-author-details"><p class="spotlight-author">${name}</p><p class="spotlight-position">${position}</p></div><div class="spotlight-org">${orgLogo ? `<img src="${orgLogo}" alt="${organization}" class="spotlight-org-logo" onerror="this.style.display='none'">` : ''}<span class="spotlight-org-name">${organization}</span></div></div><span class="spotlight-badge">${category}</span></div></div>`;
        }).join('');

        // DEBUG: Log how many slides were actually created
        const actualSlides = track.querySelectorAll('.spotlight-slide');
        console.log(`[DEBUG] Created ${actualSlides.length} slides in track`);
        actualSlides.forEach((slide, i) => {
            const nameEl = slide.querySelector('.spotlight-author');
            console.log(`[DEBUG] Slide ${i}: name="${nameEl?.textContent}", hasContent=${slide.innerHTML.length > 500}`);
        });

        // Render dots
        dotsContainer.innerHTML = testimonials.map((_, index) => `
            <button class="spotlight-dot ${index === 0 ? 'active' : ''}" 
                    data-index="${index}" 
                    aria-label="Slide ${index + 1}"></button>
        `).join('');

        console.log(`[DEBUG] Created ${dotsContainer.querySelectorAll('.spotlight-dot').length} dots`);

        // Add click handlers to dots
        dotsContainer.querySelectorAll('.spotlight-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                goToSlide(parseInt(dot.dataset.index));
            });
        });

        // Add click handlers to slides with story URL
        track.querySelectorAll('.spotlight-slide[data-story-url]').forEach(slide => {
            slide.addEventListener('click', (e) => {
                // Don't navigate if clicking on dots
                if (e.target.closest('.spotlight-dot')) return;
                const url = slide.dataset.storyUrl;
                if (url) window.location.href = url;
            });
        });

        // Initialize slide positions and start autoplay
        goToSlide(0);
        startAutoplay();
    }

    function getBadgeText(type, lang) {
        const badges = {
            Government: { id: 'Pemerintah', en: 'Government' },
            Donor: { id: 'Pendonor', en: 'Donor' },
            Beneficiary: { id: 'Penerima Manfaat', en: 'Beneficiary' }
        };
        return badges[type]?.[lang] || badges[type]?.id || type;
    }

    function goToSlide(index) {
        const track = document.getElementById('home-spotlight-track');
        const slides = track?.querySelectorAll('.spotlight-slide');
        const dots = document.querySelectorAll('#home-spotlight-dots .spotlight-dot');

        if (!track || !slides || slides.length === 0) {
            console.error('[goToSlide] No track or slides found');
            return;
        }

        // Update current slide
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;

        console.log(`[goToSlide] Moving to slide ${currentSlide}, total slides: ${slides.length}`);

        // Check if mobile view (width <= 768px)
        const isMobile = window.innerWidth <= 768;

        // Update slides - different behavior for mobile vs desktop
        slides.forEach((slide, i) => {
            if (isMobile) {
                // Mobile: use opacity fade
                slide.style.opacity = i === currentSlide ? '1' : '0';
                slide.style.pointerEvents = i === currentSlide ? 'auto' : 'none';
            } else {
                // Desktop: use transform slide
                slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
                slide.style.opacity = '1';
                slide.style.pointerEvents = 'auto';
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Reset autoplay
        resetAutoplay();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 6000);
    }

    function resetAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', loadTestimonials);

    // Re-render on language change using the i18n event
    document.addEventListener('languageChanged', function () {
        console.log('[Spotlight] Language changed, reloading testimonials');
        loadTestimonials();
    });
})();
