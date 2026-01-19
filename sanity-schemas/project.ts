// Project Schema for Sanity Studio
// File: schemas/project.ts
// 
// Schema ini untuk form halaman detail proyek di Sanity Studio
// Berisi semua field yang dibutuhkan termasuk fullDescription, achievements, 
// activityTypes, dan referensi ke konten terkait

import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Proyek',
    type: 'document',
    groups: [
        { name: 'basic', title: 'Informasi Dasar' },
        { name: 'content', title: 'Konten Detail' },
        { name: 'related', title: 'Konten Terkait' },
        { name: 'media', title: 'Media' },
    ],
    fields: [
        // ===========================================
        // INFORMASI DASAR
        // ===========================================
        defineField({
            name: 'title',
            title: 'Judul Proyek',
            type: 'object',
            group: 'basic',
            fields: [
                { name: 'id', type: 'string', title: 'Bahasa Indonesia' },
                { name: 'en', type: 'string', title: 'English' },
            ],
            validation: Rule => Rule.required(),
        }),

        defineField({
            name: 'slug',
            title: 'Slug URL',
            type: 'slug',
            group: 'basic',
            options: {
                source: 'title.id',
                maxLength: 96,
            },
            validation: Rule => Rule.required(),
        }),

        defineField({
            name: 'shortDescription',
            title: 'Deskripsi Singkat',
            description: 'Ringkasan singkat proyek (1-2 kalimat)',
            type: 'object',
            group: 'basic',
            fields: [
                { name: 'id', type: 'text', title: 'Bahasa Indonesia', rows: 3 },
                { name: 'en', type: 'text', title: 'English', rows: 3 },
            ],
        }),

        defineField({
            name: 'donor',
            title: 'Pendonor',
            type: 'object',
            group: 'basic',
            fields: [
                { name: 'id', type: 'string', title: 'Bahasa Indonesia' },
                { name: 'en', type: 'string', title: 'English' },
            ],
        }),

        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            group: 'basic',
            options: {
                list: [
                    { title: 'Berlangsung', value: 'ongoing' },
                    { title: 'Selesai', value: 'completed' },
                ],
                layout: 'radio',
            },
            initialValue: 'ongoing',
        }),

        defineField({
            name: 'yearStart',
            title: 'Tahun Mulai',
            type: 'number',
            group: 'basic',
            validation: Rule => Rule.min(2000).max(2100),
        }),

        defineField({
            name: 'yearEnd',
            title: 'Tahun Selesai',
            description: 'Kosongkan jika masih berlangsung',
            type: 'number',
            group: 'basic',
            validation: Rule => Rule.min(2000).max(2100),
        }),

        defineField({
            name: 'programs',
            title: 'Program Terkait',
            type: 'array',
            group: 'basic',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Energi', value: 'energy' },
                    { title: 'Lingkungan', value: 'environment' },
                    { title: 'Sumber Daya Alam', value: 'natural-resources' },
                    { title: 'GEDSI', value: 'gedsi' },
                ],
            },
        }),

        // ===========================================
        // KONTEN DETAIL
        // ===========================================
        defineField({
            name: 'fullDescription',
            title: 'Narasi Lengkap',
            description: 'Deskripsi detail proyek (Portable Text)',
            type: 'object',
            group: 'content',
            fields: [
                {
                    name: 'id',
                    title: 'Bahasa Indonesia',
                    type: 'array',
                    of: [
                        {
                            type: 'block',
                            styles: [
                                { title: 'Normal', value: 'normal' },
                                { title: 'Heading 2', value: 'h2' },
                                { title: 'Heading 3', value: 'h3' },
                                { title: 'Quote', value: 'blockquote' },
                            ],
                            marks: {
                                decorators: [
                                    { title: 'Bold', value: 'strong' },
                                    { title: 'Italic', value: 'em' },
                                ],
                                annotations: [
                                    {
                                        name: 'link',
                                        type: 'object',
                                        title: 'Link',
                                        fields: [
                                            { name: 'href', type: 'url', title: 'URL' },
                                        ],
                                    },
                                ],
                            },
                        },
                        {
                            type: 'image',
                            options: { hotspot: true },
                            fields: [
                                {
                                    name: 'caption',
                                    type: 'string',
                                    title: 'Caption',
                                },
                                {
                                    name: 'alt',
                                    type: 'string',
                                    title: 'Alt Text',
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'en',
                    title: 'English',
                    type: 'array',
                    of: [
                        {
                            type: 'block',
                            styles: [
                                { title: 'Normal', value: 'normal' },
                                { title: 'Heading 2', value: 'h2' },
                                { title: 'Heading 3', value: 'h3' },
                                { title: 'Quote', value: 'blockquote' },
                            ],
                            marks: {
                                decorators: [
                                    { title: 'Bold', value: 'strong' },
                                    { title: 'Italic', value: 'em' },
                                ],
                                annotations: [
                                    {
                                        name: 'link',
                                        type: 'object',
                                        title: 'Link',
                                        fields: [
                                            { name: 'href', type: 'url', title: 'URL' },
                                        ],
                                    },
                                ],
                            },
                        },
                        {
                            type: 'image',
                            options: { hotspot: true },
                            fields: [
                                {
                                    name: 'caption',
                                    type: 'string',
                                    title: 'Caption',
                                },
                                {
                                    name: 'alt',
                                    type: 'string',
                                    title: 'Alt Text',
                                },
                            ],
                        },
                    ],
                },
            ],
        }),

        defineField({
            name: 'activityTypes',
            title: 'Bentuk Kegiatan',
            description: 'Daftar aktivitas yang dilakukan dalam proyek',
            type: 'object',
            group: 'content',
            fields: [
                {
                    name: 'id',
                    title: 'Bahasa Indonesia',
                    type: 'array',
                    of: [{ type: 'string' }],
                },
                {
                    name: 'en',
                    title: 'English',
                    type: 'array',
                    of: [{ type: 'string' }],
                },
            ],
        }),

        defineField({
            name: 'achievements',
            title: 'Capaian Utama',
            description: 'Daftar pencapaian/hasil utama proyek',
            type: 'object',
            group: 'content',
            fields: [
                {
                    name: 'id',
                    title: 'Bahasa Indonesia',
                    type: 'array',
                    of: [{ type: 'string' }],
                },
                {
                    name: 'en',
                    title: 'English',
                    type: 'array',
                    of: [{ type: 'string' }],
                },
            ],
        }),

        // ===========================================
        // MEDIA
        // ===========================================
        defineField({
            name: 'coverImage',
            title: 'Gambar Banner',
            type: 'image',
            group: 'media',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alt Text',
                },
                {
                    name: 'caption',
                    type: 'string',
                    title: 'Caption',
                },
            ],
        }),

        // ===========================================
        // KONTEN TERKAIT
        // ===========================================
        defineField({
            name: 'relatedNews',
            title: 'Berita Terkait',
            description: 'Pilih berita yang terkait dengan proyek ini (opsional)',
            type: 'array',
            group: 'related',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'news' }],
                },
            ],
        }),

        defineField({
            name: 'relatedFactsheets',
            title: 'FactSheet Terkait',
            description: 'Pilih factsheet yang terkait dengan proyek ini (opsional)',
            type: 'array',
            group: 'related',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'factsheet' }],
                },
            ],
        }),

        defineField({
            name: 'relatedPublications',
            title: 'Publikasi Terkait',
            description: 'Pilih publikasi yang terkait dengan proyek ini (opsional)',
            type: 'array',
            group: 'related',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'publication' }],
                },
            ],
        }),
    ],

    // Preview di Sanity Studio
    preview: {
        select: {
            title: 'title.id',
            subtitle: 'donor.id',
            status: 'status',
            media: 'coverImage',
        },
        prepare({ title, subtitle, status, media }) {
            const statusEmoji = status === 'ongoing' ? '🟢' : '✅';
            return {
                title: title || 'Untitled Project',
                subtitle: `${statusEmoji} ${subtitle || 'No donor'}`,
                media,
            };
        },
    },

    // Ordering default
    orderings: [
        {
            title: 'Tahun Mulai (Terbaru)',
            name: 'yearStartDesc',
            by: [{ field: 'yearStart', direction: 'desc' }],
        },
        {
            title: 'Judul A-Z',
            name: 'titleAsc',
            by: [{ field: 'title.id', direction: 'asc' }],
        },
    ],
})
