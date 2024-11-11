import { usePayload } from '@/lib/usePayload'
import { cache } from '@solidjs/router'

export const getLatestRecipes = cache(async () => {
  'use server'
  const payload = await usePayload()

  const recipes = await payload.find({
    collection: 'recipes',
    limit: 4,
    sort: '-publishedAt',
    where: {
      published: {
        equals: true,
      },
    },
  })

  return recipes.docs || []
}, 'getLatestRecipes')
