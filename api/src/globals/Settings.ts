import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  fields: [
    {
      type: 'relationship',
      hasMany: true,
      name: 'featuredRecipes',
      relationTo: 'recipes',
      filterOptions: {
        published: {
          equals: true,
        },
      },
    },
  ],
}
