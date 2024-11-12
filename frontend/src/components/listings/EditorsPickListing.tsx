import { For, Show } from 'solid-js'
import { getEditorsPickRecipes } from './api'
import { createAsync } from '@solidjs/router'
import { RecipeCard } from '@/components/cards/RecipeCard'
import { Recipe } from '@payload/payload-types'

export const EditorsPickListing = () => {
  const recipes = createAsync(() => getEditorsPickRecipes())

  return (
    <div>
      <Show when={(recipes() || []).length > 0}>
        <h2 class='heading-2 mb-6 lg:mb-10'>Editor's Pick</h2>
        <div class=' grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
          <For each={recipes()} fallback={<div>Loading...</div>}>
            {(recipe) => <RecipeCard data={recipe as Recipe} />}
          </For>
        </div>
      </Show>
    </div>
  )
}
