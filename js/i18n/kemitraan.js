/**
 * Kemitraan (Partnership) Page Translations
 * Text content for partnership pages
 * 
 * @file kemitraan.js
 */

(function () {
    'use strict';

    const kemitraan = {
        hero: {
            subtitle: { id: 'BERGABUNG BERSAMA KAMI', en: 'JOIN US' },
            title: { id: 'Kemitraan untuk Dampak yang Lebih Besar', en: 'Partnership for Greater Impact' },
            description: {
                id: 'Kami percaya bahwa perubahan sistemik hanya dapat dicapai melalui kolaborasi multi-pihak yang kuat.',
                en: 'We believe that systemic change can only be achieved through strong multi-stakeholder collaboration.'
            }
        },
        partner: {
            heading: { id: 'Bermitra dengan IREEM', en: 'Partner with IREEM' },
            description: {
                id: 'IREEM membuka pintu kolaborasi untuk mendorong aksi nyata transisi energi dan pengelolaan lingkungan yang efektif.',
                en: 'IREEM opens doors for collaboration to drive real action in energy transition and effective environmental management.'
            }
        },
        services: {
            capacityBuilding: {
                title: { id: 'Capacity Building', en: 'Capacity Building' },
                description: {
                    id: 'Pelatihan teknis, lokakarya, dan pendampingan untuk pengembangan kapasitas SDM.',
                    en: 'Technical training, workshops, and mentoring for HR capacity development.'
                },
                item1: {
                    id: 'Pelatihan Manajer Energi & Auditor Energi bersertifikat BNSP',
                    en: 'BNSP-certified Energy Manager & Energy Auditor Training'
                },
                item2: {
                    id: 'Workshop ISO 50001 dan Bangunan Gedung Hijau',
                    en: 'ISO 50001 and Green Building Workshop'
                },
                item3: {
                    id: 'Training of Trainers (ToT) untuk multiplikasi dampak',
                    en: 'Training of Trainers (ToT) for impact multiplication'
                },
                item4: {
                    id: 'Modul perubahan iklim dan ekonomi hijau',
                    en: 'Climate change and green economy modules'
                }
            },
            pilotPipeline: {
                title: { id: 'Pilot & Pipeline', en: 'Pilot & Pipeline' },
                description: {
                    id: 'Studi kelayakan (FS), program percontohan, dan kemitraan IGA.',
                    en: 'Feasibility studies (FS), pilot programs, and IGA partnerships.'
                },
                item1: {
                    id: 'Feasibility Study untuk proyek efisiensi energi dan EBT',
                    en: 'Feasibility Study for energy efficiency and renewable energy projects'
                },
                item2: {
                    id: 'Pilot project di sektor prioritas (industri, bangunan, maritim)',
                    en: 'Pilot projects in priority sectors (industry, buildings, maritime)'
                },
                item3: {
                    id: 'Investment Grade Audit (IGA) untuk bankable projects',
                    en: 'Investment Grade Audit (IGA) for bankable projects'
                },
                item4: {
                    id: 'Technical due diligence',
                    en: 'Technical due diligence'
                }
            },
            policyMRV: {
                title: { id: 'Policy Paper & MRV', en: 'Policy Paper & MRV' },
                description: {
                    id: 'Penyusunan rekomendasi kebijakan, riset data, dan pengembangan sistem MRV.',
                    en: 'Policy recommendation preparation, data research, and MRV system development.'
                },
                item1: {
                    id: 'Policy brief dan position paper untuk pengambil kebijakan',
                    en: 'Policy briefs and position papers for policymakers'
                },
                item2: {
                    id: 'Riset dan analisis data energi dan lingkungan',
                    en: 'Energy and environmental data research and analysis'
                },
                item3: {
                    id: 'Pengembangan sistem Monitoring, Reporting, and Verification (MRV)',
                    en: 'Development of Monitoring, Reporting, and Verification (MRV) systems'
                },
                item4: {
                    id: 'Platform digital pelaporan iklim (SINERGI, AKSELERASI)',
                    en: 'Digital climate reporting platforms (SINERGI, AKSELERASI)'
                }
            },
            taInstitutional: {
                title: { id: 'TA Institusional', en: 'Institutional TA' },
                description: {
                    id: 'Dukungan teknis implementasi sistem manajemen energi dan lingkungan di institusi.',
                    en: 'Technical support for implementing energy and environmental management systems in institutions.'
                },
                item1: {
                    id: 'Implementasi ISO 50001 dan ISO 50005',
                    en: 'Implementation of ISO 50001 and ISO 50005'
                },
                item2: {
                    id: 'Pendampingan sertifikasi Bangunan Gedung Hijau (BGH)',
                    en: 'Green Building (BGH) certification support'
                },
                item3: {
                    id: 'Audit energi untuk gedung pemerintah dan komersial',
                    en: 'Energy audits for government and commercial buildings'
                },
                item4: {
                    id: 'Penyusunan rencana aksi efisiensi energi',
                    en: 'Development of energy efficiency action plans'
                }
            },
            escoFacilitation: {
                title: { id: 'ESCO Facilitation', en: 'ESCO Facilitation' },
                description: {
                    id: 'Memfasilitasi proyek efisiensi energi dengan Energy Service Companies (ESCO).',
                    en: 'Facilitating energy efficiency projects with Energy Service Companies (ESCO).'
                },
                item1: {
                    id: 'Identifikasi dan matchmaking dengan penyedia ESCO',
                    en: 'Identification and matchmaking with ESCO providers'
                },
                item2: {
                    id: 'Pengembangan model bisnis ESCO untuk sektor publik',
                    en: 'Development of ESCO business models for the public sector'
                },
                item3: {
                    id: 'Penyusunan kontrak kinerja energi',
                    en: 'Energy performance contract preparation'
                },
                item4: {
                    id: 'Monitoring dan verifikasi penghematan energi',
                    en: 'Monitoring and verification of energy savings'
                }
            },
            subnationalAcceleration: {
                title: { id: 'Subnational Acceleration', en: 'Subnational Acceleration' },
                description: {
                    id: 'Akselerasi program energi terbarukan dan efisiensi di tingkat daerah.',
                    en: 'Accelerating renewable energy and efficiency programs at the regional level.'
                },
                item1: {
                    id: 'Pendampingan penyusunan RUED (Rencana Umum Energi Daerah)',
                    en: 'Support for RUED (Regional General Energy Plan) preparation'
                },
                item2: {
                    id: 'Program efisiensi energi untuk Pemda',
                    en: 'Energy efficiency programs for local governments'
                },
                item3: {
                    id: 'Pengembangan EBT skala kecil dan menengah',
                    en: 'Development of small and medium-scale renewable energy'
                },
                item4: {
                    id: 'Capacity building untuk stakeholder daerah',
                    en: 'Capacity building for regional stakeholders'
                }
            }
        },
        models: {
            heading: { id: 'Model Kemitraan', en: 'Partnership Models' },
            bilateral: {
                title: { id: 'Proyek Bilateral', en: 'Bilateral Projects' },
                description: {
                    id: 'Kerjasama langsung dengan donor atau klien untuk implementasi program tertentu.',
                    en: 'Direct cooperation with donors or clients for specific program implementation.'
                },
                example: { id: 'Contoh: UK PACT, GIZ, USAID', en: 'Examples: UK PACT, GIZ, USAID' }
            },
            consortium: {
                title: { id: 'Konsorsium Multi-Pihak', en: 'Multi-Party Consortium' },
                description: {
                    id: 'Bergabung dalam konsorsium bersama lembaga internasional dan nasional lainnya.',
                    en: 'Joining consortiums with other international and national institutions.'
                },
                example: { id: 'Contoh: Partnership for Market Readiness', en: 'Example: Partnership for Market Readiness' }
            },
            government: {
                title: { id: 'Pendampingan Pemerintah', en: 'Government Assistance' },
                description: {
                    id: 'Dukungan teknis langsung kepada kementerian dan pemerintah daerah.',
                    en: 'Direct technical support to ministries and regional governments.'
                },
                example: { id: 'Contoh: Kemenko Marves, Kementerian ESDM', en: 'Examples: Kemenko Marves, Ministry of ESDM' }
            }
        },
        cta: {
            heading: { id: 'Mulai Kolaborasi', en: 'Start Collaboration' },
            description: { id: 'Kami terbuka untuk mendiskusikan peluang kemitraan baru.', en: 'We are open to discussing new partnership opportunities.' },
            button: { id: 'Ajukan Proposal Kemitraan', en: 'Submit Partnership Proposal' }
        },
        proposal: {
            tagline: { id: 'Kontak', en: 'Contact' },
            title: { id: 'Hubungi Kami', en: 'Contact Us' },
            subtitle: { id: 'Isi formulir di bawah ini untuk memulai diskusi tentang potensi kolaborasi.', en: 'Fill out the form below to start a discussion about potential collaboration.' },
            formTitle: { id: 'Kirim Pesan', en: 'Send Message' },
            labelName: { id: 'Nama Lengkap *', en: 'Full Name *' },
            placeholderName: { id: 'Masukkan nama Anda', en: 'Enter your name' },
            labelEmail: { id: 'Email *', en: 'Email *' },
            labelOrg: { id: 'Organisasi', en: 'Organization' },
            placeholderOrg: { id: 'Nama perusahaan/organisasi', en: 'Company/organization name' },
            labelType: { id: 'Jenis Kolaborasi', en: 'Collaboration Type' },
            optionSelect: { id: 'Pilih jenis kolaborasi...', en: 'Select collaboration type...' },
            optionTA: { id: 'TA Institusional', en: 'Institutional TA' },
            optionOther: { id: 'Lainnya', en: 'Other' },
            labelMessage: { id: 'Pesan *', en: 'Message *' },
            placeholderMessage: { id: 'Ceritakan tentang rencana kolaborasi Anda...', en: 'Tell us about your collaboration plans...' },
            btnSubmit: { id: 'Kirim Pesan', en: 'Send Message' },
            officeAddress: { id: 'Alamat Kantor', en: 'Office Address' },
            workingHours: { id: 'Jam Kerja', en: 'Working Hours' },
            workingHoursValue: { id: 'Sen-Jum, 09:00-17:00', en: 'Mon-Fri, 09:00-17:00' }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(kemitraan);
    }

})();
