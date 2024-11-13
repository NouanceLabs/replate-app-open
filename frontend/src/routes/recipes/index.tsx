import { usePayload } from '@/lib/usePayload'
import { GeneralLayout } from '@/layouts/General'
import { authenticateUser } from '@/auth/api'
import { createResource, createSignal, For } from 'solid-js'
import { RecipeCard } from '@/components/cards/RecipeCard'
import { TextField, TextFieldInput } from '@/components/ui/text-field'
import { SearchIcon } from '@/icons/Search'
import { debounce } from '@solid-primitives/scheduled'
import { Title, Meta } from '@solidjs/meta'
interface SearchArgs {
  query?: string
  page?: number
}

const getRecipesSearchResults = async ({ query, page }: SearchArgs = {}) => {
  'use server'
  const user = await authenticateUser()
  const payload = await usePayload()

  const recipes = await payload.find({
    collection: 'recipes',
    user: user,
    overrideAccess: false,
    page: 1,
    limit: 12,
    where: {
      and: [
        {
          published: {
            equals: true,
          },
        },
        ...(query
          ? [
              {
                title: {
                  like: query,
                },
              },
            ]
          : []),
      ],
    },
  })

  return recipes.docs
}

export default function RecipesPage() {
  const [debouncedSearch, setDebouncedSearch] = createSignal<SearchArgs>({ query: '' })
  const [recipes] = createResource(debouncedSearch, getRecipesSearchResults)

  const trigger = debounce((value: string) => {
    setDebouncedSearch((prev) => ({ ...prev, query: value }))
  }, 250)

  return (
    <>
      <Title>Recipes | Replate</Title>
      <Meta property='og:title' content='Recipes | Replate' />
      <Meta property='og:title' content='Recipes | Replate' />
      <GeneralLayout>
        <div class='mb-[6.25rem] '>
          <h1 class='heading-1 mb-12'>Browse for recipes</h1>
          <TextField onChange={trigger} class='max-w-[32rem] relative'>
            <TextFieldInput type='search' placeholder='Search for a recipe…' />
            <SearchIcon class='absolute right-3 top-2 pointer-events-none' />
          </TextField>
        </div>

        <div class='grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
          <For each={recipes()}>{(recipe) => <RecipeCard data={recipe} />}</For>
        </div>
      </GeneralLayout>
    </>
  )
}
