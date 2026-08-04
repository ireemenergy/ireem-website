/**
 * Energy Program Page Translations
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
                energy: { id: 'Sistem Energi Berkelanjutan', en: 'Sustainable Energy Systems' },
                environment: { id: 'Manajemen Lingkungan & Aksi Iklim', en: 'Environmental Management & Climate Action' },
                resources: { id: 'Tata Kelola Sumber Daya Alam', en: 'Natural Resource Governance' },
                gesi: { id: 'GEDSI', en: 'GEDSI' }
            },
            hero: {
                tagline: { id: 'Program Utama', en: 'Main Programme' },
                title: { id: 'Sistem Energi Berkelanjutan', en: 'Sustainable Energy Systems' },
                subtitle: { id: 'Mendorong transisi energi yang aman, inklusif, dan rendah karbon pada sisi penyediaan, transformasi, dan pemanfaatan energi.', en: 'Advancing a secure, inclusive, and low-carbon energy transition across energy supply, transformation, and demand.' },
                statNumber: { id: '1.5 Juta', en: '1.5 Million' },
                statLabel: { id: 'Ton CO₂e Potensi Penurunan Emisi per Tahun', en: 'Tons of CO₂e Potential Emission Reduction per Year' }
            },
            context: {
                heading: { id: 'Tantangan dan Respons Strategis', en: 'Challenges & Strategic Response' },
                para1: { id: 'Perubahan lingkungan strategis nasional dan global telah membentuk kembali arah pengembangan sektor energi Indonesia. Pertumbuhan ekonomi menuju Indonesia Emas 2045 diperkirakan akan meningkatkan kebutuhan energi secara signifikan. Sementara itu, kemajuan teknologi dan diversifikasi sumber energi telah mentransformasi sistem energi di seluruh rantai nilai, mulai dari penyediaan energi primer dan transformasi energi hingga pemanfaatan energi final, dengan peran energi baru dan energi terbarukan yang semakin meningkat.', en: 'Changes in the national and global strategic landscape are reshaping Indonesia\'s energy sector. Economic growth toward the Golden Indonesia 2045 vision is expected to significantly increase energy demand. Meanwhile, technological advances and the diversification of energy sources are transforming the energy system across the entire value chain—from primary energy supply and energy transformation to final energy consumption—with an increasing role for new and renewable energy.' },
                para2: { id: 'Sektor energi masih menjadi salah satu kontributor utama emisi gas rumah kaca di Indonesia. Oleh karena itu, transformasi menyeluruh pada sisi penyediaan, transformasi, dan pemanfaatan energi sangat penting untuk mencapai target Emisi Nol Bersih (Net Zero Emissions/NZE) pada tahun 2060 dengan tetap menjaga ketahanan energi, keterjangkauan, dan daya saing ekonomi.', en: 'As the energy sector remains a major contributor to Indonesia\'s greenhouse gas emissions, comprehensive transformation across energy supply, transformation, and demand is essential to achieving the Net Zero Emissions target by 2060 while maintaining energy security, affordability, and economic competitiveness.' },
                highlight: { id: 'IREEM menjembatani kebijakan nasional dengan implementasi praktis di seluruh rantai nilai energi. Strategi IREEM mendukung penyediaan energi yang lebih bersih dan beragam; proses transformasi energi yang efisien, andal, dan rendah karbon; serta pemanfaatan energi yang produktif pada sisi pengguna. Intervensi utama mencakup pengembangan energi terbarukan, penerapan sistem manajemen energi (<em>SME</em>), pemodelan sistem energi, audit energi berorientasi investasi, optimalisasi sistem, peningkatan kapasitas, serta pengembangan platform digital untuk pelaporan mitigasi emisi gas rumah kaca.', en: 'IREEM bridges national policies with practical implementation across the energy value chain. Our strategy supports cleaner and more diversified energy supply; efficient, reliable, and low-carbon energy transformation; and productive demand-side energy use. Key interventions include renewable energy deployment, energy management systems (EnMS), energy system modelling, investment-grade energy audits, system optimisation, capacity building, and digital platforms for greenhouse gas mitigation reporting.' }
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
                    desc: { id: 'Program pengembangan kapasitas SDM di bidang energi:', en: 'HR capacity development programmes in the energy sector:' },
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
                subtitle: { id: 'Portofolio proyek bidang Energi IREEM', en: 'IREEM Energy project portfolio' }
            },
            testimonial: {
                quote: { id: '"Melalui program UK PACT, kami berhasil menerapkan langkah nyata penghematan energi dengan hasil signifikan di berbagai gedung pemerintah."', en: '"Through the UK PACT programme, we successfully implemented real energy-saving measures with significant results across various government buildings."' },
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
                item2Desc: { id: 'Panduan lengkap Measurement & Verification untuk program efisiensi energi.', en: 'Complete Measurement & Verification guide for energy efficiency programmes.' },
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
                subtitle: { id: 'Temukan proyek, publikasi, dan informasi terkait bidang Energi', en: 'Discover projects, publications, and information related to Energy' },
                database: {
                    title: { id: 'Database Proyek', en: 'Project Database' },
                    desc: { id: 'Lihat seluruh proyek IREEM di bidang Energi', en: 'View all IREEM projects in Energy' },
                    link: { id: 'Lihat Proyek', en: 'View Projects' }
                },
                factsheet: {
                    title: { id: 'FactSheet', en: 'FactSheet' },
                    desc: { id: 'Ringkasan visual proyek dan capaian bidang Energi', en: 'Visual summary of Energy projects and achievements' },
                    link: { id: 'Lihat FactSheet', en: 'View FactSheet' }
                },
                news: {
                    title: { id: 'Berita Terkait', en: 'Related News' },
                    desc: { id: 'Berita dan kegiatan terbaru di bidang Energi', en: 'Latest news and activities in Energy' },
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
