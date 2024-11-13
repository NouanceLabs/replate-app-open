import { createResource, For, Show } from 'solid-js'

import { cache, createAsync } from '@solidjs/router'
import { RecipeCard } from '@/components/cards/RecipeCard'
import { usePayload } from '@/lib/usePayload'
import { authenticateUser } from '@/auth/api'
import { APIOptions } from '@/lib/types'
import { Recipe } from '@payload/payload-types'
import { LoadingIndicator } from '@/components/LoadingIndicator'

const getSavedRecipes = cache(async (options?: APIOptions) => {
  'use server'
  const user = await authenticateUser()
  const payload = await usePayload()

  try {
    if (!user) {
      return []
    }

    const likesByUser = await payload.find({
      collection: 'likes',

      overrideAccess: false,
      user: user,
      depth: 2,
      select: {
        recipe: true,
      },
      limit: 100,
      where: {
        user: {
          equals: user.id,
        },
      },
      ...options,
    })

    const recipes = likesByUser.docs

    if (!recipes) {
      throw new Error('Recipe not found')
    }

    return recipes
  } catch (error) {
    console.error(error)
    return []
  }
}, 'savedRecipes')

export const SavedRecipesListing = () => {
  const [recipesDocs] = createResource(() => getSavedRecipes())

  return (
    <div class='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8'>
      <For
        each={recipesDocs()}
        fallback={
          <Show when={recipesDocs.loading}>
            <div>
              <LoadingIndicator className='mr-2' />
              Loading...
            </div>
          </Show>
        }>
        {(doc) => <RecipeCard data={doc.recipe as Recipe} />}
      </For>
    </div>
  )
}
