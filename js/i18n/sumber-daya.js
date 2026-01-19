/**
 * Sumber Daya Alam (Natural Resources) Program Page Translations
 * Bilingual text content for Program/Sumber Daya Alam page
 * 
 * @file sumber-daya.js
 */

(function () {
    'use strict';

    const sumberDaya = {
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
            title: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
            description: {
                id: 'Konservasi lanskap berkelanjutan dan pengelolaan sumber daya alam untuk mendukung pembangunan rendah emisi dan berkeadilan.',
                en: 'Sustainable landscape conservation and natural resource management to support low-emission and equitable development.'
            },
            stat: { id: 'Provinsi Terjangkau', en: 'Provinces Reached' },
            statNote: { id: 'Melalui kajian, pendampingan kebijakan, dan studi teknis', en: 'Through studies, policy assistance, and technical assessments' }
        },

        // Challenges & Strategy Section
        challenges: {
            title: { id: 'Tantangan & Strategi', en: 'Challenges & Strategy' },
            para1: {
                id: 'Indonesia merupakan salah satu negara dengan keanekaragaman hayati tertinggi di dunia. Namun, tekanan terhadap sumber daya alam terus meningkat akibat ekspansi pertanian, pertambangan, pembangunan infrastruktur, dan urbanisasi.',
                en: 'Indonesia is one of the countries with the highest biodiversity in the world. However, pressure on natural resources continues to increase due to agricultural expansion, mining, infrastructure development, and urbanization.'
            },
            para2: {
                id: 'IREEM mendukung pemerintah daerah dan mitra pembangunan dalam menyeimbangkan kebutuhan pembangunan ekonomi dengan konservasi ekosistem, melalui pendekatan berbasis lanskap (<em>landscape approach</em>) dan kajian berbasis data.',
                en: 'IREEM supports local governments and development partners in balancing economic development needs with ecosystem conservation, through a landscape-based approach (<em>landscape approach</em>) and data-driven studies.'
            },
            callout: {
                id: 'Pendekatan ini memungkinkan <strong>perencanaan dan pengelolaan sumber daya alam yang terintegrasi</strong> lintas sektor dan lintas wilayah.',
                en: 'This approach enables <strong>integrated natural resource planning and management</strong> across sectors and regions.'
            },
            focusTitle: { id: 'Fokus Kebijakan', en: 'Policy Focus' },
            focus1: { id: '→ Tata Ruang Berbasis Ekosistem', en: '→ Ecosystem-Based Spatial Planning' },
            focus2: { id: '→ Pengelolaan DAS Terpadu', en: '→ Integrated Watershed Management' },
            focus3: { id: '→ Valuasi Jasa Ekosistem', en: '→ Ecosystem Services Valuation' }
        },

        // Services & Solutions Section
        services: {
            title: { id: 'Solusi Kami', en: 'Our Solutions' },
            subtitle: { id: 'Pendampingan teknis untuk pengelolaan sumber daya alam berkelanjutan', en: 'Technical assistance for sustainable natural resource management' },

            // Baseline Assessments
            baseline: {
                title: { id: 'Baseline Assessments', en: 'Baseline Assessments' },
                intro: { id: 'Pemetaan kondisi dasar sumber daya alam sebagai landasan:', en: 'Mapping baseline conditions of natural resources as a foundation for:' },
                item1: { id: 'Perencanaan tata ruang', en: 'Spatial planning' },
                item2: { id: 'Pengelolaan lanskap', en: 'Landscape management' },
                item3: { id: 'Pemantauan perubahan lingkungan', en: 'Environmental change monitoring' },
                closing: { id: 'Digunakan sebagai dasar pengambilan keputusan kebijakan dan perencanaan pembangunan berkelanjutan.', en: 'Used as a basis for policy decision-making and sustainable development planning.' }
            },

            // Watershed Management
            watershed: {
                title: { id: 'Pengelolaan DAS', en: 'Watershed Management' },
                intro: { id: 'Strategi pengelolaan Daerah Aliran Sungai (DAS) secara terintegrasi lintas sektor dan lintas wilayah, dengan memperhatikan:', en: 'Integrated watershed management strategy across sectors and regions, considering:' },
                item1: { id: 'Fungsi ekosistem', en: 'Ecosystem functions' },
                item2: { id: 'Risiko lingkungan', en: 'Environmental risks' },
                item3: { id: 'Kebutuhan sosial dan ekonomi masyarakat', en: 'Community social and economic needs' },
                closing: { id: 'Pendekatan ini mendukung ketahanan air dan pengurangan risiko bencana.', en: 'This approach supports water resilience and disaster risk reduction.' }
            },

            // Forest Carbon Valuation
            carbon: {
                title: { id: 'Valuasi Karbon Hutan', en: 'Forest Carbon Valuation' },
                intro: { id: 'Perhitungan nilai stok karbon dan jasa ekosistem hutan untuk mendukung:', en: 'Calculation of carbon stock value and forest ecosystem services to support:' },
                item1: { id: 'Mekanisme pembiayaan berbasis kinerja', en: 'Performance-based financing mechanisms' },
                item2: { id: 'Pembayaran jasa lingkungan', en: 'Payment for ecosystem services' },
                item3: { id: 'Integrasi kebijakan iklim dan kehutanan', en: 'Climate and forestry policy integration' },
                closing: { id: 'Pendekatan ini menghubungkan konservasi dengan insentif ekonomi.', en: 'This approach links conservation with economic incentives.' }
            }
        },

        // Projects Section
        projects: {
            title: { id: 'Proyek Sumber Daya Alam', en: 'Natural Resources Projects' },
            subtitle: { id: 'Portofolio proyek bidang Sumber Daya Alam IREEM', en: 'IREEM Natural Resources project portfolio' },
            loading: { id: 'Memuat proyek...', en: 'Loading projects...' }
        },

        // Experience Section
        experience: {
            title: { id: 'Pengalaman IREEM di Bidang Sumber Daya Alam', en: 'IREEM Experience in Natural Resources' },
            landscape: {
                title: { id: 'Lanskap & Tata Ruang', en: 'Landscape & Spatial Planning' },
                description: { id: 'KLHS, baseline ekosistem, perencanaan berbasis lanskap', en: 'SEA, ecosystem baseline, landscape-based planning' }
            },
            watershed: {
                title: { id: 'DAS & Ekosistem', en: 'Watershed & Ecosystem' },
                description: { id: 'Pengelolaan DAS terpadu dan lintas sektor', en: 'Integrated and cross-sector watershed management' }
            },
            carbon: {
                title: { id: 'Karbon & Jasa Ekosistem', en: 'Carbon & Ecosystem Services' },
                description: { id: 'Valuasi karbon hutan dan jasa lingkungan', en: 'Forest carbon and ecosystem services valuation' }
            },
            policy: {
                title: { id: 'Kebijakan SDA', en: 'Natural Resources Policy' },
                description: { id: 'Dukungan kebijakan nasional & daerah', en: 'National & regional policy support' }
            }
        },

        // Related Programs
        related: {
            title: { id: 'Keterkaitan dengan Program Lain', en: 'Connection with Other Programs' },
            subtitle: { id: 'Program Sumber Daya Alam IREEM terhubung erat dengan bidang kerja lainnya', en: "IREEM's Natural Resources Program is closely connected with other work areas" },
            energy: {
                title: { id: 'Energi & Iklim', en: 'Energy & Climate' },
                description: { id: 'Dekarbonisasi, biomassa, transisi energi', en: 'Decarbonization, biomass, energy transition' }
            },
            environment: {
                title: { id: 'Lingkungan', en: 'Environment' },
                description: { id: 'MRV, polusi, ekonomi sirkular', en: 'MRV, pollution, circular economy' }
            },
            gesi: {
                title: { id: 'GEDSI', en: 'GEDSI' },
                description: { id: 'Inklusivitas dan keadilan', en: 'Inclusivity and equity' }
            }
        },

        // CTA Section
        cta: {
            title: { id: 'Bermitra untuk Konservasi dan Pengelolaan Sumber Daya Alam', en: 'Partner for Conservation and Natural Resource Management' },
            description: { id: 'IREEM membuka peluang kolaborasi dengan pemerintah, donor, dan mitra pembangunan untuk memperkuat pengelolaan sumber daya alam yang berkelanjutan dan berbasis data.', en: 'IREEM opens collaboration opportunities with government, donors, and development partners to strengthen sustainable and data-driven natural resource management.' },
            button: { id: 'Ajukan Kemitraan', en: 'Submit Partnership' }
        },

        // SDA wrapper for explore section keys (sda.explore.*)
        sda: {
            explore: {
                heading: { id: 'Jelajahi Lebih Lanjut', en: 'Explore More' },
                subtitle: { id: 'Temukan proyek, publikasi, dan informasi terkait bidang Sumber Daya Alam', en: 'Discover projects, publications, and information related to Natural Resources' },
                database: {
                    title: { id: 'Database Proyek', en: 'Project Database' },
                    desc: { id: 'Lihat seluruh proyek IREEM di bidang Sumber Daya Alam', en: 'View all IREEM projects in Natural Resources' },
                    link: { id: 'Lihat Proyek', en: 'View Projects' }
                },
                factsheet: {
                    title: { id: 'FactSheet', en: 'FactSheet' },
                    desc: { id: 'Ringkasan visual proyek dan capaian bidang SDA', en: 'Visual summary of Natural Resources projects and achievements' },
                    link: { id: 'Lihat FactSheet', en: 'View FactSheet' }
                },
                news: {
                    title: { id: 'Berita Terkait', en: 'Related News' },
                    desc: { id: 'Berita dan kegiatan terbaru di bidang Sumber Daya Alam', en: 'Latest news and activities in Natural Resources' },
                    link: { id: 'Lihat Berita', en: 'View News' }
                },
                publications: {
                    title: { id: 'Publikasi', en: 'Publications' },
                    desc: { id: 'Laporan, kajian, dan dokumen teknis IREEM', en: 'Reports, studies, and IREEM technical documents' },
                    link: { id: 'Lihat Publikasi', en: 'View Publications' }
                }
            },
            policyFocus: {
                title: { id: 'Fokus Kebijakan:', en: 'Policy Focus:' },
                spatial: { id: 'Tata Ruang Berbasis Ekosistem', en: 'Ecosystem-Based Spatial Planning' },
                watershed: { id: 'Pengelolaan DAS Terpadu', en: 'Integrated Watershed Management' },
                ecosystem: { id: 'Valuasi Jasa Ekosistem', en: 'Ecosystem Services Valuation' }
            }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(sumberDaya);
    }

})();
