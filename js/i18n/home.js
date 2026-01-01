/**
 * Homepage Translations
 * Text content specific to index.html
 * 
 * @file home.js
 */

(function () {
    'use strict';

    const home = {
        hero: {
            tagline: {
                id: 'Institute for Natural Resources, Energy, and Environmental Management',
                en: 'Institute for Natural Resources, Energy, and Environmental Management'
            },
            title: {
                id: 'Menjembatani Sains, Kebijakan, dan Aksi Iklim di Indonesia.',
                en: 'Bridging Science, Policy, and Climate Action in Indonesia.'
            },
            subtitle: {
                id: 'Kami mempercepat transisi energi dan pengelolaan sumber daya alam yang berkelanjutan dan inklusif (GESI) melalui bukti, kebijakan, dan implementasi nyata.',
                en: 'We accelerate sustainable and inclusive (GESI) energy transition and natural resource management through evidence, policy, and real implementation.'
            },
            ctaExplore: { id: 'Jelajahi Program', en: 'Explore Programs' },
            ctaImpact: { id: 'Lihat Jejak Dampak', en: 'View Impact' }
        },
        intro: {
            heading: {
                id: 'Kami Membangun Ekosistem Berkelanjutan.',
                en: 'We Build Sustainable Ecosystems.'
            },
            lead: {
                id: 'Didirikan pada tahun 2017, IREEM adalah organisasi nirlaba yang beroperasi di persimpangan antara keahlian teknis dan pembentukan kebijakan.',
                en: 'Founded in 2017, IREEM is a non-profit organization operating at the intersection of technical expertise and policy formation.'
            },
            description: {
                id: 'Fokus kami tidak hanya pada riset di atas kertas, tetapi juga pada bagaimana riset tersebut diterjemahkan menjadi kebijakan nasional, panduan teknis industri, dan peningkatan kapasitas di tingkat daerah.',
                en: 'Our focus is not only on paper research, but also on how this research is translated into national policy, industry technical guidelines, and capacity building at the regional level.'
            },
            readProfile: { id: 'Baca Profil Lengkap →', en: 'Read Full Profile →' },
            strategicFocus: { id: 'Fokus Strategis', en: 'Strategic Focus' }
        },
        pillars: {
            heading: { id: '3 Pilar Program', en: '3 Program Pillars' },
            description: {
                id: 'Pendekatan holistik kami mencakup seluruh rantai nilai transisi hijau.',
                en: 'Our holistic approach covers the entire green transition value chain.'
            },
            energy: {
                title: { id: 'Energi & Iklim', en: 'Energy & Climate' },
                description: {
                    id: 'Transisi energi berkeadilan, efisiensi industri, dan strategi dekarbonisasi.',
                    en: 'Just energy transition, industrial efficiency, and decarbonization strategies.'
                }
            },
            environment: {
                title: { id: 'Manajemen Lingkungan', en: 'Environmental Management' },
                description: {
                    id: 'Pengelolaan limbah, ekonomi sirkular, dan pengendalian polusi.',
                    en: 'Waste management, circular economy, and pollution control.'
                }
            },
            resources: {
                title: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
                description: {
                    id: 'Konservasi lanskap, pengelolaan air, dan keanekaragaman hayati.',
                    en: 'Landscape conservation, water management, and biodiversity.'
                }
            }
        },
        impact: {
            heading: { id: 'Dampak Nyata Untuk Indonesia', en: 'Real Impact for Indonesia' },
            description: {
                id: 'Sejak 2017, kami telah bekerja sama dengan kementerian, donor internasional, dan sektor swasta untuk menghasilkan perubahan terukur.',
                en: 'Since 2017, we have collaborated with ministries, international donors, and the private sector to produce measurable change.'
            },
            viewReport: { id: 'Lihat Laporan Dampak', en: 'View Impact Report' },
            stats: {
                fundsMobilized: { id: 'USD Dana Dimobilisasi', en: 'USD Funds Mobilized' },
                provincesReached: { id: 'Provinsi Dijangkau', en: 'Provinces Reached' },
                policiesSupported: { id: 'Kebijakan Nasional Didukung', en: 'National Policies Supported' },
                auditorsCertified: { id: 'Auditor Energi Tersertifikasi', en: 'Certified Energy Auditors' }
            }
        },
        gallery: {
            subtitle: { id: 'Galeri Aktivitas', en: 'Activity Gallery' },
            heading: { id: 'Momen Terbaik dari Kegiatan Kami', en: 'Best Moments from Our Activities' },
            description: {
                id: 'Dokumentasi visual berbagai pelatihan, workshop, dan kegiatan lapangan IREEM bersama para mitra.',
                en: 'Visual documentation of various trainings, workshops, and field activities with our partners.'
            }
        },
        partners: {
            subtitle: { id: 'Mitra Terpercaya Kami', en: 'Our Trusted Partners' },
            heading: { id: 'Dipercaya oleh Institusi Terkemuka', en: 'Trusted by Leading Institutions' },
            description: {
                id: 'Kolaborasi dengan berbagai pemangku kepentingan untuk dampak yang lebih luas.',
                en: 'Collaboration with various stakeholders for broader impact.'
            }
        },
        cta: {
            heading: { id: 'Siap Berkolaborasi?', en: 'Ready to Collaborate?' },
            description: {
                id: 'Mari bersama-sama wujudkan Indonesia yang lebih berkelanjutan.',
                en: 'Let\'s create a more sustainable Indonesia together.'
            },
            button: { id: 'Ajukan Kemitraan', en: 'Submit Partnership' }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(home);
    }

})();
