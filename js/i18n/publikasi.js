/**
 * Publications Page Translations
 * Text content for publications pages
 * 
 * @file publikasi.js
 */

(function () {
    'use strict';

    const publications = {
        publications: {
            hero: {
                tagline: { id: 'Publikasi & Pengetahuan', en: 'Publications & Knowledge' },
                title: { id: 'Berbagi Pengetahuan untuk Perubahan', en: 'Sharing Knowledge for Change' },
                subtitle: { id: 'Akses laporan riset, policy brief, dan panduan praktis dari tim IREEM.', en: 'Access research reports, policy briefs, and practical guides from the IREEM team.' }
            },
            dissemination: {
                heading: { id: 'Diseminasi Publikasi IREEM', en: 'IREEM Publication Dissemination' },
                subtitle: { id: 'Akses panduan, modul pelatihan, dan dokumen teknis terkait efisiensi energi dan manajemen lingkungan.', en: 'Access guides, training modules, and technical documents related to energy efficiency and environmental management.' }
            },
            common: {
                readMore: { id: 'Baca Selengkapnya', en: 'Read More' },
                download: { id: 'Unduh', en: 'Download' },
                viewDetails: { id: 'Lihat Detail', en: 'View Details' }
            },
            detail: {
                // Navigation
                backToList: { id: '← Kembali ke Publikasi', en: '← Back to Publications' },
                backToListButton: { id: 'Kembali ke Daftar Publikasi', en: 'Back to Publications' },

                // Loading & Error States
                loading: { id: 'Memuat publikasi...', en: 'Loading publication...' },
                notFoundTitle: { id: 'Publikasi Tidak Ditemukan', en: 'Publication Not Found' },
                notFoundMessage: { id: 'Maaf, publikasi yang Anda cari tidak tersedia.', en: 'Sorry, the publication you are looking for is not available.' },

                // Download Section
                downloadTitle: { id: 'Unduh Publikasi', en: 'Download Publication' },
                downloadDesc: { id: 'Silakan isi formulir berikut untuk mengunduh publikasi ini secara gratis.', en: 'Please fill out the following form to download this publication for free.' },
                downloadButton: { id: 'Unduh Sekarang', en: 'Download Now' },
                downloadPdf: { id: 'Unduh PDF', en: 'Download PDF' },

                // Metadata Labels
                metaFullTitle: { id: 'Judul Lengkap', en: 'Full Title' },
                metaContributor: { id: 'Kontributor', en: 'Contributor' },
                metaAuthor: { id: 'Penulis', en: 'Author' },
                metaPublisher: { id: 'Penerbit', en: 'Publisher' },
                metaDate: { id: 'Tanggal Terbit', en: 'Published Date' },
                metaLanguage: { id: 'Bahasa', en: 'Language' },
                metaProgram: { id: 'Program', en: 'Program' },
                metaSupporter: { id: 'Didukung oleh', en: 'Supported by' }
            }
        }
    };

    // Register with i18n core
    if (window.i18n && window.i18n.registerTranslations) {
        window.i18n.registerTranslations(publications);
    }

})();
