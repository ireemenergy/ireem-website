/**
 * Innovation Page Translations
 * Bilingual content for inovasi/index.html
 * 
 * @file inovasi.js
 */

(function () {
    'use strict';

    const inovasi = {
        innovation: {
            hero: {
                tagline: { id: 'Aplikasi & Inovasi Digital', en: 'Apps & Digital Innovation' },
                title: { id: 'Teknologi untuk Transparansi Iklim', en: 'Technology for Climate Transparency' },
                subtitle: {
                    id: 'Platform digital yang kami kembangkan untuk mendukung pelaporan dan pemantauan emisi.',
                    en: 'Digital platforms we develop to support emissions reporting and monitoring.'
                }
            },
            akselerasi: {
                label: { id: 'PLATFORM MRV', en: 'MRV PLATFORM' },
                description: {
                    id: 'Platform Evaluasi Efisiensi Nasional - dashboard terintegrasi untuk memantau implementasi kebijakan efisiensi energi di tingkat nasional.',
                    en: 'National Efficiency Evaluation Platform - an integrated dashboard for monitoring the implementation of energy efficiency policies at the national level.'
                },
                feature1: { id: '✓ Dashboard Real-time', en: '✓ Real-time Dashboard' },
                feature2: { id: '✓ Pelaporan Otomatis', en: '✓ Automated Reporting' },
                feature3: { id: '✓ Verifikasi Independen', en: '✓ Independent Verification' },
                cta: { id: 'Kunjungi Platform →', en: 'Visit Platform →' }
            },
            peen: {
                label: { id: 'DASHBOARD ENERGI', en: 'ENERGY DASHBOARD' },
                description: {
                    id: 'Platform Evaluasi Efisiensi Nasional - dashboard terintegrasi untuk memantau implementasi kebijakan efisiensi energi di tingkat nasional.',
                    en: 'National Efficiency Evaluation Platform - an integrated dashboard for monitoring the implementation of energy efficiency policies at the national level.'
                },
                feature1: { id: '✓ Data Agregat Nasional', en: '✓ National Aggregate Data' },
                feature2: { id: '✓ Benchmarking Industri', en: '✓ Industry Benchmarking' },
                feature3: { id: '✓ Proyeksi Penghematan', en: '✓ Savings Projections' },
                cta: { id: 'Lihat Dashboard →', en: 'View Dashboard →' }
            }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(inovasi);
    }

})();
