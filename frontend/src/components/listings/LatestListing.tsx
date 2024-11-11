import { For } from 'solid-js'
import { getLatestRecipes } from './api'
import { createAsync } from '@solidjs/router'
import { RecipeCard } from '@/components/cards/RecipeCard'

export const LatestListing = () => {
  const recipes = createAsync(() => getLatestRecipes())

  return (
    <div>
      <h2 class='heading-2 mb-6 lg:mb-10'>Latest recipes</h2>
      <div class=' grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
        <For each={recipes()} fallback={<div>Loading...</div>}>
          {(recipe) => <RecipeCard data={recipe} />}
        </For>
      </div>
    </div>
  )
}
