/* ========================================
   IREEM Website - Main JavaScript
   Navigation, JSON Data Loading, Forms
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
  loadFooter(); // Load reusable footer component
  initNavigation();
  initScrollEffects();
  initScrollReveal();
  initCounterAnimation();
  initDataLoaders();
});

/* ----------------------------------------
   Load Footer Component
   ---------------------------------------- */
async function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;

  // Determine path prefix based on current page depth
  const pathDepth = (window.location.pathname.match(/\//g) || []).length;
  const isInSubfolder = window.location.pathname.includes('/about/') ||
    window.location.pathname.includes('/program/') ||
    window.location.pathname.includes('/inovasi/') ||
    window.location.pathname.includes('/impact/') ||
    window.location.pathname.includes('/publikasi/') ||
    window.location.pathname.includes('/kemitraan/');

  const prefix = isInSubfolder ? '../' : '';

  try {
    const response = await fetch(prefix + 'components/footer.html');
    if (!response.ok) throw new Error('Footer not found');

    let footerHtml = await response.text();

    // Adjust paths for subfolder pages
    if (isInSubfolder) {
      footerHtml = footerHtml
        .replace(/src="images\//g, 'src="../images/')
        .replace(/href="program\//g, 'href="../program/')
        .replace(/href="index\.html"/g, 'href="../index.html"');
    }

    footerPlaceholder.innerHTML = footerHtml;
  } catch (error) {
    console.warn('Could not load footer component:', error.message);
  }
}

/* ----------------------------------------
   Navigation
   ---------------------------------------- */
function initNavigation() {
  // New mobile hamburger menu
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a nav link
    const navLinkItems = navLinks.querySelectorAll('.nav-link');
    navLinkItems.forEach(link => {
      link.addEventListener('click', function () {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Old navigation code for backward compatibility
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navItems = document.querySelectorAll('.nav-item');

  // Mobile menu toggle (old code)
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('active');
      this.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Mobile dropdown toggles
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.nav-dropdown');

    if (dropdown && window.innerWidth <= 768) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        item.classList.toggle('active');
      });
    }
  });

  // Close mobile menu on link click (old code)
  document.querySelectorAll('.nav-dropdown a').forEach(link => {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        if (nav) nav.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Set active nav item based on current page
  setActiveNavItem();
}

function setActiveNavItem() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('.html', '').replace('index', ''))) {
      link.classList.add('active');
    }
  });
}

/* ----------------------------------------
   Scroll Effects
   ---------------------------------------- */
function initScrollEffects() {
  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

/* ----------------------------------------
   JSON Data Loaders
   ---------------------------------------- */
function initDataLoaders() {
  // Load Impact Metrics
  const metricsContainer = document.getElementById('metrics-container');
  if (metricsContainer) {
    loadData('impact-metrics.json', metricsContainer, renderMetrics);
  }

  // Load Projects
  const projectsContainer = document.getElementById('projects-container');
  if (projectsContainer) {
    loadData('projects.json', projectsContainer, renderProjects);
  }

  // Load Publications
  const publicationsContainer = document.getElementById('publications-container');
  if (publicationsContainer) {
    loadData('publications.json', publicationsContainer, renderPublications);
  }

  // Load News - ONLY on homepage (not on /berita/ pages which use Sanity)
  const newsContainer = document.getElementById('news-container');
  const isBeritaPage = window.location.pathname.includes('/berita/');
  if (newsContainer && !isBeritaPage) {
    loadData('news.json', newsContainer, renderNews);
  }

  // Load Partners
  const partnersContainer = document.getElementById('partners-container');
  if (partnersContainer) {
    loadData('partners.json', partnersContainer, renderPartners);
  }
}

async function loadData(filename, container, renderFunction) {
  try {
    // Try relative path first, then absolute from root
    let response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      response = await fetch(`../data/${filename}`);
    }
    if (!response.ok) {
      response = await fetch(`../../data/${filename}`);
    }
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    const data = await response.json();
    renderFunction(data, container);
  } catch (error) {
    console.warn(`Could not load ${filename}:`, error.message);
    container.innerHTML = '<p class="fallback">Content is being updated. Please check back soon.</p>';
  }
}

/* ----------------------------------------
   Render Functions
   ---------------------------------------- */
function renderMetrics(data, container) {
  if (!data.metrics || data.metrics.length === 0) {
    container.innerHTML = '<p class="fallback">No metrics available.</p>';
    return;
  }

  const html = data.metrics.map(metric => `
    <div class="metric-card">
      <div class="value">${escapeHtml(metric.value)}</div>
      <div class="label">${escapeHtml(metric.label)}</div>
    </div>
  `).join('');

  container.innerHTML = html;
}

