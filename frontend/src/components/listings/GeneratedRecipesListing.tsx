import { createResource, For, Show } from 'solid-js'

import { cache, createAsync } from '@solidjs/router'
import { RecipeCard } from '@/components/cards/RecipeCard'
import { usePayload } from '@/lib/usePayload'
import { authenticateUser } from '@/auth/api'
import { APIOptions } from '@/lib/types'
import { Recipe } from '@payload/payload-types'

const getGeneratedRecipes = cache(async (options?: APIOptions) => {
  'use server'
  const user = await authenticateUser()
  const payload = await usePayload()

  try {
    if (!user) {
      return []
    }

    const recipesByUser = await payload.find({
      collection: 'recipes',
      overrideAccess: false,
      user: user,
      depth: 1,
      limit: 100,
      where: {
        owner: {
          equals: user.id,
        },
      },
      ...options,
    })

    const recipes = recipesByUser.docs

    if (!recipes) {
      throw new Error('Recipes not found')
    }

    return recipes
  } catch (error) {
    console.error(error)
    return []
  }
}, 'generatedRecipes')

export const GeneratedRecipesListing = () => {
  const [recipesDocs] = createResource(() => getGeneratedRecipes())

  return (
    <div class='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8'>
      <For
        each={recipesDocs()}
        fallback={
          <Show when={recipesDocs.loading}>
            <div>Loading...</div>
          </Show>
        }>
        {(recipe) => <RecipeCard data={recipe} />}
      </For>
    </div>
  )
}
