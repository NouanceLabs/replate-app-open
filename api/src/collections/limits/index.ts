import { isAdmin } from '@payload/access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Limits: CollectionConfig = {
  slug: 'limits',
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    group: 'Users',
    useAsTitle: 'user',
  },
  fields: [
    {
      type: 'relationship',
      name: 'user',
      relationTo: 'users',
      required: true,
      unique: true,
    },
    {
      type: 'number',
      name: 'currentUsage',
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      type: 'number',
      name: 'maxUsage',
      defaultValue: 10,
      required: true,
      min: 1,
    },
  ],
}
