/**
 * Lingkungan (Environment) Program Page Translations
 * Bilingual text content for Program/Lingkungan page
 * 
 * @file lingkungan.js
 */

(function () {
    'use strict';

    const lingkungan = {
        lingkungan: {
            // Key Solutions for accordions
            keySolutions: {
                title: { id: 'Solusi Kunci:', en: 'Key Solutions:' },
                mrv: { id: 'Sistem MRV Emisi & Lingkungan', en: 'Emission & Environmental MRV System' },
                audit: { id: 'Audit Lingkungan', en: 'Environmental Audit' },
                circularStudy: { id: 'Studi Kelayakan Ekonomi Sirkular', en: 'Circular Economy Feasibility Study' }
            },

            // Explore Section
            explore: {
                heading: { id: 'Jelajahi Lebih Lanjut', en: 'Explore More' },
                subtitle: { id: 'Temukan proyek, publikasi, dan informasi terkait bidang Lingkungan', en: 'Discover projects, publications, and information related to Environment' },
                database: {
                    title: { id: 'Database Proyek', en: 'Project Database' },
                    desc: { id: 'Lihat seluruh proyek IREEM di bidang Lingkungan', en: 'View all IREEM projects in Environment' },
                    link: { id: 'Lihat Proyek', en: 'View Projects' }
                },
                factsheet: {
                    title: { id: 'FactSheet', en: 'FactSheet' },
                    desc: { id: 'Ringkasan visual proyek dan capaian bidang Lingkungan', en: 'Visual summary of Environment projects and achievements' },
                    link: { id: 'Lihat FactSheet', en: 'View FactSheet' }
                },
                news: {
                    title: { id: 'Berita Terkait', en: 'Related News' },
                    desc: { id: 'Berita dan kegiatan terbaru di bidang Lingkungan', en: 'Latest news and activities in Environment' },
                    link: { id: 'Lihat Berita', en: 'View News' }
                },
                publications: {
                    title: { id: 'Publikasi', en: 'Publications' },
                    desc: { id: 'Laporan, kajian, dan dokumen teknis IREEM', en: 'Reports, studies, and IREEM technical documents' },
                    link: { id: 'Lihat Publikasi', en: 'View Publications' }
                }
            }
        },

        // Program Nav
        programNav: {
            energy: { id: 'Energi & Iklim', en: 'Energy & Climate' },
            environment: { id: 'Lingkungan', en: 'Environment' },
            resources: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
            gesi: { id: 'GEDSI', en: 'GEDSI' }
        },

        // Hero Section
        hero: {
            subtitle: { id: 'PROGRAM UTAMA', en: 'MAIN PROGRAM' },
            title: { id: 'Manajemen Lingkungan', en: 'Environmental Management' },
            description: {
                id: 'Integrasi ekonomi sirkular, pengendalian polusi, dan sistem pemantauan lingkungan untuk mendukung pembangunan rendah emisi dan berkelanjutan.',
                en: 'Integration of circular economy, pollution control, and environmental monitoring systems to support low-emission and sustainable development.'
            }
        },

        // Approach Section
        approach: {
            title: { id: 'Pendekatan Kami', en: 'Our Approach' },
            para1: {
                id: 'Pertumbuhan ekonomi sering kali masih berbanding lurus dengan peningkatan limbah, emisi, dan degradasi lingkungan. IREEM membantu memutus hubungan tersebut (<em>decoupling</em>) melalui penerapan manajemen lingkungan berbasis data, ekonomi sirkular, dan sistem pemantauan yang transparan.',
                en: 'Economic growth is often still directly proportional to increased waste, emissions, and environmental degradation. IREEM helps break this link (<em>decoupling</em>) through the implementation of data-driven environmental management, circular economy, and transparent monitoring systems.'
            },
            focusTitle: { id: 'Fokus kerja kami mencakup:', en: 'Our work focus includes:' },
            focus1: { id: 'Pengelolaan limbah dan pengendalian polusi industri', en: 'Waste management and industrial pollution control' },
            focus2: { id: 'Penguatan sistem Monitoring, Reporting, and Verification (MRV) lingkungan', en: 'Strengthening environmental Monitoring, Reporting, and Verification (MRV) systems' },
            focus3: { id: 'Integrasi aspek lingkungan dalam kebijakan iklim, energi, dan pembangunan', en: 'Integration of environmental aspects in climate, energy, and development policies' },
            callout: {
                id: 'Pendekatan ini memastikan bahwa kebijakan dan proyek pembangunan tidak hanya patuh regulasi, tetapi juga <strong>berkontribusi nyata pada penurunan dampak lingkungan</strong>.',
                en: 'This approach ensures that policies and development projects not only comply with regulations, but also <strong>make a real contribution to reducing environmental impact</strong>.'
            },
            keyServicesTitle: { id: 'Solusi Kunci', en: 'Key Solutions' },
            keyService1: { id: '→ Audit Lingkungan', en: '→ Environmental Audit' },
            keyService2: { id: '→ Sistem MRV Emisi & Lingkungan', en: '→ Emission & Environmental MRV Systems' },
            keyService3: { id: '→ Studi Kelayakan Ekonomi Sirkular', en: '→ Circular Economy Feasibility Studies' }
        },

        // Services & Solutions Section
        services: {
            title: { id: 'Solusi Kami', en: 'Our Solutions' },
            subtitle: { id: 'Pendampingan teknis dan kebijakan untuk pengelolaan lingkungan berkelanjutan', en: 'Technical and policy assistance for sustainable environmental management' },

            // MRV System
            mrv: {
                title: { id: 'MRV System', en: 'MRV System' },
                para1: { id: 'Pengembangan sistem Monitoring, Reporting, and Verification (MRV) untuk meningkatkan transparansi emisi dan dampak lingkungan.', en: 'Development of Monitoring, Reporting, and Verification (MRV) systems to improve transparency of emissions and environmental impacts.' },
                para2: { id: 'IREEM berpengalaman mengembangkan sistem MRV yang terintegrasi dengan kebijakan nasional dan kebutuhan pelaporan internasional.', en: 'IREEM has experience developing MRV systems integrated with national policies and international reporting requirements.' }
            },

            // Pollution Control
            pollution: {
                title: { id: 'Kontrol Polusi', en: 'Pollution Control' },
                intro: { id: 'Pendampingan teknis dan kebijakan dalam pengendalian pencemaran:', en: 'Technical and policy assistance in pollution control:' },
                item1: { id: 'Udara (emisi industri)', en: 'Air (industrial emissions)' },
                item2: { id: 'Air limbah', en: 'Wastewater' },
                item3: { id: 'Limbah proses produksi', en: 'Production process waste' },
                closing: { id: 'Termasuk dukungan perumusan kebijakan, standar teknis, dan sistem pemantauan berbasis data.', en: 'Including support for policy formulation, technical standards, and data-driven monitoring systems.' }
            },

            // AMDAL & KLHS
            amdal: {
                title: { id: 'AMDAL & KLHS', en: 'EIA & SEA' },
                intro: { id: 'Penyusunan dan penguatan dokumen lingkungan strategis:', en: 'Preparation and strengthening of strategic environmental documents:' },
                item1: { id: 'AMDAL untuk proyek infrastruktur dan industri', en: 'EIA for infrastructure and industrial projects' },
                item2: { id: 'KLHS untuk kebijakan, rencana, dan program pembangunan', en: 'SEA for policies, plans, and development programs' },
                closing: { id: "Pendekatan IREEM menekankan substansi dampak dan mitigasi, bukan sekadar kepatuhan administratif.", en: "IREEM's approach emphasizes impact substance and mitigation, not just administrative compliance." }
            },

            // Circular Economy
            circular: {
                title: { id: 'Ekonomi Sirkular', en: 'Circular Economy' },
                intro: { id: 'Studi dan pendampingan penerapan ekonomi sirkular untuk:', en: 'Studies and assistance for circular economy implementation for:' },
                item1: { id: 'Pengurangan limbah', en: 'Waste reduction' },
                item2: { id: 'Pemanfaatan ulang residu produksi', en: 'Reuse of production residues' },
                item3: { id: 'Integrasi lingkungan–energi–ekonomi', en: 'Environment-energy-economy integration' },
                closing: { id: 'Pendekatan ini sering dikombinasikan dengan kajian energi dan sumber daya alam.', en: 'This approach is often combined with energy and natural resource studies.' }
            }
        },

        // Projects Section
        projects: {
            title: { id: 'Pengalaman Proyek di Bidang Lingkungan', en: 'Project Experience in Environment' },
            subtitle: { id: 'Portofolio proyek bidang Manajemen Lingkungan IREEM', en: 'IREEM Environmental Management project portfolio' },
            loading: { id: 'Memuat proyek...', en: 'Loading projects...' }
        },

        // Partnership Benefits
        partnership: {
            title: { id: 'Mengapa Bermitra dengan IREEM?', en: 'Why Partner with IREEM?' },
            benefit1: { id: 'Pendekatan berbasis data dan kebijakan', en: 'Data and policy-driven approach' },
            benefit2: { id: 'Pengalaman integrasi lingkungan–energi–iklim', en: 'Experience in environment-energy-climate integration' },
            benefit3: { id: 'Terbiasa bekerja dengan kementerian dan donor internasional', en: 'Experienced working with ministries and international donors' },
            benefit4: { id: 'Fokus pada sistem yang berkelanjutan, bukan solusi jangka pendek', en: 'Focus on sustainable systems, not short-term solutions' }
        },

        // Related Programs
        related: {
            title: { id: 'Keterkaitan dengan Program Lain', en: 'Connection with Other Programs' },
            subtitle: { id: 'Program Lingkungan IREEM terhubung erat dengan bidang kerja lainnya', en: "IREEM's Environment Program is closely connected with other work areas" },
            energy: {
                title: { id: 'Energi & Iklim', en: 'Energy & Climate' },
                description: { id: 'MRV, dekarbonisasi, pasar karbon', en: 'MRV, decarbonization, carbon market' }
            },
            resources: {
                title: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
                description: { id: 'Biomassa, limbah, ekonomi sirkular', en: 'Biomass, waste, circular economy' }
            },
            gesi: {
                title: { id: 'GEDSI', en: 'GEDSI' },
                description: { id: 'Inklusivitas dalam kebijakan lingkungan', en: 'Inclusivity in environmental policy' }
            }
        },

        // CTA Section
        cta: {
            title: { id: 'Bermitra untuk Pengelolaan Lingkungan Berkelanjutan', en: 'Partner for Sustainable Environmental Management' },
            description: { id: 'Kami mendukung pemerintah, donor, dan sektor swasta dalam merancang dan mengimplementasikan sistem pengelolaan lingkungan yang kredibel dan berdampak.', en: 'We support government, donors, and the private sector in designing and implementing credible and impactful environmental management systems.' },
            button: { id: 'Ajukan Kemitraan', en: 'Submit Partnership' }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(lingkungan);
    }

})();
