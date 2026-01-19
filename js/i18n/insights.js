/**
 * Insights Page Translations
 * Text content for insights/wawasan pages
 * 
 * @file insights.js
 */

(function () {
    'use strict';

    const insights = {
        insights: {
            hero: {
                tagline: { id: 'Pusat Pengetahuan', en: 'Knowledge Center' },
                title: { id: 'Wawasan IREEM', en: 'IREEM Insights' },
                subtitle: {
                    id: 'Akses publikasi, factsheet, dan berita terkini seputar efisiensi energi dan manajemen lingkungan.',
                    en: 'Access publications, factsheets, and latest news on energy efficiency and environmental management.'
                }
            },
            publications: {
                subtitle: { id: 'Publikasi & Laporan', en: 'Publications & Reports' },
                heading: { id: 'Publikasi Terbaru', en: 'Latest Publications' },
                viewAll: { id: 'Lihat Semua Publikasi', en: 'View All Publications' }
            },
            factsheets: {
                subtitle: { id: 'FactSheet & Infografis', en: 'FactSheets & Infographics' },
                heading: { id: 'Ringkasan Proyek', en: 'Project Summaries' },
                viewAll: { id: 'Lihat Semua FactSheet', en: 'View All FactSheets' }
            },
            news: {
                subtitle: { id: 'Berita & Update', en: 'News & Updates' },
                heading: { id: 'Berita Terbaru', en: 'Latest News' },
                viewAll: { id: 'Lihat Semua Berita', en: 'View All News' }
            }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(insights);
    }

})();
