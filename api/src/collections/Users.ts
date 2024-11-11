import { anyone } from '@payload/access/anyone'
import { isAdmin, isAdminField } from '@payload/access/isAdmin'
import { isSelfOrAdmin } from '@payload/access/isSelfOrAdmin'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Users',
    useAsTitle: 'email',
  },
  access: {
    read: isSelfOrAdmin,
    update: isSelfOrAdmin,
    create: anyone,
    unlock: isAdmin,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: true,
    },
    cookies: {
      domain: process.env.COOKIE_DOMAIN || undefined,
    },
    tokenExpiration: 259200, // 3 days
  },
  fields: [
    {
      type: 'text',
      name: 'fullName',
    },
    {
      type: 'select',
      name: 'role',
      access: {
        read: isAdminField,
        update: isAdminField,
        create: isAdminField,
      },
      defaultValue: 'user',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
    {
      type: 'join',
      name: 'likes',
      collection: 'likes',
      on: 'user',
    },
    {
      type: 'array',
      name: 'ingredients',
      fields: [
        {
          type: 'text',
          name: 'ingredient',
        },
      ],
    },
  ],
}
