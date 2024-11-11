import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      type: 'textarea',
      name: 'attribution',
    },
    {
      type: 'text',
      name: 'blurhash',
    },
    {
      type: 'text',
      name: 'color',
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 140,
      },
      {
        name: 'medium',
        width: 500,
      },
      {
        name: 'large',
        width: 900,
      },
      {
        name: 'xlarge',
        width: 1440,
      },
    ],
  },
}
