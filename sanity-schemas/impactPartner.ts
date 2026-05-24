// Impact Partner Schema for Sanity Studio
// File: schemas/impactPartner.ts
//
// Schema untuk section "Clients & Partners" di halaman Impact
// Setiap partner memiliki logo, kategori, deskripsi kolaborasi (bilingual),
// dan daftar proyek terkait.
//
// GROQ Query yang digunakan di website:
// *[_type == "impactPartner"] | order(order asc) {
//   name, nameEn, category, url, order,
//   collaboration { id, en },
//   projects,
//   logo { asset->{ url } }
// }

import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'impactPartner',
    title: 'Impact - Client & Partner',
    type: 'document',
    groups: [
        { name: 'basic', title: 'Informasi Dasar' },
        { name: 'detail', title: 'Detail Kolaborasi' },
    ],
    fields: [
        // ===========================================
        // INFORMASI DASAR
        // ===========================================
        defineField({
            name: 'name',
            title: 'Nama Partner (Indonesia)',
            description: 'Nama lembaga/organisasi dalam Bahasa Indonesia',
            type: 'string',
            group: 'basic',
            validation: Rule => Rule.required(),
        }),

        defineField({
            name: 'nameEn',
            title: 'Nama Partner (English)',
            description: 'Nama lembaga/organisasi dalam Bahasa Inggris (opsional, fallback ke nama Indonesia)',
            type: 'string',
            group: 'basic',
        }),

        defineField({
            name: 'category',
            title: 'Kategori',
            description: 'Jenis lembaga/organisasi',
            type: 'string',
            group: 'basic',
            options: {
                list: [
                    { title: 'Donor', value: 'Donor' },
                    { title: 'Government', value: 'Government' },
                    { title: 'Regional Govt', value: 'Regional Govt' },
                    { title: 'Academic', value: 'Academic' },
                    { title: 'Certification', value: 'Certification' },
                    { title: 'Healthcare', value: 'Healthcare' },
                    { title: 'Industry', value: 'Industry' },
                    { title: 'NGO', value: 'NGO' },
                    { title: 'International Org', value: 'International Org' },
                ],
                layout: 'dropdown',
            },
            validation: Rule => Rule.required(),
        }),

        defineField({
            name: 'logo',
            title: 'Logo',
            description: 'Logo organisasi (format PNG/SVG transparan, minimal 200x200px)',
            type: 'image',
            group: 'basic',
            options: {
                hotspot: true,
            },
            validation: Rule => Rule.required(),
        }),

        defineField({
            name: 'url',
            title: 'Website URL',
            description: 'Link ke website organisasi (opsional)',
            type: 'url',
            group: 'basic',
        }),

        defineField({
            name: 'order',
            title: 'Urutan Tampil',
            description: 'Angka urutan (semakin kecil semakin di atas)',
            type: 'number',
            group: 'basic',
            initialValue: 99,
        }),

        // ===========================================
        // DETAIL KOLABORASI
        // ===========================================
        defineField({
            name: 'collaboration',
            title: 'Deskripsi Kolaborasi',
            description: 'Penjelasan singkat kolaborasi dengan IREEM',
            type: 'object',
            group: 'detail',
            fields: [
                {
                    name: 'id',
                    title: 'Bahasa Indonesia',
                    type: 'text',
                    rows: 3,
                },
                {
                    name: 'en',
                    title: 'English',
                    type: 'text',
                    rows: 3,
                },
            ],
        }),

        defineField({
            name: 'projects',
            title: 'Proyek Terkait',
            description: 'Daftar nama proyek yang dikerjakan bersama',
            type: 'array',
            group: 'detail',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
    ],

    // Preview di Sanity Studio
    preview: {
        select: {
            title: 'name',
            subtitle: 'category',
            media: 'logo',
        },
        prepare({ title, subtitle, media }) {
            const categoryEmoji: Record<string, string> = {
                'Donor': '💰',
                'Government': '🏛️',
                'Regional Govt': '🏢',
                'Academic': '🎓',
                'Certification': '✅',
                'Healthcare': '🏥',
                'Industry': '🏭',
                'NGO': '🤝',
                'International Org': '🌐',
            };
            return {
                title: title || 'Unnamed Partner',
                subtitle: `${categoryEmoji[subtitle] || '📌'} ${subtitle || 'No category'}`,
                media,
            };
        },
    },

    // Ordering default
    orderings: [
        {
            title: 'Urutan Tampil',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
        {
            title: 'Nama A-Z',
            name: 'nameAsc',
            by: [{ field: 'name', direction: 'asc' }],
        },
        {
            title: 'Kategori',
            name: 'categoryAsc',
            by: [{ field: 'category', direction: 'asc' }],
        },
    ],
})
