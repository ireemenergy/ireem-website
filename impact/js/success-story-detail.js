/**
 * Success Story Detail Page
 * Fetches and displays individual success story from Sanity CMS
 * Includes rich text rendering with images, galleries, videos, and quotes
 */

(function () {
    'use strict';

    // Sanity CMS Configuration
    const SANITY_PROJECT_ID = '1zvl0z92';
    const SANITY_DATASET = 'production';
    const SANITY_API_VERSION = '2023-05-03';

    // Category labels for display
    const CATEGORY_LABELS = {
        pemerintah: { id: 'Pemerintah', en: 'Government' },
        industri: { id: 'Industri', en: 'Industry' },
        akademisi: { id: 'Akademisi', en: 'Academia' },
        komunitas: { id: 'Komunitas', en: 'Community' },
        pendonor: { id: 'Pendonor', en: 'Donor' },
        konsorsium: { id: 'Konsorsium', en: 'Consortium' }
    };

    let currentStory = null;

    function getSanityUrl(query, params = {}) {
        const baseUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
        let queryStr = encodeURIComponent(query);

        // Add params
        const paramParts = [];
        for (const [key, value] of Object.entries(params)) {
            paramParts.push(`$${key}="${encodeURIComponent(value)}"`);
        }

        let url = `${baseUrl}?query=${queryStr}`;
        if (paramParts.length > 0) {
            url += '&' + paramParts.join('&');
        }

        return url;
    }

    function getCurrentLanguage() {
        if (window.i18n && typeof window.i18n.getCurrentLang === 'function') {
            return window.i18n.getCurrentLang();
        }
        return localStorage.getItem('ireem_lang') || 'id';
    }

    function getText(field, lang) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[lang] || field.id || field.en || '';
    }

    function getContent(contentField, lang) {
        if (!contentField) return [];
        if (Array.isArray(contentField)) return contentField;
        return contentField[lang] || contentField.id || [];
    }

    function getCategoryLabel(category, lang) {
        return CATEGORY_LABELS[category]?.[lang] || category || '';
    }

    function getSlugFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }

    function showError() {
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('error-state').style.display = 'block';
    }

    function showLoading() {
        document.getElementById('loading-state').style.display = 'block';
        document.getElementById('error-state').style.display = 'none';
        const storyContent = document.getElementById('story-content');
        if (storyContent) storyContent.style.display = 'none';
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===========================================
    // PORTABLE TEXT RENDERER
    // Renders Sanity block content with rich media
    // ===========================================

    function sanityImageUrl(ref) {
        if (!ref) return '';
        const parts = ref.replace('image-', '').split('-');
        if (parts.length < 2) return '';

        const id = parts[0];
        const dimensions = parts.length > 2 ? parts.slice(1, -1).join('-') : '';
        const format = parts[parts.length - 1];

        if (dimensions) {
            return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}`;
        } else {
            return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}.${format}`;
        }
    }

    function renderPortableText(blocks, lang = 'id') {
        if (!blocks || !Array.isArray(blocks)) return '';

        let html = '';
        let inList = false;
        let listType = '';

        blocks.forEach((block) => {
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
                    if (inList) {
                        html += `</${listType}>`;
                        inList = false;
                    }
                    html += renderImage(block, lang);
                    break;
                case 'quoteBlock':
                    if (inList) {
                        html += `</${listType}>`;
                        inList = false;
                    }
                    html += renderQuoteBlock(block, lang);
                    break;
                case 'imageGallery':
                    if (inList) {
                        html += `</${listType}>`;
                        inList = false;
                    }
                    html += renderImageGallery(block, lang);
                    break;
                case 'youtubeEmbed':
                    if (inList) {
                        html += `</${listType}>`;
                        inList = false;
                    }
                    html += renderYouTubeEmbed(block, lang);
                    break;
                default:
                    console.warn('[SuccessStory] Unknown block type:', block._type);
            }
        });

        if (inList) {
            html += `</${listType}>`;
        }

        return html;
    }

    function renderBlock(block) {
        const style = block.style || 'normal';
        const children = renderChildren(block.children || [], block.markDefs || []);

        if (block.listItem) {
            return `<li>${children}</li>`;
        }

        switch (style) {
            case 'h1': return `<h1>${children}</h1>`;
            case 'h2': return `<h2>${children}</h2>`;
            case 'h3': return `<h3>${children}</h3>`;
            case 'h4': return `<h4>${children}</h4>`;
            case 'blockquote':
                return `<blockquote class="story-quote"><p>${children}</p></blockquote>`;
            case 'normal':
            default:
                return children ? `<p>${children}</p>` : '';
        }
    }

    function renderChildren(children, markDefs = []) {
        return children.map(child => {
            if (child._type !== 'span') {
                return child.text || '';
            }

            let text = escapeHtml(child.text || '');
            if (!text) return '';

            const marks = child.marks || [];

            marks.forEach(markKey => {
                switch (markKey) {
                    case 'strong':
                        text = `<strong>${text}</strong>`;
                        break;
                    case 'em':
                        text = `<em>${text}</em>`;
                        break;
                    case 'underline':
                        text = `<u>${text}</u>`;
                        break;
                    case 'strike-through':
                    case 'strike':
                        text = `<s>${text}</s>`;
                        break;
                    case 'code':
                        text = `<code>${text}</code>`;
                        break;
                    default:
                        const linkDef = markDefs.find(def => def._key === markKey);
                        if (linkDef && linkDef._type === 'link' && linkDef.href) {
                            const href = escapeHtml(linkDef.href);
                            const isExternal = href.startsWith('http');
                            text = `<a href="${href}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
                        }
                        break;
                }
            });

            return text;
        }).join('');
    }

    function renderImage(block, lang = 'id') {
        let url = '';

        if (block.asset?.url) {
            url = block.asset.url;
        } else if (block.asset?._ref) {
            url = sanityImageUrl(block.asset._ref);
        }

        if (!url) return '';

        const alt = escapeHtml(getText(block.alt, lang) || '');
        const caption = getText(block.caption, lang) || '';

        let html = `<figure class="story-image">
            <img src="${url}" alt="${alt}" loading="lazy">`;

        if (caption) {
            html += `<figcaption>${escapeHtml(caption)}</figcaption>`;
        }

        html += '</figure>';
        return html;
    }

    function renderQuoteBlock(block, lang = 'id') {
        const quoteText = escapeHtml(getText(block.text || block.quote, lang) || '');
        const citeText = escapeHtml(getText(block.cite || block.source, lang) || '');

        let html = '<blockquote class="story-quote">';

        if (quoteText) {
            html += `<p><em>"${quoteText}"</em></p>`;
        }

        if (citeText) {
            html += `<cite>— ${citeText}</cite>`;
        }

        html += '</blockquote>';
        return html;
    }

    function renderImageGallery(block, lang = 'id') {
        if (!block.images || !Array.isArray(block.images)) return '';

        const layout = block.layout || 'grid';
        const galleryId = 'gallery-' + Math.random().toString(36).substr(2, 9);

        const imageItems = block.images.map((item) => {
            let imageUrl = '';
            if (item.image?.asset?.url) {
                imageUrl = item.image.asset.url;
            } else if (item.image?.asset?._ref) {
                imageUrl = sanityImageUrl(item.image.asset._ref);
            } else if (item.asset?.url) {
                imageUrl = item.asset.url;
            } else if (item.asset?._ref) {
                imageUrl = sanityImageUrl(item.asset._ref);
            }

            const alt = escapeHtml(getText(item.alt, lang) || '');
            const caption = getText(item.caption, lang);

            if (!imageUrl) return '';

            let html = `<figure>
                <img src="${imageUrl}" alt="${alt}" loading="lazy">`;
            if (caption) {
                html += `<figcaption>${escapeHtml(caption)}</figcaption>`;
            }
            html += '</figure>';
            return html;
        }).filter(Boolean).join('');

        switch (layout) {
            case 'carousel':
                return `
                    <div class="gallery gallery--carousel" id="${galleryId}">
                        <button class="gallery__nav gallery__nav--prev" onclick="scrollGallery('${galleryId}', -1)" aria-label="Previous">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                        </button>
                        <div class="gallery__track">
                            ${imageItems}
                        </div>
                        <button class="gallery__nav gallery__nav--next" onclick="scrollGallery('${galleryId}', 1)" aria-label="Next">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    </div>
                `;

            case 'slideshow':
                const dotButtons = block.images.map((_, i) =>
                    `<button class="gallery__dot${i === 0 ? ' gallery__dot--active' : ''}" onclick="goToSlide('${galleryId}', ${i})" aria-label="Go to slide ${i + 1}"></button>`
                ).join('');

                const slides = block.images.map((item) => {
                    let imageUrl = item.image?.asset?.url || item.asset?.url || '';
                    if (!imageUrl && item.image?.asset?._ref) {
                        imageUrl = sanityImageUrl(item.image.asset._ref);
                    }
                    const alt = escapeHtml(getText(item.alt, lang) || '');
                    const caption = getText(item.caption, lang);

                    if (!imageUrl) return '';

                    return `<div class="gallery__slide">
                        <figure>
                            <img src="${imageUrl}" alt="${alt}" loading="lazy">
                            ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
                        </figure>
                    </div>`;
                }).filter(Boolean).join('');

                return `
                    <div class="gallery gallery--slideshow" id="${galleryId}" data-current="0">
                        <button class="gallery__nav gallery__nav--prev" onclick="changeSlide('${galleryId}', -1)" aria-label="Previous">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                        </button>
                        <div class="gallery__slides">
                            ${slides}
                        </div>
                        <button class="gallery__nav gallery__nav--next" onclick="changeSlide('${galleryId}', 1)" aria-label="Next">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                        <div class="gallery__dots">
                            ${dotButtons}
                        </div>
                    </div>
                `;

            case 'grid':
            default:
                return `<div class="gallery gallery--grid">${imageItems}</div>`;
        }
    }

    function renderYouTubeEmbed(block, lang = 'id') {
        const url = block.url || '';
        const caption = getText(block.caption, lang);

        // Extract YouTube video ID
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
        const videoId = match ? match[1] : '';

        if (!videoId) {
            console.warn('[SuccessStory] Invalid YouTube URL:', url);
            return '';
        }

        let html = `
            <div class="video-embed">
                <div class="video-embed__wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}"
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>`;

        if (caption) {
            html += `<p class="video-embed__caption">${escapeHtml(caption)}</p>`;
        }

        html += '</div>';
        return html;
    }

    // ===========================================
    // GALLERY HELPER FUNCTIONS (Global)
    // ===========================================

    // Carousel scroll
    window.scrollGallery = function (galleryId, direction) {
        const gallery = document.getElementById(galleryId);
        if (!gallery) return;
        const track = gallery.querySelector('.gallery__track');
        if (!track) return;
        const scrollAmount = track.clientWidth * 0.8;
        track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    };

    // Slideshow navigation
    window.changeSlide = function (galleryId, direction) {
        const gallery = document.getElementById(galleryId);
        if (!gallery) return;
        const slides = gallery.querySelectorAll('.gallery__slide');
        const dots = gallery.querySelectorAll('.gallery__dot');
        let current = parseInt(gallery.dataset.current) || 0;

        current += direction;
        if (current < 0) current = slides.length - 1;
        if (current >= slides.length) current = 0;

        gallery.dataset.current = current;
        slides.forEach((slide, i) => {
            slide.style.display = i === current ? 'block' : 'none';
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('gallery__dot--active', i === current);
        });
    };

    window.goToSlide = function (galleryId, index) {
        const gallery = document.getElementById(galleryId);
        if (!gallery) return;
        const slides = gallery.querySelectorAll('.gallery__slide');
        const dots = gallery.querySelectorAll('.gallery__dot');

        gallery.dataset.current = index;
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('gallery__dot--active', i === index);
        });
    };

    // ===========================================
    // FETCH FUNCTIONS
    // ===========================================

    async function fetchSuccessStory(slug) {
        // Updated query to match new Sanity schema
        const query = `*[_type == "testimonialsSection"][0] {
            "story": testimonials[slug.current == $slug][0] {
                _key,
                name,
                "slug": slug.current,
                
                // Story titles
                "storyTitle": storyTitle.id,
                "storyTitleEn": storyTitle.en,
                "storySubtitle": storySubtitle.id,
                "storySubtitleEn": storySubtitle.en,
                
                // Person info
                "quote": quote.id,
                "quoteEn": quote.en,
                "position": position.id,
                "positionEn": position.en,
                "organization": organization.id,
                "organizationEn": organization.en,
                "photo": photo.asset->url,
                "organizationLogo": organizationLogo.asset->url,
                category,
                
                // Banner
                "bannerImage": bannerImage.asset->url,
                "bannerImageAlt": bannerImage.alt,
                "bannerCaption": bannerImage.caption.id,
                "bannerCaptionEn": bannerImage.caption.en,
                
                // Full content (bilingual)
                "fullStory": fullStory.id,
                "fullStoryEn": fullStory.en,
                
                // Related content
                "relatedProjects": relatedProjects[]-> {
                    _id,
                    "title": title.id,
                    "titleEn": title.en,
                    "slug": slug.current,
                    "bannerImage": bannerImage.asset->url
                },
                "relatedNews": relatedNews[]-> {
                    _id,
                    "title": title.id,
                    "titleEn": title.en,
                    "slug": slug.current,
                    "thumbnail": coverImage.asset->url,
                    publishedAt
                },
                "relatedPublications": relatedPublications[]-> {
                    _id,
                    "title": title.id,
                    "titleEn": title.en,
                    "slug": slug.current,
                    "thumbnail": coalesce(bannerImage.asset->url, coverImage.asset->url)
                },
                "relatedFactsheets": relatedFactsheets[]-> {
                    _id,
                    "title": title.id,
                    "titleEn": title.en,
                    "slug": slug.current,
                    "thumbnail": thumbnail.asset->url
                },
                
                tags
            }
        }`;

        try {
            const url = getSanityUrl(query, { slug });
            console.info('[SuccessStory] Fetching from Sanity:', slug);

            const response = await fetch(url);
            const data = await response.json();

            if (data.result?.story) {
                console.info('[SuccessStory] Story loaded:', data.result.story.name);
                return data.result.story;
            } else {
                console.warn('[SuccessStory] No result from Sanity');
                return null;
            }
        } catch (error) {
            console.error('[SuccessStory] Error fetching:', error);
            return null;
        }
    }

    async function fetchRelatedStories(currentSlug) {
        const query = `*[_type == "testimonialsSection"][0] {
            "stories": testimonials[isFeaturedStory == true && slug.current != $slug][0...2] {
                name,
                "slug": slug.current,
                position,
                organization,
                category,
                "photo": photo.asset->url
            }
        }`;

        try {
            const url = getSanityUrl(query, { slug: currentSlug });
            const response = await fetch(url);
            const data = await response.json();
            return data.result?.stories || [];
        } catch (error) {
            console.error('[SuccessStory] Error fetching related:', error);
            return [];
        }
    }

    // ===========================================
    // RENDER FUNCTIONS
    // ===========================================

    function renderSuccessStory(story) {
        const lang = getCurrentLanguage();

        // Hide loading, show content
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('story-content').style.display = 'block';

        // Get data from new schema structure
        const categoryLabel = getCategoryLabel(story.category, lang);
        const name = story.name || '';

        // Use storyTitle if available, otherwise fallback to name
        const title = lang === 'en'
            ? (story.storyTitleEn || story.storyTitle || name)
            : (story.storyTitle || story.storyTitleEn || name);

        // Use storySubtitle if available, otherwise build from position + organization
        const position = lang === 'en' ? (story.positionEn || story.position) : (story.position || story.positionEn);
        const organization = lang === 'en' ? (story.organizationEn || story.organization) : (story.organization || story.organizationEn);
        const quote = lang === 'en' ? (story.quoteEn || story.quote) : (story.quote || story.quoteEn);

        const subtitle = lang === 'en'
            ? (story.storySubtitleEn || story.storySubtitle || `${position}, ${organization}`)
            : (story.storySubtitle || story.storySubtitleEn || `${position}, ${organization}`);

        // Breadcrumb title
        const breadcrumbTitle = document.getElementById('story-breadcrumb-title');
        if (breadcrumbTitle) {
            breadcrumbTitle.textContent = title;
        }

        // Header - Category badge
        const typeBadge = document.getElementById('story-type-badge');
        if (typeBadge) {
            typeBadge.textContent = categoryLabel.toUpperCase();
        }

        // Header - Title
        const storyTitleEl = document.getElementById('story-title');
        if (storyTitleEl) {
            storyTitleEl.textContent = title;
        }

        // Header - Excerpt/Subtitle
        const storyExcerpt = document.getElementById('story-excerpt');
        if (storyExcerpt) {
            storyExcerpt.textContent = subtitle;
        }

        // Banner Image (use photo as fallback if no bannerImage)
        const bannerContainer = document.getElementById('story-banner-container');
        const bannerImageEl = document.getElementById('story-banner-image');
        const bannerCaptionEl = document.getElementById('story-banner-caption');

        const bannerUrl = story.bannerImage || story.photo;

        if (bannerUrl && bannerContainer && bannerImageEl) {
            bannerImageEl.src = bannerUrl;
            bannerImageEl.alt = story.bannerImageAlt || title;
            bannerContainer.style.display = 'block';

            if (bannerCaptionEl) {
                const captionText = lang === 'en'
                    ? (story.bannerCaptionEn || story.bannerCaption)
                    : (story.bannerCaption || story.bannerCaptionEn);
                if (captionText) {
                    bannerCaptionEl.textContent = captionText;
                    bannerCaptionEl.style.display = 'block';
                } else {
                    bannerCaptionEl.style.display = 'none';
                }
            }
        }

        // Get full story content - bilingual Portable Text
        let fullStoryHtml = '';
        const fullStoryContent = lang === 'en'
            ? (story.fullStoryEn || story.fullStory)
            : (story.fullStory || story.fullStoryEn);

        if (fullStoryContent) {
            if (Array.isArray(fullStoryContent) && fullStoryContent.length > 0) {
                fullStoryHtml = renderPortableText(fullStoryContent, lang);
            } else if (typeof fullStoryContent === 'string') {
                fullStoryHtml = fullStoryContent;
            }
        }

        // Full story content
        const fullStoryElement = document.getElementById('full-story-content');
        if (fullStoryElement) {
            fullStoryElement.innerHTML = fullStoryHtml || `<p>${escapeHtml(quote)}</p>`;
            initializeSlideshows();
        }

        // Tags
        const tagsSection = document.getElementById('story-tags-section');
        const tagsContainer = document.getElementById('story-tags');
        if (tagsContainer && story.tags && story.tags.length > 0) {
            tagsContainer.innerHTML = story.tags.map(tag => `
                <span class="story-tag">${escapeHtml(tag)}</span>
            `).join('');
            if (tagsSection) tagsSection.style.display = 'block';
        }

        // Render Related Sections
        renderRelatedProjects(story.relatedProjects, lang);
        renderRelatedNews(story.relatedNews, lang);
        renderRelatedFactsheets(story.relatedFactsheets, lang);
        renderRelatedPublications(story.relatedPublications, lang);

        // Page title
        document.title = `${title} - ${lang === 'id' ? 'Cerita Sukses' : 'Success Story'} | IREEM`;
    }

    function initializeSlideshows() {
        document.querySelectorAll('.gallery--slideshow').forEach(gallery => {
            const slides = gallery.querySelectorAll('.gallery__slide');
            slides.forEach((slide, i) => {
                slide.style.display = i === 0 ? 'block' : 'none';
            });
        });
    }

    // ===========================================
    // RELATED SECTIONS RENDER FUNCTIONS
    // ===========================================

    function renderRelatedProjects(projects, lang) {
        const section = document.getElementById('related-projects-section');
        const container = document.getElementById('related-projects');
        if (!container || !projects || projects.length === 0) return;

        container.innerHTML = projects.map(item => {
            const title = lang === 'en' ? (item.titleEn || item.title) : item.title;
            const thumbnail = item.bannerImage || '../images/placeholder-project.jpg';
            return `
                <a href="../portfolio/detail.html?slug=${item.slug}" class="related-card">
                    <div class="related-card__image">
                        <img src="${thumbnail}" alt="${escapeHtml(title)}" loading="lazy" onerror="this.src='../images/placeholder-project.jpg'">
                    </div>
                    <div class="related-card__content">
                        <span class="related-card__category">${lang === 'en' ? 'PROJECT' : 'PROYEK'}</span>
                        <h4 class="related-card__title">${escapeHtml(title)}</h4>
                    </div>
                </a>
            `;
        }).join('');

        if (section) section.style.display = 'block';
    }

    function renderRelatedNews(news, lang) {
        const section = document.getElementById('related-news-section');
        const container = document.getElementById('related-news');
        if (!container || !news || news.length === 0) return;

        container.innerHTML = news.map(item => {
            const title = lang === 'en' ? (item.titleEn || item.title) : item.title;
            const thumbnail = item.thumbnail || '../images/placeholder-news.jpg';
            return `
                <a href="../berita/detail.html?slug=${item.slug}" class="related-card">
                    <div class="related-card__image">
                        <img src="${thumbnail}" alt="${escapeHtml(title)}" loading="lazy" onerror="this.src='../images/placeholder-news.jpg'">
                    </div>
                    <div class="related-card__content">
                        <span class="related-card__category">${lang === 'en' ? 'NEWS' : 'BERITA'}</span>
                        <h4 class="related-card__title">${escapeHtml(title)}</h4>
                    </div>
                </a>
            `;
        }).join('');

        if (section) section.style.display = 'block';
    }

    function renderRelatedFactsheets(factsheets, lang) {
        const section = document.getElementById('related-factsheets-section');
        const container = document.getElementById('related-factsheets');
        if (!container || !factsheets || factsheets.length === 0) return;

        container.innerHTML = factsheets.map(item => {
            const title = lang === 'en' ? (item.titleEn || item.title) : item.title;
            const thumbnail = item.thumbnail || '../images/placeholder-factsheet.jpg';
            return `
                <a href="../factsheet/detail.html?slug=${item.slug}" class="related-card">
                    <div class="related-card__image">
                        <img src="${thumbnail}" alt="${escapeHtml(title)}" loading="lazy" onerror="this.src='../images/placeholder-factsheet.jpg'">
                    </div>
                    <div class="related-card__content">
                        <span class="related-card__category">FACTSHEET</span>
                        <h4 class="related-card__title">${escapeHtml(title)}</h4>
                    </div>
                </a>
            `;
        }).join('');

        if (section) section.style.display = 'block';
    }

    function renderRelatedPublications(publications, lang) {
        const section = document.getElementById('related-publications-section');
        const container = document.getElementById('related-publications');
        if (!container || !publications || publications.length === 0) return;

        container.innerHTML = publications.map(item => {
            const title = lang === 'en' ? (item.titleEn || item.title) : item.title;
            const thumbnail = item.thumbnail || '../images/placeholder-publication.jpg';
            return `
                <a href="../publikasi/detail.html?slug=${item.slug}" class="related-card">
                    <div class="related-card__image">
                        <img src="${thumbnail}" alt="${escapeHtml(title)}" loading="lazy" onerror="this.src='../images/placeholder-publication.jpg'">
                    </div>
                    <div class="related-card__content">
                        <span class="related-card__category">${lang === 'en' ? 'PUBLICATION' : 'PUBLIKASI'}</span>
                        <h4 class="related-card__title">${escapeHtml(title)}</h4>
                    </div>
                </a>
            `;
        }).join('');

        if (section) section.style.display = 'block';
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================

    async function loadSuccessStory() {
        const slug = getSlugFromUrl();
        const lang = getCurrentLanguage();

        if (!slug) {
            showError();
            return;
        }

        showLoading();

        const story = await fetchSuccessStory(slug);

        if (!story) {
            showError();
            return;
        }

        currentStory = story;
        renderSuccessStory(story);
    }

    async function init() {
        console.info('[SuccessStory] Initializing...');

        await loadSuccessStory();

        document.addEventListener('languageChanged', loadSuccessStory);

        console.info('[SuccessStory] Initialized successfully');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.SuccessStoryDetail = {
        getStory: () => currentStory,
        refresh: loadSuccessStory
    };
})();
