/**
 * Factsheet Page Translations
 * Bilingual text content for Factsheet page
 * 
 * @file factsheet.js
 */

(function () {
    'use strict';

    const factsheet = {
        // Wrapper to match HTML data-i18n="factsheet.*" keys
        factsheet: {
            // Hero Section
            hero: {
                tagline: { id: 'WAWASAN VISUAL', en: 'VISUAL INSIGHTS' },
                title: { id: 'FactSheet IREEM', en: 'IREEM FactSheets' },
                subtitle: {
                    id: 'Rangkuman visual satu halaman dari proyek dan capaian IREEM',
                    en: 'One-page visual summaries of IREEM projects and achievements'
                }
            },

            // Filter Section
            filter: {
                all: { id: 'Semua', en: 'All' },
                energy: { id: 'Energi', en: 'Energy' },
                environment: { id: 'Lingkungan', en: 'Environment' },
                resources: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
                gedsi: { id: 'GEDSI', en: 'GEDSI' }
            },

            // Empty State
            empty: { id: 'Belum ada factsheet untuk kategori ini', en: 'No factsheets available for this category' },

            // Card Actions
            card: {
                view: { id: 'Lihat Detail', en: 'View Details' },
                download: { id: 'Unduh PDF', en: 'Download PDF' }
            },

            // Detail Page
            detail: {
                backToList: { id: 'Kembali ke Daftar', en: 'Back to List' },
                download: { id: 'Unduh FactSheet', en: 'Download FactSheet' },
                share: { id: 'Bagikan', en: 'Share' },
                relatedFactsheets: { id: 'FactSheet Terkait', en: 'Related FactSheets' },
                loading: { id: 'Memuat factsheet...', en: 'Loading factsheet...' },
                notFound: { id: 'FactSheet tidak ditemukan', en: 'FactSheet not found' }
            }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(factsheet);
    }

})();
