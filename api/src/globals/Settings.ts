import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  fields: [
    {
      type: 'relationship',
      hasMany: true,
      name: 'featuredRecipes',
      relationTo: 'recipes',
      admin: {
        allowCreate: false,
        allowEdit: false,
      },
      filterOptions: {
        published: {
          equals: true,
        },
      },
    },
    {
      type: 'relationship',
      hasMany: true,
      name: 'editorsPick',
      label: "Editor's Pick",
      relationTo: 'recipes',
      maxRows: 8,
      admin: {
        allowCreate: false,
        allowEdit: false,
      },
      filterOptions: {
        published: {
          equals: true,
        },
      },
    },
  ],
}
