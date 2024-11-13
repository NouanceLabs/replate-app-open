import { cache, redirect, RouteDefinition, useParams } from '@solidjs/router'
import { usePayload } from '@/lib/usePayload'
import { createMemo, createResource, For, Show } from 'solid-js'
import { Image } from '@/components/Media/Image'
import { Media } from '@payload/payload-types'
import { GeneralLayout } from '@/layouts/General'
import { ClockIcon } from '@/icons/Clock'
import { FireIcon } from '@/icons/Fire'
import { LightningBoltIcon } from '@/icons/LightningBolt'
import { ChevronRightIcon } from '@/icons/ChevronRight'
import clsx from 'clsx'
import { HelpCircleIcon } from '@/icons/HelpCircle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { APIOptions } from '@/lib/types'
import { authenticateUser } from '@/auth/api'
import { PhotoSelector } from '@/components/PhotoSelector'
import { useAuth } from '@/auth/provider'
import { RecipeActions } from '@/components/RecipeActions'
import { Title, Meta } from '@solidjs/meta'
import { formatCalories, formatDifficulty } from '@/lib/utils'
import { LoadingIndicator } from '@/components/LoadingIndicator'

const getRecipe = async (slug: string, options?: APIOptions) => {
  'use server'
  const user = await authenticateUser()
  const payload = await usePayload()

  try {
    const recipeDocs = await payload.find({
      collection: 'recipes',
      where: {
        slug: {
          equals: slug,
        },
      },
      overrideAccess: false,
      user: user,
      ...options,
    })

    const recipe = recipeDocs.docs[0]

    if (!recipe) {
      throw new Error('Recipe not found')
    }

    return recipe
  } catch (error) {
    console.error(error)
    throw redirect('/')
  }
}

const cachedRecipe = cache(getRecipe, 'recipe')

export const route = {
  preload: ({ params }) => cachedRecipe(params.slug, { depth: 0 }),
} satisfies RouteDefinition

export default function RecipesPage() {
  const params = useParams<{ slug: string }>()
  const [recipe, { refetch: refetchFromResource, mutate }] = createResource(() => getRecipe(params.slug))
  const { user } = useAuth()

  const refetch = async () => {
    const recipeData = await refetchFromResource()

    if (recipeData) {
      mutate(recipeData)
    }
  }

  const isOwner = createMemo(() => {
    const owner = recipe()?.owner
    const userData = user()

    if (!owner || !userData?.id) {
      return false
    }

    if (typeof owner === 'string') {
      return owner === userData?.id
    } else {
      return owner.id === userData?.id
    }
  })

  return (
    <>
      <GeneralLayout>
        <Show
          when={recipe()}
          fallback={
            <div>
              <LoadingIndicator className='mr-2' />
            </div>
          }>
          <Title>{recipe()?.title} | Replate</Title>
          <Meta property='og:title' content={`${recipe()?.title} | Replate`} />
          <Meta property='og:title' content={`${recipe()?.title} | Replate`} />
          <div class='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-16'>
            <div class='relative justify-centerw-full md:min-h-[37.5rem] md:max-h-[50rem] md:max-w-[30rem]'>
              <Show
                when={recipe()?.featuredImage}
                fallback={
                  <Show when={recipe()}>
                    <div class='border rounded-6 w-full h-full flex items-center justify-center py-12'>
                      <PhotoSelector refetch={refetch} recipe={recipe} />
                    </div>
                  </Show>
                }>
                <Image
                  media={recipe()!.featuredImage as Media}
                  size='xlarge'
                  enableWrapper={false}
                  className='object-cover h-full w-full rounded-5'
                />

                <Tooltip>
                  <TooltipTrigger class='absolute top-4 right-4 text-white'>
                    <HelpCircleIcon /> <span class='sr-only'>Photo attribution</span>
                  </TooltipTrigger>
                  <TooltipContent class='max-w-[30rem] text-white bg-general-fg-primary'>
                    <div class='prose prose-invert'>
                      <p>{`We're using images from Unsplash to display our generated recipes. All image rights belong to the creator.`}</p>
                      <p innerHTML={(recipe()!.featuredImage as Media).attribution || ''}></p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </Show>
            </div>
            <div class='grid grid-rows-[auto] xl:col-span-2 cols-1 xl:grid-cols-[6fr_4fr] gap-16'>
              <div>
                <h1 class='heading-1 mb-4'>{recipe()!.title}</h1>

                <div class='text-general-fg-primary flex flex-col md:flex-row gap-4 mb-6'>
                  <div class='flex gap-1 items-center'>
                    <ClockIcon />
                    <span class=''>{recipe()!.prepTime?.replace('minutes', 'min')}</span>
                  </div>

                  <div class='flex gap-1 items-center'>
                    <FireIcon />
                    <span class=''>{formatCalories(recipe()!.calories!)}</span>
                  </div>

                  <div class='flex gap-1 items-center'>
                    <LightningBoltIcon />
                    <span class=''>{formatDifficulty(recipe()!.difficulty!, 'full')}</span>
                  </div>
                </div>

                <div>
                  <h2 class='heading-3 mb-4'>Instructions</h2>

                  <For each={recipe()!.instructions}>
                    {(ingredient, index) => {
                      const step = index() + 1
                      const isLast = index() === recipe()!.instructions!.length - 1

                      return (
                        <div class='relative flex items-center text-general-fg-secondary gap-2 pl-4'>
                          <div
                            class={clsx('pl-8  pb-8', {
                              'border-l border-l-general-fg-primary': !isLast,
                            })}>
                            <div class='absolute text-sm left-1 top-0 aspect-square w-6 h-6 flex items-center justify-center text-general-fg-inverse bg-general-fg-primary rounded-full'>
                              {step}
                            </div>

                            <div>{ingredient.content}</div>
                          </div>
                        </div>
                      )
                    }}
                  </For>
                </div>
              </div>

              <div>
                <RecipeActions isOwner={isOwner} recipe={recipe} refetch={refetch} />

                <h2 class='heading-3 mb-4 mt-8'>Ingredients</h2>

                <For each={recipe()!.ingredients}>
                  {(ingredient) => (
                    <div class='flex items-center text-general-fg-secondary gap-2 py-4 border-b border-b-elements-border-primary'>
                      <ChevronRightIcon />
                      <span>{ingredient.name}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Show>
      </GeneralLayout>
    </>
  )
}
