/**
 * Impact Page Translations
 * Text content for impact pages
 * 
 * @file impact.js
 */

(function () {
    'use strict';

    const impact = {
        hero: {
            subtitle: { id: 'DAMPAK KAMI', en: 'OUR IMPACT' },
            title: { id: 'Perubahan Nyata di Lapangan', en: 'Real Change on the Ground' },
            description: {
                id: 'Sejak 2017, kami telah menghasilkan dampak terukur bagi Indonesia melalui kolaborasi dengan pemerintah, donor, dan sektor swasta.',
                en: 'Since 2017, we have generated measurable impact for Indonesia through collaboration with government, donors, and private sector.'
            }
        },
        portfolio: {
            heading: { id: 'Ringkasan Portofolio', en: 'Portfolio Summary' },
            description: {
                id: 'Berikut adalah capaian utama IREEM dalam mendukung transisi energi dan pembangunan berkelanjutan di Indonesia.',
                en: 'Here are IREEM\'s main achievements in supporting energy transition and sustainable development in Indonesia.'
            }
        },
        stats: {
            donorFunds: {
                label: { id: 'Dana Donor Dimobilisasi', en: 'Donor Funds Mobilized' },
                note: { id: 'Dukungan dari mitra internasional untuk mendukung program transisi energi Indonesia', en: 'Support from international partners to support Indonesia\'s energy transition programs' }
            },
            individualsReached: { id: 'Individu Terjangkau', en: 'Individuals Reached' },
            provincesReached: { id: 'Provinsi Terjangkau', en: 'Provinces Reached' },
            partnerInstitutions: { id: 'Institusi Mitra', en: 'Partner Institutions' },
            certifiedProfessionals: { id: 'Profesional Energi Tersertifikasi', en: 'Certified Energy Professionals' },
            trainingParticipants: { id: 'Peserta Pelatihan', en: 'Training Participants' },
            experts: { id: 'Tenaga Ahli', en: 'Experts' },
            energyModeling: { id: 'Energy Modelling', en: 'Energy Modelling' },
            nationalGuidelines: { id: 'Panduan Nasional', en: 'National Guidelines' },
            policyRecommendations: { id: 'Rekomendasi Kebijakan', en: 'Policy Recommendations' },
            taInstitutions: { id: 'Institusi TA', en: 'TA Institutions' },
            gedsiProducts: { id: 'Produk GEDSI', en: 'GEDSI Products' },
            pilotProjects: { id: 'Pilot Project', en: 'Pilot Projects' },
            mrvSystems: { id: 'Sistem MRV', en: 'MRV Systems' },
            feasibilityStudies: { id: 'Studi Kelayakan', en: 'Feasibility Studies' },
            strategicPlans: { id: 'Rencana Strategis', en: 'Strategic Plans' },
            mtsp: { id: 'Medium-Term Strategic Plans', en: 'Medium-Term Strategic Plans' }
        },
        map: {
            subtitle: { id: 'Jangkauan Proyek', en: 'Project Coverage' },
            heading: { id: 'Area Cakupan IREEM', en: 'IREEM Coverage Area' },
            description: {
                id: 'Kami telah melaksanakan proyek di berbagai provinsi di Indonesia, mencakup 5 wilayah utama.',
                en: 'We have implemented projects in various provinces in Indonesia, covering 5 main regions.'
            }
        },
        projects: {
            subtitle: { id: 'Portofolio Proyek', en: 'Project Portfolio' },
            heading: { id: 'Proyek Berdasarkan Aktivitas', en: 'Projects by Activity' },
            description: {
                id: 'Lihat detail proyek kami yang dikelompokkan berdasarkan jenis aktivitas: Capacity Building, Policy & Regulation, dan Pilot Project.',
                en: 'View our project details grouped by activity type: Capacity Building, Policy & Regulation, and Pilot Project.'
            }
        },
        // Coverage Area Regions
        regions: {
            // Region buttons
            btnJawa: { id: 'Pulau Jawa', en: 'Java Island' },
            btnSumatera: { id: 'Sumatera', en: 'Sumatra' },
            btnKalimantan: { id: 'Kalimantan', en: 'Kalimantan' },
            btnSulawesi: { id: 'Sulawesi', en: 'Sulawesi' },
            btnNusatenggara: { id: 'Bali & Nusa Tenggara', en: 'Bali & Nusa Tenggara' },

            // Jawa Region
            jawa: {
                title: { id: 'Pulau Jawa', en: 'Java Island' },
                dki: {
                    title: { id: 'DKI Jakarta', en: 'DKI Jakarta' },
                    item1: { id: 'Kementerian Keuangan (ISO 50001)', en: 'Ministry of Finance (ISO 50001)' },
                    item2: { id: 'Kementerian PUPR, Perhubungan, Perindustrian, KLHK, Bappenas', en: 'Ministry of Public Works, Transportation, Industry, Environment & Forestry, Bappenas' },
                    item3: { id: 'Setda DKI Jakarta (Energy Management)', en: 'DKI Jakarta Secretariat (Energy Management)' },
                    item4: { id: 'Gedung Ditjen EBTKE KESDM', en: 'EBTKE Directorate General Building, MEMR' }
                },
                jabar: {
                    title: { id: 'Jawa Barat', en: 'West Java' },
                    item1: { id: 'Setda Prov. Jawa Barat (Energy Management)', en: 'West Java Provincial Secretariat (Energy Management)' },
                    item2: { id: 'Dinas ESDM Jawa Barat', en: 'West Java EMR Agency' },
                    item3: { id: 'Politeknik Negeri Bandung', en: 'Bandung State Polytechnic' },
                    item4: { id: 'Alfamart (Private sector EE)', en: 'Alfamart (Private Sector Energy Efficiency)' }
                },
                jateng: {
                    title: { id: 'Jawa Tengah', en: 'Central Java' },
                    item1: { id: 'Setda Prov. Jawa Tengah (ISO 50001)', en: 'Central Java Provincial Secretariat (ISO 50001)' },
                    item2: { id: 'Setda Kabupaten Batang & Sukoharjo', en: 'Batang & Sukoharjo Regency Secretariats' },
                    item3: { id: 'Dinas PUPR Kota Magelang (BGH)', en: 'Magelang City Public Works Agency (BGH)' }
                },
                diy: {
                    title: { id: 'DI Yogyakarta & Jawa Timur', en: 'DI Yogyakarta & East Java' },
                    item1: { id: 'Setda Prov. DIY & Dinas PUPESDM DIY', en: 'DIY Provincial Secretariat & DIY PUPESDM Agency' },
                    item2: { id: 'Bappeda Prov. Jawa Timur (EM & Audit)', en: 'East Java Provincial Bappeda (EM & Audit)' },
                    item3: { id: 'Dinas ESDM & Perumahan Rakyat Jawa Timur', en: 'East Java EMR & Public Housing Agency' }
                }
            },

            // Sumatera Region
            sumatera: {
                title: { id: 'Sumatera', en: 'Sumatra' },
                utara: {
                    title: { id: 'Sumatera Utara & Aceh', en: 'North Sumatra & Aceh' },
                    item1: { id: 'Peserta sertifikasi EM/EA', en: 'EM/EA Certification Participants' }
                },
                barat: {
                    title: { id: 'Sumatera Barat & Riau', en: 'West Sumatra & Riau' },
                    item1: { id: 'Peserta Bimtek & sertifikasi', en: 'Technical Training & Certification Participants' },
                    item2: { id: 'Dinas ESDM Prov. Riau (Audit Energi Level 2)', en: 'Riau Provincial EMR Agency (Level 2 Energy Audit)' }
                },
                selatan: {
                    title: { id: 'Sumatera Selatan & Lampung', en: 'South Sumatra & Lampung' },
                    item1: { id: 'Dinas ESDM Prov. Sumsel (Audit Energi Level 2)', en: 'South Sumatra Provincial EMR Agency (Level 2 Energy Audit)' },
                    item2: { id: 'Dinas ESDM Prov. Lampung (Audit Energi Level 2)', en: 'Lampung Provincial EMR Agency (Level 2 Energy Audit)' }
                },
                bengkulu: {
                    title: { id: 'Bengkulu', en: 'Bengkulu' },
                    item1: { id: 'Peserta sertifikasi EM/EA', en: 'EM/EA Certification Participants' }
                }
            },

            // Kalimantan Region
            kalimantan: {
                title: { id: 'Kalimantan', en: 'Kalimantan' },
                timur: {
                    title: { id: 'Kalimantan Timur', en: 'East Kalimantan' },
                    item1: { id: 'Dinas ESDM Prov. Kaltim (Audit Energi Level 2)', en: 'East Kalimantan Provincial EMR Agency (Level 2 Energy Audit)' }
                },
                lain: {
                    title: { id: 'Kalimantan Utara, Tengah, Selatan', en: 'North, Central, South Kalimantan' },
                    item1: { id: 'Peserta sertifikasi EM/E', en: 'EM/E Certification Participants' }
                }
            },

            // Sulawesi Region
            sulawesi: {
                title: { id: 'Sulawesi', en: 'Sulawesi' },
                utara: {
                    title: { id: 'Sulawesi Utara', en: 'North Sulawesi' },
                    item1: { id: 'Dinas ESDM Prov. Sulut', en: 'North Sulawesi Provincial EMR Agency' }
                },
                tenggara: {
                    title: { id: 'Sulawesi Tenggara', en: 'Southeast Sulawesi' },
                    item1: { id: 'Peserta Bimtek & sertifikasi', en: 'Technical Training & Certification Participants' }
                }
            },

            // Bali & Nusa Tenggara Region
            nusatenggara: {
                title: { id: 'Bali & Nusa Tenggara', en: 'Bali & Nusa Tenggara' },
                ntb: {
                    title: { id: 'Nusa Tenggara Barat (NTB) – Lombok', en: 'West Nusa Tenggara (NTB) – Lombok' },
                    item1: { id: 'Studi biomassa (Sumbawa & Lombok)', en: 'Biomass Study (Sumbawa & Lombok)' }
                }
            }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(impact);
    }

})();

