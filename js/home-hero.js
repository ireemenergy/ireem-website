/**
 * Home Hero Slideshow - Dynamic Renderer
 * Fetches hero slides from Sanity CMS and renders them dynamically
 * Integrates with existing slideshow functions (goToSlide, startSlideshow)
 * 
 * @file home-hero.js
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

    // GROQ Query for hero slideshow
    const HERO_QUERY = `*[_type == "heroSlideshow"][0]{
        title,
        slides[]{
            title,
            subtitle,
            image { asset->{ url } }
        }
    }`;

    // Fallback slide if Sanity fetch fails
    const FALLBACK_SLIDE = {
        title: 'IREEM Hero',
        image: { asset: { url: 'images/hero-bg.png' } }
    };

    // ===========================================
    // MAIN EXECUTION
    // ===========================================
    document.addEventListener('DOMContentLoaded', async function () {
        try {
            const slideshow = await fetchHeroSlideshow();
            const slides = slideshow?.slides || [FALLBACK_SLIDE];

            renderSlideshow(slides);
        } catch (error) {
            console.error('[HomeHero] Error loading slideshow:', error);
            renderSlideshow([FALLBACK_SLIDE]);
        }
    });

    /**
     * Fetch hero slideshow from Sanity
     */
    async function fetchHeroSlideshow() {
        console.info('[HomeHero] Fetching slideshow from Sanity...');

        const url = getSanityUrl(HERO_QUERY);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.result) {
            console.warn('[HomeHero] No slideshow data found in Sanity');
            return null;
        }

        console.info(`[HomeHero] Loaded ${data.result.slides?.length || 0} slides`);
        return data.result;
    }

    /**
     * Render slideshow HTML
     */
    function renderSlideshow(slides) {
        const slideshowContainer = document.querySelector('.hero-slideshow');
        const dotsContainer = document.querySelector('.hero-dots');

        if (!slideshowContainer || !dotsContainer) {
            console.error('[HomeHero] Slideshow containers not found');
            return;
        }

        // Clear containers
        slideshowContainer.innerHTML = '';
        dotsContainer.innerHTML = '';

        // Render slides
        slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'hero-slide';
            if (index === 0) {
                slideDiv.classList.add('active');
            }

            const imageUrl = slide.image?.asset?.url || FALLBACK_SLIDE.image.asset.url;
            slideDiv.style.backgroundImage = `url('${escapeUrl(imageUrl)}')`;

            // Add accessible label
            slideDiv.setAttribute('role', 'img');
            slideDiv.setAttribute('aria-label', slide.title || `Slide ${index + 1}`);

            slideshowContainer.appendChild(slideDiv);
        });

        // Render dots
        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.className = 'hero-dot';
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

            // Add click handler directly (don't use onclick attribute)
            dot.addEventListener('click', () => goToSlide(index));

            dotsContainer.appendChild(dot);
        });

        console.info(`[HomeHero] Rendered ${slides.length} slide${slides.length !== 1 ? 's' : ''}`);

        // Initialize slideshow control AFTER slides are rendered
        initSlideshowControls();
    }

    /**
     * Initialize slideshow control logic
     * Runs AFTER slides are injected into DOM
     */
    function initSlideshowControls() {
        let currentSlide = 0;
        const slideElements = document.querySelectorAll('.hero-slide');
        const dotElements = document.querySelectorAll('.hero-dot');
        const totalSlides = slideElements.length;
        let slideInterval;

        // Make goToSlide available globally for dot onclick
        window.goToSlide = function (index) {
            slideElements[currentSlide].classList.remove('active');
            dotElements[currentSlide].classList.remove('active');

            currentSlide = index;

            slideElements[currentSlide].classList.add('active');
            dotElements[currentSlide].classList.add('active');

            // Reset interval
            clearInterval(slideInterval);
            startSlideshow();
        };

        function nextSlide() {
            const nextIndex = (currentSlide + 1) % totalSlides;
            window.goToSlide(nextIndex);
        }

        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 6000);
        }

        // Start automatic slideshow
        startSlideshow();
        console.info('[HomeHero] Slideshow auto-advance started');
    }

    /**
     * Escape URL for CSS background-image
     */
    function escapeUrl(url) {
        return url.replace(/'/g, "\\'");
    }
})();
