import { isAdmin } from '@payload/access/isAdmin'
import { createAccess, readAccess, deleteAccess } from './access'
import type { CollectionConfig } from 'payload'

export const Likes: CollectionConfig = {
  slug: 'likes',
  admin: {
    group: 'Interactions',
  },
  access: {
    read: readAccess,
    create: createAccess,
    update: isAdmin,
    delete: deleteAccess,
  },
  fields: [
    {
      type: 'relationship',
      name: 'user',
      relationTo: 'users',
      required: true,
    },
    {
      type: 'relationship',
      name: 'recipe',
      relationTo: 'recipes',
      required: true,
    },
  ],
}