function renderProjects(data, container) {
  if (!data.projects || data.projects.length === 0) {
    container.innerHTML = '<p class="fallback">No projects available.</p>';
    return;
  }

  const html = data.projects.map(project => `
    <article class="project-card">
      <div class="project-card-image">
        ${project.image ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}">` : ''}
      </div>
      <div class="project-card-content">
        <div class="project-card-tags">
          ${project.tags ? project.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('') : ''}
        </div>
        <h4>${escapeHtml(project.title)}</h4>
        <p>${escapeHtml(project.description)}</p>
        ${project.donor ? `<p class="small"><strong>Donor:</strong> ${escapeHtml(project.donor)}</p>` : ''}
        ${project.year ? `<p class="small"><strong>Year:</strong> ${escapeHtml(project.year)}</p>` : ''}
      </div>
    </article>
  `).join('');

  container.innerHTML = html;
}

function renderPublications(data, container) {
  if (!data.publications || data.publications.length === 0) {
    container.innerHTML = '<p class="fallback">No publications available.</p>';
    return;
  }

  const html = data.publications.map(pub => `
    <article class="card">
      <div class="project-card-tags">
        ${pub.type ? `<span class="tag">${escapeHtml(pub.type)}</span>` : ''}
        ${pub.year ? `<span class="tag">${escapeHtml(pub.year)}</span>` : ''}
      </div>
      <h4>${escapeHtml(pub.title)}</h4>
      <p>${escapeHtml(pub.description || '')}</p>
      ${pub.downloadUrl ? `
        <a href="${escapeHtml(pub.downloadUrl)}" class="btn btn-secondary btn-sm" download>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download
        </a>
      ` : ''}
    </article>
  `).join('');

  container.innerHTML = html;
}

function renderNews(data, container) {
  if (!data.news || data.news.length === 0) {
    container.innerHTML = '<p class="fallback">No news available.</p>';
    return;
  }

  const html = data.news.map(item => `
    <article class="card">
      <p class="small text-secondary">${escapeHtml(item.date || '')}</p>
      <h4>${escapeHtml(item.title)}</h4>
      <p>${escapeHtml(item.excerpt || '')}</p>
      ${item.url ? `<a href="${escapeHtml(item.url)}" class="card-link">Read more →</a>` : ''}
    </article>
  `).join('');

  container.innerHTML = html;
}

function renderPartners(data, container) {
  if (!data.partners || data.partners.length === 0) {
    container.innerHTML = '<p class="fallback">Partners information coming soon.</p>';
    return;
  }

  const html = data.partners.map(partner => `
    <img 
      src="${escapeHtml(partner.logo)}" 
      alt="${escapeHtml(partner.name)}" 
      class="partner-logo"
      title="${escapeHtml(partner.name)}"
    >
  `).join('');

  container.innerHTML = html;
}

/* ----------------------------------------
   Utility Functions
   ---------------------------------------- */
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

/* ----------------------------------------
   Form Handling
   ---------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = form.querySelector('.form-message');

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    // Form will be handled by Formspree
    // This is just for UI feedback
  });
}

/* ----------------------------------------
   Filters (for Projects/Publications)
   ---------------------------------------- */
function initFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = this.dataset.filter;
      const target = this.dataset.target;
      const container = document.getElementById(target);

      // Update active state
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      if (container) {
        const items = container.querySelectorAll('[data-category]');
        items.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      }
    });
  });
}

// Initialize filters if present
document.addEventListener('DOMContentLoaded', initFilters);

/* ----------------------------------------
   Scroll Reveal Animation
   ---------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optionally unobserve after revealing
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/* ----------------------------------------
   Counter Animation for Metrics
   ---------------------------------------- */
function initCounterAnimation() {
  // Handle metric cards
  const metricCards = document.querySelectorAll('.metric-card');
  metricCards.forEach(card => {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target.querySelector('.value'));
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(card);
  });

  // Handle standalone .counter elements (homepage, impact page, etc.)
  const counterElements = document.querySelectorAll('.counter[data-target]');
  if (counterElements.length > 0) {
    const countersObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounterWithData(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(counter => {
      countersObserver.observe(counter);
    });
  }
}

// Animate counter using data-target attribute
function animateCounterWithData(element) {
  if (!element) return;

  const target = parseInt(element.getAttribute('data-target')) || 0;
  const prefix = element.getAttribute('data-prefix') || '';
  const suffix = element.getAttribute('data-suffix') || '';
  const duration = 2000;
  const steps = 60;
  const stepDuration = duration / steps;
  const increment = target / steps;

  let currentNumber = 0;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    currentNumber = Math.min(Math.round(increment * currentStep), target);

    // Format number with thousands separator for large numbers
    const formattedNumber = target >= 1000
      ? currentNumber.toLocaleString('id-ID')
      : currentNumber;

    element.textContent = prefix + formattedNumber + suffix;

    if (currentStep >= steps) {
      clearInterval(timer);
      const finalFormatted = target >= 1000
        ? target.toLocaleString('id-ID')
        : target;
      element.textContent = prefix + finalFormatted + suffix;
    }
  }, stepDuration);
}

function animateCounter(element) {
  if (!element) return;

  const text = element.textContent;
  // Extract number from text (handles formats like "500+", "29", "7 Years", etc.)
  const match = text.match(/(\d+)/);

  if (!match) return;

  const targetNumber = parseInt(match[1]);
  const suffix = text.replace(match[0], '').trim();
  const prefix = text.substring(0, text.indexOf(match[0]));
  const duration = 2000; // 2 seconds
  const steps = 60;
  const stepDuration = duration / steps;
  const increment = targetNumber / steps;

  let currentNumber = 0;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    currentNumber = Math.min(Math.round(increment * currentStep), targetNumber);
    element.textContent = prefix + currentNumber + suffix;

    if (currentStep >= steps) {
      clearInterval(timer);
      element.textContent = text; // Restore original text
    }
  }, stepDuration);
}

/* ----------------------------------------
   Parallax Effect (optional)
   ---------------------------------------- */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax');

  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    parallaxElements.forEach(el => {
      const speed = el.dataset.speed || 0.5;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

/* ----------------------------------------
   Smooth Card Stagger Animation
   ---------------------------------------- */
function staggerCards(container) {
  const cards = container.querySelectorAll('.card, .metric-card, .project-card');

  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('reveal');
  });
}
