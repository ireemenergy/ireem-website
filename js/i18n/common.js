/**
 * Common Translations
 * Shared text across all pages: navigation, footer, buttons
 * 
 * @file common.js
 */

(function () {
    'use strict';

    const common = {
        nav: {
            about: { id: 'Tentang IREEM', en: 'About IREEM' },
            program: { id: 'Program', en: 'Programs' },
            portfolio: { id: 'Portofolio', en: 'Portfolio' },
            impact: { id: 'Dampak', en: 'Impact' },
            insights: { id: 'Wawasan', en: 'Insights' },
            publications: { id: 'Publikasi', en: 'Publications' },
            news: { id: 'Berita', en: 'News' },
            factsheet: { id: 'FactSheet', en: 'FactSheet' },
            innovation: { id: 'Aplikasi/Inovasi', en: 'Apps/Innovation' },
            partnership: { id: 'Kemitraan', en: 'Partnership' },
            partnershipCta: { id: 'Ajukan Kemitraan', en: 'Submit Partnership' },
            // Dropdown items - About
            background: { id: 'Latar Belakang & Sejarah', en: 'Background & History' },
            visionMission: { id: 'Visi & Misi', en: 'Vision & Mission' },
            values: { id: 'Nilai-Nilai IREEM', en: 'IREEM Values' },
            team: { id: 'Tim Kami', en: 'Our Team' },
            // Dropdown items - Program
            energy: { id: 'Energi', en: 'Energy' },
            environment: { id: 'Lingkungan', en: 'Environment' },
            naturalResources: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
            gedsi: { id: 'GEDSI', en: 'GEDSI' },
            // Dropdown items - Portfolio
            projectDatabase: { id: 'Database Proyek', en: 'Project Database' },
            // Dropdown items - Impact
            impactStats: { id: 'IREEM dalam Angka', en: 'IREEM in Numbers' },
            successStories: { id: 'Cerita Sukses', en: 'Success Stories' },
            partners: { id: 'Mitra Terpercaya', en: 'Trusted Partners' }
        },
        footer: {
            tagline: {
                id: 'Institute for Management of Natural Resources, Energy and Environment.',
                en: 'Institute for Management of Natural Resources, Energy and Environment.'
            },
            program: { id: 'Program', en: 'Programs' },
            contact: { id: 'Kontak', en: 'Contact' },
            followUs: { id: 'Ikuti Kami', en: 'Follow Us' },
            copyright: { id: '© 2024 IREEM. Hak Cipta Dilindungi.', en: '© 2024 IREEM. All Rights Reserved.' },
            energyClimate: { id: 'Energi & Iklim', en: 'Energy & Climate' },
            environment: { id: 'Lingkungan', en: 'Environment' },
            naturalResources: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
            gesi: { id: 'GEDSI', en: 'GEDSI' }
        },
        units: {
            million: { id: ' Juta', en: ' Million' },
            billion: { id: ' Miliar', en: ' Billion' }
        },
        buttons: {
            readMore: { id: 'Selengkapnya', en: 'Read More' },
            learnMore: { id: 'Pelajari Lebih Lanjut', en: 'Learn More' },
            viewAll: { id: 'Lihat Semua', en: 'View All' },
            explorePrograms: { id: 'Jelajahi Program', en: 'Explore Programs' },
            viewImpact: { id: 'Lihat Jejak Dampak', en: 'View Impact' },
            readFullProfile: { id: 'Baca Profil Lengkap', en: 'Read Full Profile' },
            viewReport: { id: 'Lihat Laporan Dampak', en: 'View Impact Report' },
            back: { id: 'Kembali', en: 'Back' },
            download: { id: 'Unduh', en: 'Download' },
            share: { id: 'Bagikan', en: 'Share' }
        },
        news: {
            breadcrumbHome: { id: 'Beranda', en: 'Home' },
            byAuthor: { id: 'Oleh', en: 'By' },
            share: { id: 'Bagikan', en: 'Share' },
            relatedArticles: { id: 'Artikel Terkait', en: 'Related Articles' },
            noRelatedArticles: { id: 'Tidak ada artikel terkait.', en: 'No related articles.' },
            readMore: { id: 'Baca Selengkapnya', en: 'Read More' },
            articleNotFound: { id: 'Artikel Tidak Ditemukan', en: 'Article Not Found' },
            backToNews: { id: 'Kembali ke Berita', en: 'Back to News' }
        },
        newsPage: {
            tagline: { id: 'Berita & Update', en: 'News & Updates' },
            title: { id: 'Kabar Terbaru dari IREEM', en: 'Latest News from IREEM' },
            subtitle: { id: 'Ikuti perkembangan proyek, acara, dan publikasi terbaru kami.', en: 'Follow our latest projects, events, and publications.' },
            loading: { id: 'Memuat berita...', en: 'Loading news...' }
        },
        pagination: {
            previous: { id: 'Sebelumnya', en: 'Previous' },
            next: { id: 'Selanjutnya', en: 'Next' }
        },
        misc: {
            loading: { id: 'Memuat...', en: 'Loading...' },
            error: { id: 'Terjadi kesalahan', en: 'An error occurred' },
            noData: { id: 'Tidak ada data', en: 'No data available' },
            clickToView: { id: 'Klik untuk melihat profil lengkap', en: 'Click to view full profile' }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(common);
    }

})();

