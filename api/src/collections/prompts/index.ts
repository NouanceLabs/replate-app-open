import { isAdmin } from '@payload/access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Prompts: CollectionConfig = {
  slug: 'prompts',
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'relationship',
      name: 'owner',
      relationTo: 'users',
    },
    {
      type: 'relationship',
      name: 'recipe',
      relationTo: 'users',
    },
    {
      type: 'text',
      name: 'model',
    },
    {
      type: 'json',
      name: 'inputPrompt',
    },
    {
      type: 'json',
      name: 'fullPrompt',
    },
    {
      type: 'json',
      name: 'fullResponse',
    },
  ],
}
