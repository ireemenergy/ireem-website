/**
 * Impact Page Partners - Flip Cards
 * Displays partner logos with flip card effect showing collaboration info
 */

(function () {
    'use strict';

    // Partner data with collaboration info
    const PARTNERS_DATA = [
        // Donors
        {
            id: 'giz',
            name: 'GIZ',
            logo: '../images/partners/giz.png',
            category: 'Donor',
            collaboration: {
                id: 'Dukungan teknis untuk program efisiensi energi dan manajemen lingkungan di Indonesia sejak 2018.',
                en: 'Technical support for energy efficiency and environmental management programs in Indonesia since 2018.'
            },
            projects: ['SAGEN Program', 'Energy Efficiency Advisory']
        },
        {
            id: 'uk-pact',
            name: 'UK PACT',
            logo: '../images/partners/uk-pact.png',
            category: 'Donor',
            collaboration: {
                id: 'Program flagship dekarbonisasi industri dan peningkatan kapasitas manajemen energi gedung pemerintah.',
                en: 'Flagship program for industrial decarbonization and government building energy management capacity building.'
            },
            projects: ['UK-PACT Phase 1', 'UK-PACT Phase 2', 'IKE Development']
        },
        {
            id: 'danida',
            name: 'DANIDA',
            logo: '../images/partners/danida.png',
            category: 'Donor',
            collaboration: {
                id: 'Kemitraan untuk pengembangan energi berkelanjutan dan pembangunan kapasitas di sektor energi.',
                en: 'Partnership for sustainable energy development and capacity building in energy sector.'
            },
            projects: ['ESP3 Program']
        },
        {
            id: 'jetp',
            name: 'JETP Secretariat',
            logo: '../images/partners/jetp.png',
            category: 'Donor',
            collaboration: {
                id: 'Dukungan koordinasi untuk implementasi Just Energy Transition Partnership di Indonesia.',
                en: 'Coordination support for Just Energy Transition Partnership implementation in Indonesia.'
            },
            projects: ['JETP Coordination Support']
        },
        {
            id: 'south-pole',
            name: 'South Pole',
            logo: '../images/partners/south-pole.png',
            category: 'Donor',
            collaboration: {
                id: 'Kemitraan dalam pengembangan sistem MRV dan perdagangan karbon.',
                en: 'Partnership in MRV system development and carbon trading.'
            },
            projects: ['Carbon Verification', 'MRV Development']
        },
        // Government
        {
            id: 'kementerian-esdm',
            name: 'Kementerian ESDM',
            logo: '../images/partners/kementerian-esdm.png',
            category: 'Government',
            collaboration: {
                id: 'Mitra utama dalam pengembangan kebijakan konservasi energi dan standar efisiensi energi nasional.',
                en: 'Main partner in energy conservation policy development and national energy efficiency standards.'
            },
            projects: ['Permen IKE', 'SNI ISO 50001', 'Panduan Audit Energi']
        },
        {
            id: 'kemenkeu',
            name: 'Kementerian Keuangan',
            logo: '../images/partners/kemenkeu.png',
            category: 'Government',
            collaboration: {
                id: 'Pendampingan implementasi manajemen energi di gedung-gedung Kementerian Keuangan.',
                en: 'Energy management implementation assistance in Ministry of Finance buildings.'
            },
            projects: ['Energy Audit Level 2', 'Capacity Building']
        },
        {
            id: 'kemenhub',
            name: 'Kementerian Perhubungan',
            logo: '../images/partners/kemenhub.png',
            category: 'Government',
            collaboration: {
                id: 'Pengembangan kebijakan efisiensi energi sektor transportasi dan audit energi pelabuhan.',
                en: 'Transportation sector energy efficiency policy development and port energy audits.'
            },
            projects: ['Port Energy Audit', 'Transport Efficiency Policy']
        },
        // Academic
        {
            id: 'ui',
            name: 'Universitas Indonesia',
            logo: '../images/partners/ui.png',
            category: 'Academic',
            collaboration: {
                id: 'Riset bersama dan pengembangan kurikulum pelatihan manajemen energi.',
                en: 'Joint research and energy management training curriculum development.'
            },
            projects: ['Research Collaboration', 'Curriculum Development']
        },
        {
            id: 'unsoed',
            name: 'Universitas Jenderal Soedirman',
            logo: '../images/partners/unsoed.png',
            category: 'Academic',
            collaboration: {
                id: 'Kemitraan untuk pengembangan center of excellence energi terbarukan.',
                en: 'Partnership for renewable energy center of excellence development.'
            },
            projects: ['Renewable Energy CoE']
        },
        {
            id: 'lsp-hake',
            name: 'LSP HAKE',
            logo: '../images/partners/lsp-hake.png',
            category: 'Certification',
            collaboration: {
                id: 'Kolaborasi dalam sertifikasi profesional auditor energi dan manajer energi.',
                en: 'Collaboration in professional certification for energy auditors and energy managers.'
            },
            projects: ['Energy Professional Certification']
        },
        // Others
        {
            id: 'jawa-tengah',
            name: 'Pemprov Jawa Tengah',
            logo: '../images/partners/jawa-tengah.png',
            category: 'Regional Govt',
            collaboration: {
                id: 'Pilot project efisiensi energi di gedung-gedung pemerintah Provinsi Jawa Tengah.',
                en: 'Energy efficiency pilot project in Central Java Provincial government buildings.'
            },
            projects: ['Provincial EE Pilot']
        },
        {
            id: 'rscm',
            name: 'RSUPN Dr. Cipto Mangunkusumo',
            logo: '../images/partners/rscm.png',
            category: 'Healthcare',
            collaboration: {
                id: 'Audit energi dan pendampingan implementasi manajemen energi rumah sakit.',
                en: 'Energy audit and hospital energy management implementation assistance.'
            },
            projects: ['Hospital Energy Audit']
        },
        {
            id: 'evershinetex',
            name: 'PT Evershinetex Indonesia',
            logo: '../images/partners/evershinetex.png',
            category: 'Industry',
            collaboration: {
                id: 'Pilot project dekarbonisasi dan modernisasi boiler industri tekstil.',
                en: 'Decarbonization pilot project and textile industry boiler modernization.'
            },
            projects: ['Industrial Decarbonization Pilot']
        }
    ];

    function getCurrentLanguage() {
        if (window.i18n && typeof window.i18n.getCurrentLang === 'function') {
            return window.i18n.getCurrentLang();
        }
        return localStorage.getItem('ireem_lang') || 'id';
    }

    function getText(field, lang) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object') {
            return field[lang] || field.id || field.en || '';
        }
        return '';
    }

    function getCategoryColor(category) {
        const colors = {
            'Donor': '#2563eb',
            'Government': '#059669',
            'Academic': '#7c3aed',
            'Certification': '#f59e0b',
            'Regional Govt': '#0891b2',
            'Healthcare': '#dc2626',
            'Industry': '#64748b'
        };
        return colors[category] || '#64748b';
    }

    function renderPartners() {
        const container = document.getElementById('impact-partners-grid');
        if (!container) return;

        const lang = getCurrentLanguage();

        container.innerHTML = PARTNERS_DATA.map(partner => {
            const collaboration = getText(partner.collaboration, lang);
            const categoryColor = getCategoryColor(partner.category);
            const projectsList = partner.projects.join(', ');

            return `
                <div class="partner-flip-card">
                    <div class="partner-flip-inner">
                        <!-- Front -->
                        <div class="partner-flip-front">
                            <img src="${partner.logo}" alt="${partner.name}" loading="lazy" 
                                 onerror="this.src='../images/placeholder-logo.png'">
                            <span class="partner-category" style="background: ${categoryColor}20; color: ${categoryColor};">${partner.category}</span>
                        </div>
                        <!-- Back -->
                        <div class="partner-flip-back" style="border-top: 4px solid ${categoryColor};">
                            <h4>${partner.name}</h4>
                            <p class="partner-collab">${collaboration}</p>
                            <div class="partner-projects">
                                <span class="projects-label">${lang === 'en' ? 'Projects:' : 'Proyek:'}</span>
                                <span class="projects-list">${projectsList}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        addFlipCardStyles();
    }

    function addFlipCardStyles() {
        if (document.getElementById('partner-flip-styles')) return;

        const style = document.createElement('style');
        style.id = 'partner-flip-styles';
        style.textContent = `
            #impact-partners-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 1.5rem;
            }

            .partner-flip-card {
                perspective: 1000px;
                height: 200px;
                transition: all 0.4s ease;
            }

            .partner-flip-card:hover {
                height: 280px;
                z-index: 10;
            }

            .partner-flip-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transition: transform 0.6s, height 0.4s ease;
                transform-style: preserve-3d;
            }

            .partner-flip-card:hover .partner-flip-inner {
                transform: rotateY(180deg);
            }

            .partner-flip-front,
            .partner-flip-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                transition: box-shadow 0.3s ease;
            }

            .partner-flip-card:hover .partner-flip-front,
            .partner-flip-card:hover .partner-flip-back {
                box-shadow: 0 12px 40px rgba(0,0,0,0.15);
            }

            .partner-flip-front {
                background: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
            }

            .partner-flip-front img {
                max-width: 80%;
                max-height: 80px;
                object-fit: contain;
                margin-bottom: 1rem;
            }

            .partner-category {
                font-size: 0.7rem;
                font-weight: 600;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .partner-flip-back {
                background: white;
                transform: rotateY(180deg);
                padding: 1.25rem;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
            }

            .partner-flip-back h4 {
                color: var(--color-primary);
                font-size: 0.95rem;
                margin: 0 0 0.5rem 0;
                font-family: 'Inter', sans-serif;
                line-height: 1.3;
            }

            .partner-collab {
                color: var(--color-text);
                font-size: 0.8rem;
                line-height: 1.5;
                margin: 0;
                flex: 1;
            }

            .partner-projects {
                margin-top: 0.75rem;
                padding-top: 0.75rem;
                border-top: 1px solid #e2e8f0;
                flex-shrink: 0;
            }

            .projects-label {
                font-size: 0.7rem;
                color: var(--color-muted);
                display: block;
                margin-bottom: 0.25rem;
            }

            .projects-list {
                font-size: 0.75rem;
                color: var(--color-secondary);
                font-weight: 500;
                line-height: 1.4;
            }

            @media (max-width: 768px) {
                #impact-partners-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .partner-flip-card {
                    height: 180px;
                }

                .partner-flip-card:hover {
                    height: 260px;
                }

                .partner-flip-back {
                    padding: 1rem;
                }

                .partner-flip-back h4 {
                    font-size: 0.85rem;
                }

                .partner-collab {
                    font-size: 0.75rem;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', renderPartners);

    // Language change
    document.addEventListener('languageChanged', renderPartners);

    // Export
    window.ImpactPartners = {
        render: renderPartners
    };
})();
