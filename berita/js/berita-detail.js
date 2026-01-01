/**
 * IREEM News Article Loader - Sanity CMS Integration
 * 
 * Fetches article content from Sanity headless CMS
 * Usage: detail.html?slug=article-slug
 * 
 * @author IREEM Development Team
 * @version 2.0 - Sanity CMS Integration
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

        // Encode query
        const encodedQuery = encodeURIComponent(query);

        // Build params string
        let paramsString = '';
        for (const [key, value] of Object.entries(params)) {
            paramsString += `&$${key}="${encodeURIComponent(value)}"`;
        }

        return `${baseUrl}?query=${encodedQuery}${paramsString}`;
    }

    // ===========================================
    // LANGUAGE SUPPORT (Bilingual)
    // ===========================================

    /**
     * Get current language from i18n system
     * Falls back to 'id' if not available
     */
    function getCurrentLanguage() {
        return window.IREEM_i18n?.currentLanguage || localStorage.getItem('ireem_lang') || 'id';
    }

    /**
     * Get text from bilingual field with fallback
     * @param {Object} field - Bilingual object {id: '...', en: '...'}
     * @param {string} lang - Current language ('id' or 'en')
     * @returns {string} - Text in requested language or fallback to Indonesian
     */
    function getText(field, lang) {
        if (!field) return '';
        // If it's a string (old format), return as-is
        if (typeof field === 'string') return field;
        // New bilingual format
        return field[lang] || field.id || '';
    }

    /**
     * Get content blocks from bilingual field
     * @param {Object} contentField - Bilingual content object {id: [...], en: [...]}
     * @param {string} lang - Current language
     * @returns {Array} - Content blocks array
     */
    function getContent(contentField, lang) {
        if (!contentField) return [];
        // If it's an array (old format), return as-is
        if (Array.isArray(contentField)) return contentField;
        // New bilingual format
        return contentField[lang] || contentField.id || [];
    }

    // ===========================================
    // DOM ELEMENTS
    // ===========================================
    const loadingEl = document.getElementById('news-loading');
    const errorEl = document.getElementById('news-error');
    const containerEl = document.getElementById('news-container');

    // Get slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    // ===========================================
    // PORTABLE TEXT RENDERER
    // Compatible with article.css classes
    // ===========================================

    // Store markDefs for link resolution
    let currentMarkDefs = [];

    // Store current language for portable text rendering
    let currentRenderLanguage = 'id';

    /**
     * Render Sanity Portable Text to HTML
     * Outputs HTML compatible with article.css
     * @param {Array} blocks - Array of portable text blocks
     * @param {string} lang - Current language for bilingual fields
     */
    function renderPortableText(blocks, lang = 'id') {
        if (!blocks || !Array.isArray(blocks)) {
            return '';
        }

        // Store language for use in nested functions
        currentRenderLanguage = lang;

        let html = '';
        let inList = false;
        let listType = '';

        blocks.forEach((block, index) => {
            // Get markDefs from block for link resolution
            if (block.markDefs) {
                currentMarkDefs = block.markDefs;
            }

            // Handle different block types
            switch (block._type) {
                case 'block':
                    // Handle list grouping
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
                    html += renderImage(block, '', lang);
                    break;
                case 'quoteBlock':
                    // Custom quote block with cite support
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
                    console.warn('[PT Renderer] Unknown block type:', block._type);
            }
        });

        // Close any open list
        if (inList) {
            html += `</${listType}>`;
        }

        return html;
    }

    /**
     * Render image gallery block with layout support
     * Layouts: grid, carousel, slideshow
     */
    function renderImageGallery(block, lang = 'id') {
        if (!block.images || !Array.isArray(block.images)) return '';

        const layout = block.layout || 'grid';
        const galleryId = 'gallery-' + Math.random().toString(36).substr(2, 9);

        // Build image items HTML
        const imageItems = block.images.map((item, index) => {
            // Try different URL sources
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

        // Layout-specific wrapper
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

                const slides = block.images.map((item, index) => {
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

    /**
     * Render YouTube embed block
     * Extracts video ID from various YouTube URL formats
     */
    function renderYouTubeEmbed(block, lang = 'id') {
        const url = block.url || '';
        const caption = getText(block.caption, lang);

        // Extract YouTube video ID
        const videoId = extractYouTubeId(url);

        if (!videoId) {
            console.warn('[PT Renderer] Invalid YouTube URL:', url);
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

    /**
     * Extract YouTube video ID from various URL formats
     * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
     */
    function extractYouTubeId(url) {
        if (!url) return '';
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
        return match ? match[1] : '';
    }

    /**
     * Render custom quoteBlock with quote text and cite
     * Supports bilingual quote and cite fields
     * Outputs: <blockquote class="news-article__quote"><p><em>quote</em></p><cite>cite</cite></blockquote>
     */
    function renderQuoteBlock(block, lang = 'id') {
        // Support bilingual quote/cite fields
        const quoteText = escapeHtml(getText(block.text || block.quote, lang) || '');
        const citeText = escapeHtml(getText(block.cite || block.source, lang) || '');

        let html = '<blockquote class="news-article__quote">';

        if (quoteText) {
            html += `<p><em>${quoteText}</em></p>`;
        }

        if (citeText) {
            html += `<cite>— ${citeText}</cite>`;
        }

        html += '</blockquote>';
        return html;
    }

    /**
     * Render a single block (paragraph, heading, blockquote, list item)
     */
    function renderBlock(block) {
        const style = block.style || 'normal';
        const children = renderChildren(block.children || [], block.markDefs || []);

        // Handle list items
        if (block.listItem) {
            return `<li>${children}</li>`;
        }

        // Handle different block styles
        switch (style) {
            case 'h1':
                return `<h1>${children}</h1>`;
            case 'h2':
                return `<h2>${children}</h2>`;
            case 'h3':
                return `<h3>${children}</h3>`;
            case 'h4':
                return `<h4>${children}</h4>`;
            case 'blockquote':
                // Use news-article__quote class from article.css
                return `<blockquote class="news-article__quote"><p>${children}</p></blockquote>`;
            case 'normal':
            default:
                return children ? `<p>${children}</p>` : '';
        }
    }

    /**
     * Render children (text spans with marks)
     * Handles strong, em, links, button decorator, etc.
     */
    function renderChildren(children, markDefs = []) {
        return children.map(child => {
            if (child._type !== 'span') {
                return child.text || '';
            }

            let text = escapeHtml(child.text || '');
            if (!text) return '';

            // Track if already wrapped in button (to avoid double wrapping)
            let isButtonWrapped = false;

            // Apply marks (bold, italic, links, etc.)
            const marks = child.marks || [];

            marks.forEach(markKey => {
                // Standard decorator marks
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
                    case 'button':
                        // Button decorator - wrap in btn-link styled span
                        // This is used when there's no link, just button styling
                        if (!isButtonWrapped) {
                            text = `<span class="btn-link" style="cursor: default;">
                                ${text}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </span>`;
                            isButtonWrapped = true;
                        }
                        break;
                    default:
                        // Check if it's a link reference (markDef key)
                        const linkDef = markDefs.find(def => def._key === markKey);
                        if (linkDef && linkDef._type === 'link' && linkDef.href) {
                            const href = escapeHtml(linkDef.href);
                            const isExternal = href.startsWith('http');
                            // Check for isButton flag OR button mark on same text
                            const isButton = linkDef.isButton === true || marks.includes('button');

                            if (isButton && !isButtonWrapped) {
                                // CTA button style from article.css
                                text = `<a href="${href}" class="btn-link"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>
                                    ${text}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </a>`;
                                isButtonWrapped = true;
                            } else if (!isButtonWrapped) {
                                // Regular link
                                text = `<a href="${href}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
                            }
                        }
                        break;
                }
            });

            return text;
        }).join('');
    }

    /**
     * Build Sanity image CDN URL from asset reference
     * Format: image-{id}-{dimensions}.{format}
     * Example: image-abc123-800x600-jpg -> https://cdn.sanity.io/images/{projectId}/{dataset}/abc123-800x600.jpg
     */
    function sanityImageUrl(ref) {
        if (!ref) return '';

        // Parse the asset reference
        // Format: image-{id}-{width}x{height}-{format}
        const parts = ref.replace('image-', '').split('-');
        if (parts.length < 2) return '';

        const id = parts[0];
        const dimensions = parts.length > 2 ? parts.slice(1, -1).join('-') : '';
        const format = parts[parts.length - 1];

        // Build CDN URL
        const projectId = SANITY_CONFIG.projectId;
        const dataset = SANITY_CONFIG.dataset;

        if (dimensions) {
            return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
        } else {
            return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}`;
        }
    }

    /**
     * Render image block with article.css classes
     * Handles both asset.url (resolved) and asset._ref (needs CDN URL)
     * Supports bilingual caption
     */
    function renderImage(block, articleTitle = '', lang = 'id') {
        // Try to get URL from different sources
        let url = '';

        if (block.asset?.url) {
            // URL already resolved by GROQ
            url = block.asset.url;
        } else if (block.asset?._ref) {
            // Need to build CDN URL from reference
            url = sanityImageUrl(block.asset._ref);
        }

        if (!url) {
            console.warn('[PT Renderer] Image block missing asset URL:', block);
            return '';
        }

        const alt = escapeHtml(getText(block.alt, lang) || articleTitle || '');
        // Support bilingual caption
        const caption = getText(block.caption, lang) || '';

        // Use news-article__image class from article.css
        let html = `<figure class="news-article__image">
            <img src="${url}" alt="${alt}" loading="lazy">`;

        if (caption) {
            // Use news-article__caption class from article.css
            html += `<figcaption class="news-article__caption">${escapeHtml(caption)}</figcaption>`;
        }

        html += '</figure>';
        return html;
    }

    /**
     * Escape HTML special characters
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===========================================
    // ARTICLE LOADING
    // ===========================================

    /**
     * Initialize article loading
     */
    function init() {
        if (!slug) {
            showError('URL artikel tidak valid.');
            return;
        }

        loadArticle(slug);
    }

    /**
     * Fetch article from Sanity CMS
     */
    async function loadArticle(articleSlug) {
        // GROQ Query for single article - bilingual fields support
        const query = `*[_type == "news" && slug.current == $slug][0]{
            title,
            date,
            publishedAt,
            excerpt,
            "slug": slug.current,
            category,
            tags,
            "author": author {
                name,
                initials
            },
            coverImage{
                asset->{url},
                caption,
                alt
            },
            content,
            relatedArticles[] {
                isAccent,
                "article": article-> {
                    _id,
                    "slug": slug.current,
                    title,
                    excerpt,
                    publishedAt,
                    category,
                    "coverImageUrl": coverImage.asset->url
                }
            }
        }`;

        try {
            const url = getSanityUrl(query, { slug: articleSlug });
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const article = data.result;

            if (!article) {
                showError('Berita tidak ditemukan.');
                return;
            }

            renderArticle(article);
            // Store article for language change re-render
            window._currentArticle = article;
            // Debug: log related articles data
            console.log('[Berita Detail] Related articles from Sanity:', article.relatedArticles);
            // Render related articles from the same query result
            renderRelatedArticles(article.relatedArticles || [], article.slug);

        } catch (error) {
            console.error('Error loading article from Sanity:', error);
            showError('Gagal memuat berita. Silakan coba lagi nanti.');
        }
    }


    // ===========================================
    // RENDERING
    // ===========================================

    /**
     * Render article content to the page
     * Supports bilingual content with fallback to Indonesian
     */
    function renderArticle(article) {
        const lang = getCurrentLanguage();

        // Get bilingual text
        const title = getText(article.title, lang);
        const excerpt = getText(article.excerpt, lang);
        const category = article.category || 'Berita';
        const coverCaption = getText(article.coverImage?.caption, lang);

        // Get content blocks for current language
        const contentBlocks = getContent(article.content, lang);

        // Update page title
        document.title = (title || 'Artikel') + ' - IREEM';

        // Category
        setTextContent('news-category', category);

        // Title
        setTextContent('news-title', title || 'Judul Tidak Tersedia');

        // Excerpt
        setTextContent('news-excerpt', excerpt);

        // Author info - use embedded Sanity data with fallback
        const authorName = article.author?.name || 'Tim IREEM';
        // Use initials from Sanity, or generate from name, fallback to 'TI'
        let authorInitials = 'TI';
        if (article.author?.initials) {
            authorInitials = article.author.initials.substring(0, 2).toUpperCase();
        } else if (authorName && authorName !== 'Tim IREEM') {
            authorInitials = getInitials(authorName);
        }
        setTextContent('news-author-initials', authorInitials);
        setTextContent('news-author-name', authorName);

        // Date - use publishedAt (with time) first, fallback to date (without time)
        let formattedDate = '';
        if (article.publishedAt) {
            formattedDate = formatDateTime(article.publishedAt, lang);
        } else if (article.date) {
            formattedDate = formatDate(article.date, lang);
        }
        const publishedLabel = lang === 'en' ? 'Published ' : 'Diterbitkan ';
        setTextContent('news-date', formattedDate ? publishedLabel + formattedDate : '');

        // Cover/Banner image
        const bannerImg = document.getElementById('news-banner-image');
        if (bannerImg) {
            if (article.coverImage?.asset?.url) {
                bannerImg.src = article.coverImage.asset.url;
                bannerImg.alt = article.coverImage.alt || title;
            } else {
                // Hide banner if no image
                bannerImg.parentElement.style.display = 'none';
            }
        }
        setTextContent('news-banner-caption', coverCaption);

        // Main content (Portable Text) - bilingual
        const contentEl = document.getElementById('news-content');
        if (contentEl && contentBlocks.length > 0) {
            contentEl.innerHTML = renderPortableText(contentBlocks, lang);
        }

        // Show content, hide loading
        if (loadingEl) loadingEl.style.display = 'none';
        if (containerEl) containerEl.style.display = 'block';
    }

    /**
     * Render related articles in sidebar
     * Supports bilingual titles
     * Updated to match Sanity schema: relatedArticles[].article->
     */
    function renderRelatedArticles(relatedItems, currentSlug) {
        const relatedEl = document.getElementById('news-related');
        if (!relatedEl) return;

        const lang = getCurrentLanguage();

        // Filter out current article and invalid entries, limit to 3
        // New structure: item.article contains the referenced article data
        const validArticles = (relatedItems || [])
            .filter(item => item?.article && item.article.slug !== currentSlug)
            .slice(0, 3);

        if (validArticles.length === 0) {
            const noArticlesText = lang === 'en' ? 'No related articles.' : 'Tidak ada artikel terkait.';
            relatedEl.innerHTML = `<p style="color: var(--color-muted); font-size: var(--text-sm);">${noArticlesText}</p>`;
            return;
        }

        let html = '';
        validArticles.forEach((item) => {
            const article = item.article;
            const title = getText(article.title, lang);
            const dateField = article.publishedAt;
            const formattedDate = dateField ? formatDate(dateField, lang) : '';

            html += `
                <div class="related-article${item.isAccent ? ' related-article--accent' : ''}">
                    <p class="related-article__date">${formattedDate}</p>
                    <a href="detail.html?slug=${article.slug}" class="related-article__title">${escapeHtml(title)}</a>
                </div>
            `;
        });

        relatedEl.innerHTML = html;
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================

    /**
     * Format date to locale (without time)
     * @param {string} dateString - ISO date string
     * @param {string} lang - Language code ('id' or 'en')
     */
    function formatDate(dateString, lang = 'id') {
        try {
            const date = new Date(dateString);
            const locale = lang === 'en' ? 'en-US' : 'id-ID';
            return date.toLocaleDateString(locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    /**
     * Format datetime to locale with time (HH:mm)
     * @param {string} dateString - ISO datetime string
     * @param {string} lang - Language code ('id' or 'en')
     */
    function formatDateTime(dateString, lang = 'id') {
        try {
            const date = new Date(dateString);
            const locale = lang === 'en' ? 'en-US' : 'id-ID';
            const dateFormatted = date.toLocaleDateString(locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            const timeFormatted = date.toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            const timezone = lang === 'en' ? 'WIB' : 'WIB';
            return `${dateFormatted} • ${timeFormatted} ${timezone}`;
        } catch (e) {
            return dateString;
        }
    }

    /**
     * Get initials from name
     */
    function getInitials(name) {
        if (!name) return 'IR';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    /**
     * Show error state
     */
    function showError(message) {
        if (loadingEl) loadingEl.style.display = 'none';
        if (containerEl) containerEl.style.display = 'none';

        if (errorEl) {
            const messageEl = errorEl.querySelector('.news-error__message');
            if (messageEl && message) {
                messageEl.textContent = message;
            }
            errorEl.style.display = 'block';
        }
    }

    /**
     * Helper: Set text content with null check
     */
    function setTextContent(elementId, text) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = text || '';
        }
    }

    // ===========================================
    // LANGUAGE CHANGE LISTENER
    // ===========================================

    // Re-render article when language changes
    document.addEventListener('languageChange', () => {
        if (window._currentArticle) {
            renderArticle(window._currentArticle);
            renderRelatedArticles(window._currentArticle.relatedArticles || [], window._currentArticle.slug);
        }
    });

    // ===========================================
    // INITIALIZATION
    // ===========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

/**
 * Share article function (global)
 */
function shareArticle() {
    const title = document.title;
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.log);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Link artikel telah disalin!');
        }).catch(() => {
            // Fallback for older browsers
            prompt('Salin link artikel:', url);
        });
    }
}

/**
 * Scroll carousel gallery (global function)
 * @param {string} galleryId - Gallery element ID
 * @param {number} direction - -1 for previous, 1 for next
 */
function scrollGallery(galleryId, direction) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;

    const track = gallery.querySelector('.gallery__track');
    if (!track) return;

    const scrollAmount = 320; // Card width + gap
    track.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

/**
 * Change slideshow slide (global function)
 * @param {string} galleryId - Gallery element ID
 * @param {number} direction - -1 for previous, 1 for next
 */
function changeSlide(galleryId, direction) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;

    const slides = gallery.querySelectorAll('.gallery__slide');
    const slidesContainer = gallery.querySelector('.gallery__slides');
    const dots = gallery.querySelectorAll('.gallery__dot');

    if (!slides.length || !slidesContainer) return;

    let current = parseInt(gallery.dataset.current || '0');
    current += direction;

    // Wrap around
    if (current < 0) current = slides.length - 1;
    if (current >= slides.length) current = 0;

    gallery.dataset.current = current;
    slidesContainer.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('gallery__dot--active', i === current);
    });

    // Adjust container height to current slide
    adjustSlideshowHeight(gallery, current);
}

/**
 * Go to specific slide (global function)
 * @param {string} galleryId - Gallery element ID
 * @param {number} index - Slide index (0-based)
 */
function goToSlide(galleryId, index) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;

    const slides = gallery.querySelectorAll('.gallery__slide');
    const slidesContainer = gallery.querySelector('.gallery__slides');
    const dots = gallery.querySelectorAll('.gallery__dot');

    if (!slides.length || !slidesContainer || index < 0 || index >= slides.length) return;

    gallery.dataset.current = index;
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('gallery__dot--active', i === index);
    });

    // Adjust container height to current slide
    adjustSlideshowHeight(gallery, index);
}

/**
 * Adjust slideshow container height to match current slide's image
 * @param {HTMLElement} gallery - Gallery container element
 * @param {number} index - Current slide index
 */
function adjustSlideshowHeight(gallery, index) {
    const slides = gallery.querySelectorAll('.gallery__slide');
    const slidesContainer = gallery.querySelector('.gallery__slides');

    if (!slides[index] || !slidesContainer) return;

    const currentSlide = slides[index];
    const img = currentSlide.querySelector('img');

    if (img) {
        // If image is already loaded, set height immediately
        if (img.complete) {
            slidesContainer.style.height = img.offsetHeight + 'px';
        } else {
            // Wait for image to load
            img.onload = () => {
                slidesContainer.style.height = img.offsetHeight + 'px';
            };
        }
    }
}

/**
 * Initialize all slideshows to set initial height
 */
document.addEventListener('DOMContentLoaded', () => {
    const slideshows = document.querySelectorAll('.gallery--slideshow');
    slideshows.forEach(gallery => {
        const firstImg = gallery.querySelector('.gallery__slide:first-child img');
        if (firstImg) {
            if (firstImg.complete) {
                const slidesContainer = gallery.querySelector('.gallery__slides');
                if (slidesContainer) {
                    slidesContainer.style.height = firstImg.offsetHeight + 'px';
                }
            } else {
                firstImg.onload = () => {
                    const slidesContainer = gallery.querySelector('.gallery__slides');
                    if (slidesContainer) {
                        slidesContainer.style.height = firstImg.offsetHeight + 'px';
                    }
                };
            }
        }
    });
});
