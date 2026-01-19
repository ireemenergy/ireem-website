/**
 * Portfolio Page Translations
 * Bilingual text content for Portfolio/Database Proyek page
 * 
 * @file portfolio.js
 */

(function () {
    'use strict';

    const portfolio = {
        portfolio: {
            hero: {
                subtitle: { id: 'Portofolio Proyek', en: 'Project Portfolio' },
                title: { id: 'Rekam Jejak IREEM', en: 'IREEM Track Record' },
                description: {
                    id: 'Sejak 2017, kami telah berkontribusi pada berbagai proyek transisi energi, manajemen lingkungan, dan pembangunan berkelanjutan di seluruh Indonesia.',
                    en: 'Since 2017, we have contributed to various energy transition, environmental management, and sustainable development projects across Indonesia.'
                }
            },
            featured: {
                subtitle: { id: 'Proyek Pilihan', en: 'Selected Projects' },
                title: { id: 'Proyek Unggulan', en: 'Featured Projects' },
                description: { id: 'Proyek-proyek utama yang menunjukkan kapabilitas dan dampak nyata IREEM di lapangan.', en: 'Key projects demonstrating IREEM\'s capabilities and real impact in the field.' }
            },
            database: {
                subtitle: { id: 'Database Proyek', en: 'Project Database' },
                title: { id: 'Semua Proyek IREEM', en: 'All IREEM Projects' },
                description: { id: 'Temukan proyek berdasarkan tahun, sektor, donor, atau jenis aktivitas.', en: 'Find projects by year, sector, donor, or activity type.' }
            },
            filters: {
                year: { id: 'Tahun', en: 'Year' },
                sector: { id: 'Sektor', en: 'Sector' },
                donor: { id: 'Donor', en: 'Donor' },
                activity: { id: 'Aktivitas', en: 'Activity' },
                allYears: { id: 'Semua Tahun', en: 'All Years' },
                allSectors: { id: 'Semua Sektor', en: 'All Sectors' },
                allDonors: { id: 'Semua Donor', en: 'All Donors' },
                allActivities: { id: 'Semua Aktivitas', en: 'All Activities' },
                reset: { id: 'Reset Filter', en: 'Reset Filters' },
                showing: { id: 'Menampilkan:', en: 'Showing:' },
                projects: { id: 'proyek', en: 'projects' }
            },
            cta: {
                title: { id: 'Tertarik Bermitra dengan IREEM?', en: 'Interested in Partnering with IREEM?' },
                description: { id: 'Kami siap mendukung proyek transisi energi dan pembangunan berkelanjutan Anda.', en: 'We are ready to support your energy transition and sustainable development projects.' },
                button: { id: 'Ajukan Kemitraan', en: 'Submit Partnership' }
            }
        },

        // Project Detail Page
        project: {
            // Loading & Error States
            loading: { id: 'Memuat proyek...', en: 'Loading project...' },
            notFound: { id: 'Proyek Tidak Ditemukan', en: 'Project Not Found' },
            notFoundMessage: { id: 'Maaf, proyek yang Anda cari tidak tersedia.', en: 'Sorry, the project you are looking for is not available.' },
            backToList: { id: 'Kembali ke Database Proyek', en: 'Back to Project Database' },

            // Sidebar Labels
            projectInfo: { id: 'INFORMASI PROYEK', en: 'PROJECT INFORMATION' },
            projectName: { id: 'NAMA PROYEK', en: 'PROJECT NAME' },
            donor: { id: 'PENDONOR', en: 'DONOR' },
            period: { id: 'PERIODE', en: 'PERIOD' },
            status: { id: 'STATUS', en: 'STATUS' },
            program: { id: 'PROGRAM', en: 'PROGRAM' },

            // Section Titles
            activities: { id: 'Bentuk Kegiatan', en: 'Activity Types' },
            achievements: { id: 'CAPAIAN UTAMA', en: 'KEY ACHIEVEMENTS' },

            // Related Sections
            relatedProjects: { id: 'Proyek Terkait', en: 'Related Projects' },
            relatedNews: { id: 'Berita Terkait', en: 'Related News' },
            relatedFactsheets: { id: 'FactSheet Terkait', en: 'Related FactSheets' },
            relatedPublications: { id: 'Publikasi Terkait', en: 'Related Publications' },

            // Status Values
            statusCompleted: { id: 'Completed', en: 'Completed' },
            statusOngoing: { id: 'Ongoing', en: 'Ongoing' },

            // Program/Sector Names
            programEnergy: { id: 'Energy', en: 'Energy' },
            programEnvironment: { id: 'Environment', en: 'Environment' },
            programNaturalResources: { id: 'Natural Resources', en: 'Natural Resources' },
            programGedsi: { id: 'GEDSI', en: 'GEDSI' }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(portfolio);
    }

})();
