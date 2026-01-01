/**
 * Component Include System
 * 
 * Loads reusable HTML components (header, footer) into pages.
 * Uses absolute paths for consistent behavior across all page depths.
 * 
 * CMS-Ready: This pattern can easily integrate with Sanity.io
 * by replacing fetch() with sanityClient.fetch() queries.
 * 
 * @file include.js
 */

document.addEventListener('DOMContentLoaded', function () {
    // Load header and footer components
    loadComponent('#site-header', '/components/header.html', setActiveNav);
    loadComponent('#site-footer', '/components/footer.html');
});

/**
 * Load an HTML component into a container element
 * 
 * @param {string} selector - CSS selector for the container
 * @param {string} url - Path to the component HTML file
 * @param {Function} callback - Optional callback after component loads
 */
async function loadComponent(selector, url, callback) {
    const container = document.querySelector(selector);

    // Exit if container doesn't exist on this page
    if (!container) {
        return;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to load component: ${url}`);
        }

        const html = await response.text();
        container.innerHTML = html;

        // Execute callback if provided
        if (typeof callback === 'function') {
            callback();
        }

    } catch (error) {
        console.error('Component loading error:', error);
        // Graceful fallback - show minimal content
        container.innerHTML = `
            <div style="padding: 1rem; text-align: center; color: #666;">
                Component could not be loaded
            </div>
        `;
    }
}

/**
 * Set active navigation link based on current URL path
 * 
 * Automatically adds 'active' class to the nav link
 * that matches the current page's directory.
 */
function setActiveNav() {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Skip home link for non-root paths
        if (href === '/' || href === '/index.html') {
            if (path === '/' || path === '/index.html') {
                link.classList.add('active');
            }
            return;
        }

        // Check if current path starts with link's href
        // This handles both directory (/about/) and file (/about/team.html) matches
        if (path.startsWith(href) || path.startsWith(href.replace(/\/$/, ''))) {
            link.classList.add('active');
        }
    });
}
