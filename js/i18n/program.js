/**
 * Program Page Translations
 * Text content for program pages
 * 
 * @file program.js
 */

(function () {
    'use strict';

    const program = {
        hero: {
            subtitle: { id: 'PROGRAM KAMI', en: 'OUR PROGRAMS' },
            title: { id: 'Empat Pilar Pembangunan Berkelanjutan', en: 'Four Pillars of Sustainable Development' },
            description: {
                id: 'Pendekatan holistik kami mencakup seluruh rantai nilai transisi hijau Indonesia.',
                en: 'Our holistic approach covers the entire value chain of Indonesia\'s green transition.'
            }
        },
        card: {
            category: { id: 'Program', en: 'Program' },
            learnMore: { id: 'Pelajari Lebih Lanjut →', en: 'Learn More →' }
        },
        pillars: {
            energy: {
                title: { id: 'Energi & Iklim', en: 'Energy & Climate' },
                category: { id: 'Energi Berkelanjutan', en: 'Sustainable Energy' },
                description: {
                    id: 'Transisi energi berkeadilan, efisiensi industri, dan strategi dekarbonisasi untuk mencapai Net Zero Emission 2060.',
                    en: 'Just energy transition, industrial efficiency, and decarbonization strategies to achieve Net Zero Emission 2060.'
                }
            },
            environment: {
                title: { id: 'Manajemen Lingkungan', en: 'Environmental Management' },
                category: { id: 'Lingkungan Bersih', en: 'Clean Environment' },
                description: {
                    id: 'Pengelolaan limbah, ekonomi sirkular, MRV emisi, dan pengendalian polusi untuk masa depan yang lebih bersih.',
                    en: 'Waste management, circular economy, emission MRV, and pollution control for a cleaner future.'
                }
            },
            resources: {
                title: { id: 'Sumber Daya Alam', en: 'Natural Resources' },
                category: { id: 'Konservasi', en: 'Conservation' },
                description: {
                    id: 'Konservasi lanskap, pengelolaan DAS, dan valuasi keanekaragaman hayati Indonesia.',
                    en: 'Landscape conservation, watershed management, and Indonesia\'s biodiversity valuation.'
                }
            },
            gesi: {
                title: { id: 'GEDSI & Inklusi Sosial', en: 'GEDSI & Social Inclusion' },
                category: { id: 'Kesetaraan', en: 'Equality' },
                description: {
                    id: 'Pengarusutamaan Gender, Inklusi Sosial, dan Safeguards dalam setiap proyek pembangunan.',
                    en: 'Gender mainstreaming, Social Inclusion, and Safeguards in every development project.'
                }
            }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(program);
    }

})();

