/**
 * Energy & Climate Program Page Translations
 * Text content for energy program pages
 * 
 * @file energi.js
 */

(function () {
    'use strict';

    const energi = {
        energi: {
            // Sub navigation
            subnav: {
                energy: { id: 'Energi & Iklim', en: 'Energy & Climate' },
                environment: { id: 'Lingkungan', en: 'Environment' },
                resources: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
                gesi: { id: 'GEDSI', en: 'GEDSI' }
            },
            hero: {
                tagline: { id: 'Program Utama', en: 'Core Program' },
                title: { id: 'Energi & Iklim', en: 'Energy & Climate' },
                subtitle: { id: 'Mendorong transisi energi yang adil melalui dekarbonisasi industri, efisiensi energi, dan pendanaan hijau.', en: 'Driving a just energy transition through industrial decarbonization, energy efficiency, and green financing.' },
                statNumber: { id: '1.5 Juta', en: '1.5 Million' },
                statLabel: { id: 'Ton CO₂e Potensi Penurunan Emisi per Tahun', en: 'Tons of CO₂e Potential Emission Reduction per Year' }
            },
            context: {
                heading: { id: 'Tantangan & Strategi', en: 'Challenges & Strategy' },
                para1: { id: 'Indonesia memiliki target ambisius Net Zero Emission pada 2060. Namun, tantangan teknis dan finansial di sektor industri dan ketenagalistrikan masih menjadi hambatan utama.', en: 'Indonesia has an ambitious Net Zero Emission target by 2060. However, technical and financial challenges in the industrial and electricity sectors remain major barriers.' },
                para2: { id: 'Strategi IREEM berfokus pada <strong>sisi permintaan (demand-side)</strong>: membantu industri melakukan efisiensi energi dan beralih ke sumber terbarukan tanpa mengorbankan produktivitas ekonomi.', en: "IREEM's strategy focuses on the <strong>demand-side</strong>: helping industries achieve energy efficiency and transition to renewable sources without sacrificing economic productivity." },
                highlight: { id: '<strong>IREEM bekerja untuk menjembatani kebijakan nasional dengan kebutuhan teknis di lapangan.</strong> Strategi kami mengutamakan sisi permintaan (demand-side) dengan solusi nyata yang bisa direplikasi, seperti penerapan sistem manajemen energi (EnMS), audit energi berbasis investasi, hingga pengembangan platform digital pelaporan mitigasi GRK sektor energi.', en: '<strong>IREEM works to bridge national policy with technical needs on the ground.</strong> Our strategy prioritizes the demand-side with replicable real solutions, such as implementing energy management systems (EnMS), investment-based energy audits, and developing digital platforms for GHG mitigation reporting in the energy sector.' }
            },
            policyFocus: {
                title: { id: 'Fokus Kebijakan Terkait:', en: 'Related Policy Focus:' },
                item1: { id: 'Standar Kinerja Energi Minimum (SKEM)', en: 'Minimum Energy Performance Standards (MEPS)' },
                item2: { id: 'Mekanisme Pasar Karbon', en: 'Carbon Market Mechanisms' },
                item3: { id: 'Roadmap Dekarbonisasi Industri', en: 'Industrial Decarbonization Roadmap' },
                item4: { id: 'Integrasi Energi Terbarukan di Industri', en: 'Renewable Energy Integration in Industry' },
                item5: { id: 'Model Pembiayaan Efisiensi Energi di Pemerintahan', en: 'Energy Efficiency Financing Models for Government' },
                item6: { id: 'Pengembangan ISO 50001 dan BGH untuk Sektor Publik', en: 'ISO 50001 and Green Building Development for Public Sector' }
            },
            services: {
                heading: { id: 'Solusi Nyata IREEM', en: 'IREEM Real Solutions' },
                subtitle: { id: 'Solusi komprehensif untuk transisi energi berkelanjutan', en: 'Comprehensive solutions for sustainable energy transition' },
                audit: {
                    title: { id: 'Audit Energi & Teknis', en: 'Energy & Technical Audits' },
                    desc1: { id: 'Identifikasi peluang efisiensi energi melalui audit investasi dan rekomendasi teknologi hemat energi untuk industri dan bangunan.', en: 'Identifying energy efficiency opportunities through investment audits and recommending energy-saving technologies for industries and buildings.' },
                    desc2: { id: 'Kami melakukan audit energi tingkat investasi (investment-grade) yang menghasilkan rekomendasi konkret dengan analisis kelayakan finansial.', en: 'We conduct investment-grade energy audits that produce concrete recommendations with financial feasibility analysis.' }
                },
                carbon: {
                    title: { id: 'Manajemen Karbon', en: 'Carbon Management' },
                    desc: { id: 'Perhitungan jejak karbon perusahaan dan penyusunan strategi dekarbonisasi menuju target net-zero emission.', en: 'Corporate carbon footprint calculation and decarbonization strategy development towards net-zero emission targets.' },
                    item1: { id: 'Inventarisasi emisi GRK (Scope 1, 2, 3)', en: 'GHG emissions inventory (Scope 1, 2, 3)' },
                    item2: { id: 'Science-based targets', en: 'Science-based targets' },
                    item3: { id: 'Strategi mitigasi dan offset', en: 'Mitigation and offset strategies' }
                },
                training: {
                    title: { id: 'Pelatihan & Sertifikasi', en: 'Training & Certification' },
                    desc: { id: 'Program pengembangan kapasitas SDM di bidang energi:', en: 'HR capacity development programs in the energy sector:' },
                    item1: { id: 'Sertifikasi BNSP untuk Manajer Energi dan Auditor Energi', en: 'BNSP Certification for Energy Managers and Energy Auditors' },
                    item2: { id: 'Pelatihan ISO 50001 (Sistem Manajemen Energi)', en: 'ISO 50001 Training (Energy Management System)' },
                    item3: { id: 'Pelatihan BGH (Bangunan Gedung Hijau)', en: 'Green Building Training' },
                    item4: { id: 'Modul perubahan iklim', en: 'Climate change modules' }
                },
                mrv: {
                    title: { id: 'Pengembangan Sistem MRV', en: 'MRV System Development' },
                    desc1: { id: 'Pembuatan platform digital untuk pelaporan dan monitoring capaian mitigasi emisi GRK sektor energi:', en: 'Creating digital platforms for reporting and monitoring GHG emission mitigation achievements in the energy sector:' },
                    item1: { id: 'SINERGI – Sistem Informasi Energi Terintegrasi', en: 'SINERGI – Integrated Energy Information System' },
                    item2: { id: 'AKSELERASI – Platform pelaporan aksi mitigasi GRK', en: 'AKSELERASI – GHG Mitigation Action Reporting Platform' },
                    desc2: { id: 'Kedua platform ini mendukung transparansi dan akuntabilitas dalam pelaporan iklim nasional.', en: 'Both platforms support transparency and accountability in national climate reporting.' }
                },
                financing: {
                    title: { id: 'Kajian Model Pembiayaan', en: 'Financing Model Studies' },
                    desc: { id: 'Pengembangan business model untuk investasi efisiensi energi:', en: 'Developing business models for energy efficiency investments:' },
                    item1: { id: 'Studi kelayakan finansial proyek efisiensi energi', en: 'Financial feasibility studies for energy efficiency projects' },
                    item2: { id: 'Model pembiayaan untuk gedung publik dan pemerintahan', en: 'Financing models for public and government buildings' },
                    item3: { id: 'Skema ESCO (Energy Service Company)', en: 'ESCO (Energy Service Company) schemes' },
                    item4: { id: 'Green financing mechanism', en: 'Green financing mechanisms' }
                }
            },
            projects: {
                heading: { id: 'Proyek Unggulan Kami', en: 'Our Featured Projects' },
                subtitle: { id: 'Portofolio proyek bidang Energi & Iklim IREEM', en: 'IREEM Energy & Climate project portfolio' }
            },
            testimonial: {
                quote: { id: '"Melalui program UK PACT, kami berhasil menerapkan langkah nyata penghematan energi dengan hasil signifikan di berbagai gedung pemerintah."', en: '"Through the UK PACT program, we successfully implemented real energy-saving measures with significant results across various government buildings."' },
                author: { id: '— Kementerian Keuangan, 2025', en: '— Ministry of Finance, 2025' }
            },
            caseStudies: {
                heading: { id: 'Studi Kasus & Publikasi Terkait', en: 'Related Case Studies & Publications' },
                caseStudyLabel: { id: 'STUDI KASUS', en: 'CASE STUDY' },
                moduleLabel: { id: 'MODUL', en: 'MODULE' },
                guideLabel: { id: 'PANDUAN', en: 'GUIDE' },
                item1Title: { id: 'UK PACT – Efisiensi Energi Industri', en: 'UK PACT – Industrial Energy Efficiency' },
                item1Desc: { id: 'Pendampingan 50+ industri padat energi dalam implementasi manajemen energi.', en: 'Supporting 50+ energy-intensive industries in implementing energy management.' },
                item2Title: { id: 'Modul Pelatihan M&V Energi', en: 'Energy M&V Training Module' },
                item2Desc: { id: 'Panduan lengkap Measurement & Verification untuk program efisiensi energi.', en: 'Complete Measurement & Verification guide for energy efficiency programs.' },
                item3Title: { id: 'Panduan Implementasi ISO 50001', en: 'ISO 50001 Implementation Guide' },
                item3Desc: { id: 'Langkah-langkah praktis penerapan Sistem Manajemen Energi standar internasional.', en: 'Practical steps for implementing the international Energy Management System standard.' },
                readMore: { id: 'Baca Selengkapnya →', en: 'Read More →' },
                downloadModule: { id: 'Unduh Modul →', en: 'Download Module →' },
                viewGuide: { id: 'Lihat Panduan →', en: 'View Guide →' }
            },
            cta: {
                heading: { id: 'Bermitra untuk Efisiensi Energi', en: 'Partner for Energy Efficiency' },
                subtitle: { id: 'Tertarik menerapkan efisiensi energi di organisasi Anda? Mari berdiskusi tentang solusi terbaik untuk kebutuhan Anda.', en: 'Interested in implementing energy efficiency in your organization? Let\'s discuss the best solutions for your needs.' },
                button: { id: 'Ajukan Kemitraan', en: 'Submit Partnership' }
            },
            explore: {
                heading: { id: 'Jelajahi Lebih Lanjut', en: 'Explore More' },
                subtitle: { id: 'Temukan proyek, publikasi, dan informasi terkait bidang Energi & Iklim', en: 'Discover projects, publications, and information related to Energy & Climate' },
                database: {
                    title: { id: 'Database Proyek', en: 'Project Database' },
                    desc: { id: 'Lihat seluruh proyek IREEM di bidang Energi & Iklim', en: 'View all IREEM projects in Energy & Climate' },
                    link: { id: 'Lihat Proyek', en: 'View Projects' }
                },
                factsheet: {
                    title: { id: 'FactSheet', en: 'FactSheet' },
                    desc: { id: 'Ringkasan visual proyek dan capaian bidang Energi', en: 'Visual summary of Energy projects and achievements' },
                    link: { id: 'Lihat FactSheet', en: 'View FactSheet' }
                },
                news: {
                    title: { id: 'Berita Terkait', en: 'Related News' },
                    desc: { id: 'Berita dan kegiatan terbaru di bidang Energi & Iklim', en: 'Latest news and activities in Energy & Climate' },
                    link: { id: 'Lihat Berita', en: 'View News' }
                },
                publications: {
                    title: { id: 'Publikasi', en: 'Publications' },
                    desc: { id: 'Laporan, kajian, dan dokumen teknis IREEM', en: 'Reports, studies, and IREEM technical documents' },
                    link: { id: 'Lihat Publikasi', en: 'View Publications' }
                }
            }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(energi);
    }

})();
