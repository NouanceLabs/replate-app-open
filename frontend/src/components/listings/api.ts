import { usePayload } from '@/lib/usePayload'
import { cache } from '@solidjs/router'

export const getLatestRecipes = cache(async () => {
  'use server'
  const payload = await usePayload()

  const recipes = await payload.find({
    collection: 'recipes',
    limit: 8,
    sort: '-publishedAt',
    where: {
      published: {
        equals: true,
      },
    },
  })

  return recipes.docs || []
}, 'getLatestRecipes')

export const getEditorsPickRecipes = cache(async () => {
  'use server'
  const payload = await usePayload()

  const settings = await payload.findGlobal({
    slug: 'settings',
    depth: 3,
  })

  return settings.editorsPick?.filter((recipe) => typeof recipe !== 'string') || []
}, 'getEditorsPickRecipes')

export const getFeaturedRecipes = cache(async () => {
  'use server'
  const payload = await usePayload()

  const settings = await payload.findGlobal({
    slug: 'settings',
    depth: 3,
  })

  return settings.featuredRecipes?.filter((recipe) => typeof recipe !== 'string') || []
}, 'getFeaturedRecipes')
