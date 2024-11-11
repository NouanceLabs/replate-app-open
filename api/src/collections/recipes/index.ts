import { isAdmin } from '@payload/access/isAdmin'
import { readAccess, updateAccess } from './access'
import { slugify } from '@payload/utilities/slugify'
import type { CollectionConfig } from 'payload'
import {
  CuisinsePreferencesOptions,
  DietaryPreferencesOptions,
  DifficultyOptions,
  SpiceLevelOptions,
} from '@payload/collections/recipes/options'

export const Recipes: CollectionConfig = {
  slug: 'recipes',
  access: {
    read: readAccess,
    create: isAdmin,
    delete: isAdmin,
    update: updateAccess,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, context, req }) => {
        // Hook to create the slug based on the title and id
        // In a separate afterChange because we won't have the id until after the create operation
        if (operation === 'create' && doc.id && doc.title && !context.disableHooks) {
          const slug = slugify(doc.title) + '-' + doc.id

          await req.payload.update({
            collection: 'recipes',
            id: doc.id,
            data: {
              slug,
            },
            context: {
              disableHooks: true, // Prevents an infinite loop
            },
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'text',
      name: 'slug',
    },
    {
      type: 'upload',
      relationTo: 'media',
      name: 'featuredImage',
    },
    {
      type: 'checkbox',
      name: 'published',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'date',
      name: 'publishedAt',
    },
    {
      type: 'checkbox',
      name: 'aiGenerated',
      label: 'AI Generated',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'relationship',
      name: 'owner',
      relationTo: 'users',
    },
    {
      type: 'array',
      name: 'instructions',
      fields: [
        {
          type: 'textarea',
          name: 'content',
          required: true,
        },
      ],
    },
    {
      type: 'array',
      name: 'ingredients',
      fields: [
        {
          type: 'text',
          name: 'name',
        },
        {
          type: 'number',
          name: 'quantity',
        },
        {
          type: 'text',
          name: 'unit',
        },
      ],
    },
    {
      type: 'select',
      name: 'difficulty',
      options: DifficultyOptions,
    },
    {
      type: 'select',
      name: 'spiceLevel',
      options: SpiceLevelOptions,
    },
    {
      type: 'select',
      name: 'cuisinePreferences',
      hasMany: true,
      options: CuisinsePreferencesOptions,
    },
    {
      type: 'select',
      name: 'dietaryPreferences',
      hasMany: true,
      options: DietaryPreferencesOptions,
    },
    {
      type: 'text',
      name: 'calories',
    },
    {
      type: 'text',
      name: 'prepTime',
    },
    {
      type: 'number',
      name: 'servings',
    },
    {
      type: 'text',
      name: 'keywords',
      hasMany: true,
    },
  ],
}
