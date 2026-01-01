/**
 * i18n Core Engine
 * Global language management system for IREEM website
 * 
 * @file index.js
 * @version 1.0
 */

(function (global) {
    'use strict';

    const STORAGE_KEY = 'ireem_lang';
    const DEFAULT_LANG = 'id';
    const SUPPORTED_LANGS = ['id', 'en'];

    // Translation registry - populated by page-specific modules
    let translations = {};

    /**
     * Get current language from localStorage
     * @returns {string} 'id' or 'en'
     */
    function getCurrentLang() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGS.includes(stored)) {
            return stored;
        }
        return DEFAULT_LANG;
    }

    /**
     * Set language and dispatch event
     * @param {string} lang - 'id' or 'en'
     */
    function setLang(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) {
            console.warn(`[i18n] Unsupported language: ${lang}, falling back to ${DEFAULT_LANG}`);
            lang = DEFAULT_LANG;
        }

        localStorage.setItem(STORAGE_KEY, lang);

        // Update html lang attribute
        document.documentElement.lang = lang;

        // Dispatch event BEFORE translations (for components that need to prepare)
        document.dispatchEvent(new CustomEvent('languageChange', {
            detail: { lang }
        }));

        // Apply translations to all data-i18n elements
        applyTranslations();

        // Update language switcher UI
        updateSwitcherUI(lang);

        // Dispatch event AFTER translations are applied (for dynamic re-renders)
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { lang }
        }));

        console.info(`[i18n] Language changed to: ${lang}`);
    }

    /**
     * Register translations from a module
     * @param {Object} translationModule - Object with translation keys
     */
    function registerTranslations(translationModule) {
        translations = deepMerge(translations, translationModule);
    }

    /**
     * Deep merge two objects
     */
    function deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    }

    /**
     * Get translation by dot-notation key path
     * Safe fallback to Indonesian or empty string
     * @param {string} keyPath - Dot notation key (e.g., 'hero.title')
     * @returns {string} Translated text
     */
    function t(keyPath) {
        const lang = getCurrentLang();
        const keys = keyPath.split('.');
        let value = translations;

        // Navigate to nested key
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                // Key not found
                console.warn(`[i18n] Missing key: ${keyPath}`);
                return '';
            }
        }

        // Value should be an object with 'id' and 'en' keys
        if (value && typeof value === 'object') {
            // Return requested language or fallback to Indonesian
            return value[lang] || value['id'] || '';
        }

        // Direct string value (shouldn't happen but handle gracefully)
        if (typeof value === 'string') {
            return value;
        }

        return '';
    }

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    function applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = t(key);

            if (translated) {
                // Check if element has data-i18n-attr for attribute translation
                const attr = el.getAttribute('data-i18n-attr');
                if (attr) {
                    el.setAttribute(attr, translated);
                } else {
                    el.textContent = translated;
                }
            }
        });

        // Handle counter suffix translations (data-i18n-suffix)
        const suffixElements = document.querySelectorAll('[data-i18n-suffix]');
        suffixElements.forEach(el => {
            const key = el.getAttribute('data-i18n-suffix');
            const translated = t(key);
            if (translated) {
                el.setAttribute('data-suffix', translated);
                // If counter has already run, update the text
                const current = el.textContent;
                if (current && !current.includes('0')) {
                    // Re-trigger counter update by forcing suffix
                    const prefix = el.getAttribute('data-prefix') || '';
                    const target = el.getAttribute('data-target');
                    if (target) {
                        el.textContent = prefix + target + translated;
                    }
                }
            }
        });

        // Also apply to elements with data-i18n-html for HTML content
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const translated = t(key);
            if (translated) {
                el.innerHTML = translated;
            }
        });
    }

    /**
     * Update language switcher button states
     * @param {string} lang - Current language
     */
    function updateSwitcherUI(lang) {
        const buttons = document.querySelectorAll('.lang-switcher [data-lang]');
        buttons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Initialize language switcher event handlers
     */
    function initSwitcher() {
        document.addEventListener('click', function (e) {
            const langBtn = e.target.closest('.lang-switcher [data-lang]');
            if (langBtn) {
                e.preventDefault();
                const lang = langBtn.getAttribute('data-lang');
                setLang(lang);
            }
        });
    }

    /**
     * Initialize i18n system
     */
    function init() {
        // Set initial language from storage or default
        const currentLang = getCurrentLang();
        document.documentElement.lang = currentLang;

        // Initialize switcher handlers
        initSwitcher();

        // Apply initial translations after a small delay to ensure DOM is ready
        setTimeout(() => {
            applyTranslations();
            updateSwitcherUI(currentLang);
        }, 0);

        console.info(`[i18n] Initialized with language: ${currentLang}`);
    }

    // Expose to global scope
    global.i18n = {
        get currentLang() { return getCurrentLang(); },
        getCurrentLang,
        setLang,
        t,
        registerTranslations,
        applyTranslations,
        init
    };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window);
