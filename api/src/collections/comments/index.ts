import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      type: 'relationship',
      name: 'recipe',
    },
    {
      type: 'relationship',
      name: 'user',
      relationTo: 'users',
    },
  ],
}
