/**
 * FactSheet Detail Page
 * Loads single factsheet from Sanity CMS and handles lightbox functionality
 */

(function () {
    'use strict';

    // Sanity Configuration
    const SANITY_PROJECT_ID = '1zvl0z92';
    const SANITY_DATASET = 'production';
    const SANITY_API_VERSION = '2023-05-03';

    // Category labels for display
    const CATEGORY_LABELS = {
        energi: { id: 'Energi', en: 'Energy' },
        lingkungan: { id: 'Lingkungan', en: 'Environment' },
        sda: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
        gedsi: { id: 'GEDSI', en: 'GEDSI' }
    };

    let currentFactsheet = null;

    // ===========================================
    // SANITY FETCH FUNCTIONS
    // ===========================================

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

    async function fetchFactsheetBySlug(slug) {
        const query = `*[_type == "factsheet" && slug.current == $slug][0] {
            _id,
            title,
            "slug": slug.current,
            category,
            program,
            publishDate,
            description,
            "thumbnail": thumbnail {
                "url": asset->url,
                alt
            },
            "factsheetPages": factsheetPages[] {
                "url": asset->url,
                alt,
                pageNumber
            },
            tags,
            "projectReference": projectReference-> {
                _id,
                "slug": slug.current,
                title
            },
            "relatedFactsheets": relatedFactsheets[]-> {
                _id,
                "slug": slug.current,
                title,
                category,
                "thumbnail": thumbnail.asset->url
            }
        }`;

        try {
            const url = getSanityUrl(query, { slug });
            console.info('[FactsheetDetail] Fetching from Sanity:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.result) {
                console.info('[FactsheetDetail] Factsheet loaded:', data.result.title);
                return data.result;
            } else {
                console.warn('[FactsheetDetail] No result from Sanity');
                return null;
            }
        } catch (error) {
            console.error('[FactsheetDetail] Error fetching from Sanity:', error);
            return null;
        }
    }

    async function fetchRelatedFactsheets(currentSlug, category) {
        const query = `*[_type == "factsheet" && slug.current != $slug && category == $category][0...3] {
            _id,
            title,
            "slug": slug.current,
            category,
            "thumbnail": coalesce(
                factsheetPages[0].asset->url,
                thumbnail.asset->url
            )
        }`;

        try {
            const url = getSanityUrl(query, { slug: currentSlug, category });
            const response = await fetch(url);

            if (!response.ok) return [];

            const data = await response.json();
            return data.result || [];
        } catch (error) {
            console.error('[FactsheetDetail] Error fetching related:', error);
            return [];
        }
    }

    // ===========================================
    // HELPER FUNCTIONS
    // ===========================================

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

    function formatDate(dateStr, lang) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', options);
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
        document.getElementById('factsheet-content').style.display = 'none';
    }

    // ===========================================
    // RENDER FUNCTIONS
    // ===========================================

    function renderFactsheet(factsheet) {
        const lang = getCurrentLanguage();

        // Hide loading, show content
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('factsheet-content').style.display = 'block';

        // Populate content
        const title = getText(factsheet.title, lang);
        const categoryLabel = getCategoryLabel(factsheet.category, lang);
        const description = getText(factsheet.description, lang);
        const date = formatDate(factsheet.publishDate, lang);
        const program = getText(factsheet.program, lang);

        document.getElementById('factsheet-title').textContent = title;
        document.getElementById('factsheet-category').textContent = categoryLabel;
        document.getElementById('factsheet-date').textContent = date;

        // Multi-page support - render all pages from factsheetPages
        const pagesContainer = document.getElementById('onepager-frame');
        const pages = factsheet.factsheetPages || [];

        if (pages.length === 0) {
            pagesContainer.innerHTML = `
                <div style="padding: 3rem; text-align: center; color: var(--color-muted);">
                    <p>Tidak ada halaman tersedia.</p>
                </div>
            `;
        } else {
            // Clear existing content and render pages
            pagesContainer.innerHTML = pages.map((page, index) => `
                <div class="factsheet-page" data-page="${index + 1}">
                    <div class="page-indicator">Halaman ${index + 1} dari ${pages.length}</div>
                    <img src="${page.url}" alt="${page.alt || title + ' - Halaman ' + (index + 1)}" class="page-image" loading="lazy">
                </div>
            `).join('');

            // Add scroll indicator if multiple pages
            if (pages.length > 1) {
                const firstPage = pagesContainer.querySelector('.factsheet-page');
                if (firstPage) {
                    const scrollIndicator = document.createElement('div');
                    scrollIndicator.className = 'scroll-indicator';
                    scrollIndicator.id = 'scroll-indicator';
                    scrollIndicator.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M19 12l-7 7-7-7"/>
                        </svg>
                        <span>Scroll untuk halaman berikutnya</span>
                    `;
                    firstPage.appendChild(scrollIndicator);
                }

                // Hide scroll indicator when scrolled to bottom
                pagesContainer.addEventListener('scroll', () => {
                    const scrollIndicator = document.getElementById('scroll-indicator');
                    if (scrollIndicator) {
                        const isAtBottom = pagesContainer.scrollTop + pagesContainer.clientHeight >= pagesContainer.scrollHeight - 50;
                        scrollIndicator.style.opacity = isAtBottom ? '0' : '1';
                    }
                });

                // Set container height based on first page image
                const firstImage = pagesContainer.querySelector('.page-image');
                if (firstImage) {
                    const setContainerHeight = () => {
                        const pageIndicator = pagesContainer.querySelector('.page-indicator');
                        const pageIndicatorHeight = pageIndicator?.offsetHeight || 40;
                        const totalHeight = firstImage.offsetHeight + pageIndicatorHeight;
                        pagesContainer.style.maxHeight = totalHeight + 'px';
                    };

                    if (firstImage.complete) {
                        setContainerHeight();
                    } else {
                        firstImage.addEventListener('load', setContainerHeight);
                    }

                    window.addEventListener('resize', () => {
                        setTimeout(setContainerHeight, 100);
                    });
                }
            }

            // Store pages data for lightbox
            const pagesUrls = pages.map(p => p.url);
            pagesContainer.dataset.pages = JSON.stringify(pagesUrls);
            pagesContainer.dataset.currentPage = '0';
        }

        // Sidebar metadata
        document.getElementById('meta-program').textContent = program || '-';
        document.getElementById('meta-date').textContent = date;
        document.getElementById('meta-category').textContent = categoryLabel;
        document.getElementById('meta-description').textContent = description;

        // Update page title
        document.title = `${title} - FactSheet IREEM`;
    }

    async function renderRelated(currentSlug, category, lang) {
        const container = document.getElementById('related-factsheets');
        if (!container) return;

        // First try relatedFactsheets from the factsheet itself
        if (currentFactsheet?.relatedFactsheets && currentFactsheet.relatedFactsheets.length > 0) {
            renderRelatedItems(currentFactsheet.relatedFactsheets, lang, container);
            return;
        }

        // Otherwise fetch related by category
        const related = await fetchRelatedFactsheets(currentSlug, category);

        if (related.length === 0) {
            container.innerHTML = '<p style="color: var(--color-muted); font-size: 0.9rem;">Tidak ada factsheet terkait</p>';
            return;
        }

        renderRelatedItems(related, lang, container);
    }

    function renderRelatedItems(items, lang, container) {
        container.innerHTML = items.map(f => {
            const title = getText(f.title, lang);
            const categoryLabel = getCategoryLabel(f.category, lang);
            const thumbnail = f.thumbnail || '../images/placeholder-factsheet.jpg';

            return `
                <a href="detail.html?slug=${f.slug}" class="related-item">
                    <img src="${thumbnail}" alt="${title}" 
                         onerror="this.src='../images/placeholder-factsheet.jpg'">
                    <div class="related-info">
                        <span class="related-title">${title}</span>
                        <span class="related-category">${categoryLabel}</span>
                    </div>
                </a>
            `;
        }).join('');
    }

    // ===========================================
    // LIGHTBOX FUNCTIONS
    // ===========================================

    function initLightbox() {
        const frame = document.getElementById('onepager-frame');
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const closeBtn = document.querySelector('.lightbox-close');

        if (!frame || !lightbox) return;

        let currentPageIndex = 0;
        let pages = [];

        // Open lightbox when clicking on any page
        frame.addEventListener('click', (e) => {
            const clickedPage = e.target.closest('.factsheet-page');
            if (!clickedPage) return;

            // Get all pages data
            const pagesData = frame.dataset.pages;
            pages = pagesData ? JSON.parse(pagesData) : [];

            // Get clicked page index
            currentPageIndex = parseInt(clickedPage.dataset.page) - 1 || 0;

            // Show image in lightbox
            if (pages[currentPageIndex]) {
                lightboxImage.src = pages[currentPageIndex];
                lightboxImage.alt = `Halaman ${currentPageIndex + 1}`;
                updateLightboxNav();
            }

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Update navigation hint in lightbox
        function updateLightboxNav() {
            let navHint = lightbox.querySelector('.lightbox-nav-hint');
            if (!navHint && pages.length > 1) {
                navHint = document.createElement('div');
                navHint.className = 'lightbox-nav-hint';
                navHint.style.cssText = 'position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:white;padding:0.5rem 1rem;border-radius:8px;font-size:0.85rem;';
                lightbox.querySelector('.lightbox-content').appendChild(navHint);
            }
            if (navHint && pages.length > 1) {
                navHint.textContent = `Halaman ${currentPageIndex + 1} dari ${pages.length} (Gunakan ← → untuk navigasi)`;
            }
        }

        // Navigate pages with arrow keys
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active') || pages.length <= 1) return;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                currentPageIndex = Math.min(currentPageIndex + 1, pages.length - 1);
                lightboxImage.src = pages[currentPageIndex];
                updateLightboxNav();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                currentPageIndex = Math.max(currentPageIndex - 1, 0);
                lightboxImage.src = pages[currentPageIndex];
                updateLightboxNav();
            }
        });

        // Close lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn?.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // ===========================================
    // SHARE & DOWNLOAD FUNCTIONS
    // ===========================================

    function initShare() {
        const shareBtn = document.getElementById('share-btn');
        if (!shareBtn) return;

        shareBtn.addEventListener('click', async () => {
            const title = document.getElementById('factsheet-title').textContent;
            const url = window.location.href;

            if (navigator.share) {
                try {
                    await navigator.share({ title, url });
                } catch (err) {
                    console.log('Share cancelled');
                }
            } else {
                // Fallback: copy to clipboard
                try {
                    await navigator.clipboard.writeText(url);
                    alert('Link berhasil disalin!');
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        });
    }

    function initDownload() {
        const downloadBtn = document.getElementById('download-btn');
        const downloadDropdown = downloadBtn?.closest('.download-dropdown');
        const downloadImages = document.getElementById('download-images');
        const downloadPdf = document.getElementById('download-pdf');

        if (!downloadBtn || !downloadDropdown) return;

        // Toggle dropdown
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!downloadDropdown.contains(e.target)) {
                downloadDropdown.classList.remove('active');
            }
        });

        // Download images
        downloadImages?.addEventListener('click', async () => {
            const frame = document.getElementById('onepager-frame');
            const pagesData = frame.dataset.pages;
            const pages = pagesData ? JSON.parse(pagesData) : [];
            const title = document.getElementById('factsheet-title').textContent;

            downloadImages.classList.add('loading');

            try {
                for (let i = 0; i < pages.length; i++) {
                    const response = await fetch(pages[i]);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const ext = pages[i].split('.').pop().toLowerCase().split('?')[0] || 'png';
                    a.download = `${title.replace(/[^a-zA-Z0-9]/g, '-')}-halaman-${i + 1}.${ext}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    if (i < pages.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            } catch (err) {
                console.error('Download failed:', err);
                alert('Gagal mengunduh gambar. Silakan coba lagi.');
            }

            downloadImages.classList.remove('loading');
            downloadDropdown.classList.remove('active');
        });

        // Download PDF
        downloadPdf?.addEventListener('click', async () => {
            const frame = document.getElementById('onepager-frame');
            const pagesData = frame.dataset.pages;
            const pages = pagesData ? JSON.parse(pagesData) : [];
            const title = document.getElementById('factsheet-title').textContent;

            if (pages.length === 0) {
                alert('Tidak ada halaman untuk diunduh.');
                return;
            }

            downloadPdf.classList.add('loading');

            try {
                const { jsPDF } = window.jspdf;

                const firstImg = await loadImage(pages[0]);
                const imgWidth = firstImg.width;
                const imgHeight = firstImg.height;

                const pdf = new jsPDF({
                    orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
                    unit: 'px',
                    format: [imgWidth, imgHeight]
                });

                for (let i = 0; i < pages.length; i++) {
                    const img = await loadImage(pages[i]);

                    if (i > 0) {
                        pdf.addPage([img.width, img.height], img.width > img.height ? 'landscape' : 'portrait');
                    }

                    pdf.addImage(img.data, 'PNG', 0, 0, img.width, img.height);
                }

                pdf.save(`${title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
            } catch (err) {
                console.error('PDF generation failed:', err);
                alert('Gagal membuat PDF. Silakan coba lagi.');
            }

            downloadPdf.classList.remove('loading');
            downloadDropdown.classList.remove('active');
        });
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve({
                    data: canvas.toDataURL('image/png'),
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================

    async function loadFactsheet() {
        const slug = getSlugFromUrl();
        const lang = getCurrentLanguage();

        if (!slug) {
            showError();
            return;
        }

        showLoading();

        // Fetch from Sanity
        const factsheet = await fetchFactsheetBySlug(slug);

        if (!factsheet) {
            showError();
            return;
        }

        currentFactsheet = factsheet;
        renderFactsheet(factsheet);
        await renderRelated(slug, factsheet.category, lang);
    }

    async function init() {
        console.info('[FactsheetDetail] Initializing...');

        await loadFactsheet();
        initLightbox();
        initShare();
        initDownload();

        // Re-load on language change
        document.addEventListener('languageChanged', loadFactsheet);

        console.info('[FactsheetDetail] Initialized successfully');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for debugging
    window.FactsheetDetail = {
        getFactsheet: () => currentFactsheet,
        refresh: loadFactsheet
    };
})();
