import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'heroSlideshow',
    title: 'Hero Slideshow',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Internal name for this slideshow configuration',
            initialValue: 'Homepage Hero Slideshow',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'slides',
            title: 'Slides',
            type: 'array',
            description: 'Add and reorder hero background slides',
            of: [
                {
                    type: 'object',
                    name: 'slide',
                    title: 'Slide',
                    fields: [
                        {
                            name: 'title',
                            title: 'Title',
                            type: 'string',
                            description: 'Accessible label for screen readers',
                            validation: (Rule: any) => Rule.required()
                        },
                        {
                            name: 'subtitle',
                            title: 'Subtitle',
                            type: 'string',
                            description: 'Optional caption (not currently displayed)'
                        },
                        {
                            name: 'image',
                            title: 'Background Image',
                            type: 'image',
                            description: 'Hero background image (recommended: 1920x1080px)',
                            options: {
                                hotspot: true
                            },
                            validation: (Rule: any) => Rule.required()
                        }
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            subtitle: 'subtitle',
                            media: 'image'
                        },
                        prepare({ title, subtitle, media }: any) {
                            return {
                                title: title || 'Untitled Slide',
                                subtitle: subtitle || 'No subtitle',
                                media
                            }
                        }
                    }
                }
            ],
            validation: Rule => Rule.required().min(1).max(10).error('Must have between 1 and 10 slides')
        })
    ],
    preview: {
        select: {
            title: 'title',
            slides: 'slides'
        },
        prepare({ title, slides }: any) {
            return {
                title: title || 'Hero Slideshow',
                subtitle: slides ? `${slides.length} slide${slides.length !== 1 ? 's' : ''}` : 'No slides'
            }
        }
    }
})
