import { TextField, TextFieldInput, TextFieldLabel } from '@/components/ui/text-field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldGroup,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { authenticateUser } from '@/auth/api'
import { SearchIcon } from '@/icons/Search'
import { createEffect, createResource, createSignal, For, JSX, Show } from 'solid-js'
import { usePayload } from '@/lib/usePayload'
import { IngredientItem } from '@/components/IngredientItem'
import { Button } from '@/components/ui/button'
import { Recipe } from '@payload/payload-types'
import { CuisinsePreferencesOptions, DietaryPreferencesOptions, SpiceLevelOptions } from '@payload/collections/recipes/options'
import { Label } from '@/components/ui/label'
import { SummaryItem } from '@/components/SummaryItem'
import { toast } from 'solid-sonner'
import { generateRecipeClient, getRecipeByIDClient } from '@/lib/fetch'
import { reload, useNavigate } from '@solidjs/router'

const getIngredients = async () => {
  'use server'
  const user = await authenticateUser()
  const payload = await usePayload()

  if (user) {
    const userData = await payload.findByID({
      collection: 'users',
      id: user.id,
      overrideAccess: false,
      depth: 0,
      user: user,
    })

    const formattedIngredients: string[] = []

    userData.ingredients?.forEach((item) => {
      if (item.ingredient) {
        formattedIngredients.push(item.ingredient)
      }
    })

    if (formattedIngredients) return formattedIngredients
  }

  return []
}

type SpiceLevel = NonNullable<Recipe['spiceLevel']>
type DifficultyLevel = NonNullable<Recipe['difficulty']>
type CuisineOption = (typeof CuisinsePreferencesOptions)[number]
type DietaryOption = (typeof DietaryPreferencesOptions)[number]
type SpiceOption = (typeof SpiceLevelOptions)[number]['value']

export function GenerateForm() {
  const navigate = useNavigate()
  const [initialIngredients] = createResource(() => getIngredients())

  // We manage the ingredient list in a separate state so we can add and remove items without affecting the form state
  const [ingredients, setIngredients] = createSignal<string[]>([])

  const [difficulty, setDifficultySignal] = createSignal<DifficultyLevel>('beginner')
  const [servings, setServings] = createSignal<number>(2)
  const [cuisinePreferences, setCuisinePreferences] = createSignal<CuisineOption[]>([])
  const [spiceLevel, setSpiceLevelSignal] = createSignal<SpiceOption>('mild')
  const [dietaryPreferences, setDietaryPreferences] = createSignal<DietaryOption[]>([])

  const [ingredientInput, setIngredientInput] = createSignal<string>('')
  const [submissionDialogOpen, setSubmissionDialogOpen] = createSignal<boolean>(false)
  const [pantryDialogOpen, setPantryDialogOpen] = createSignal<boolean>(false)

  // Adding this handle so that spice level cannot be null
  const setSpiceLevel = (value: string | null) => {
    if (value) setSpiceLevelSignal(value as SpiceLevel)
  }

  const setDifficulty = (value: string | null) => {
    if (value) setDifficultySignal(value as DifficultyLevel)
  }

  const insertIngredientFromInput: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault()

    const ingredient = ingredientInput()
    if (ingredient) {
      setIngredients((prev) => [...prev, ingredient])
      setIngredientInput('')
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients((prev) => prev.filter((item) => item !== ingredient))
  }

  const insertIngredient = (ingredient: string) => {
    setIngredients((prev) => [...prev, ingredient])
  }

  const removeCuisineItem = (label: string) => {
    setCuisinePreferences((prev) => {
      const filteredList = prev.filter((item) => item.label !== label)

      return filteredList
    })
  }

  const removeDietaryItem = (label: string) => {
    setDietaryPreferences((prev) => {
      const filteredList = prev.filter((item) => item.label !== label)

      return filteredList
    })
  }

  const generateRecipe = async () => {
    const cuisines = cuisinePreferences()
    const dietary = dietaryPreferences()

    const input = {
      ingredients: ingredients().join(','),
      spiceLevel: spiceLevel(),
      difficulty: difficulty(),
      servings: servings(),
      cuisinePreferences: cuisines.length > 0 ? cuisines.map((item) => item.value).join(',') : undefined,
      dietaryPreferences: dietary.length > 0 ? dietary.map((item) => item.value).join(',') : undefined,
    }

    const generatedRecipe = await generateRecipeClient(JSON.stringify(input))

    if (typeof generatedRecipe === 'number') {
      toast.error('An error occurred while generating the recipe. Refreshing.')
      reload()
    } else {
      toast.promise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            getRecipeByIDClient(generatedRecipe.id)
              .then((data) => {
                if (typeof data !== 'number' && data.slug) {
                  navigate(`/recipes/${data.slug}`)
                  resolve(true)
                } else {
                  throw new Error('An error occurred while redirecting.')
                }
              })
              .catch((err) => reject(err))
          }, 3000)
        }),
        {
          loading: 'Recipe generated! Redirecting....',
          success: 'Successfully redirected!',
          error: 'An error occurred while redirecting.',
        }
      )
    }
  }

  const submitGeneration: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    event.preventDefault()

    if (ingredients().length === 0) {
      toast.error('Please add at least one ingredient.')
    }

    setSubmissionDialogOpen(true)
    generateRecipe()
  }

  const ingredientExists = (ingredient: string) => {
    const ingredientList = ingredients()

    return Boolean(ingredientList.find((item) => item.toLowerCase() === ingredient.toLowerCase()))
  }

  return (
    <div class='grid gap-[8rem]'>
      <div class='flex flex-col gap-6'>
        <div class='flex flex-col gap-12 xl:flex-row'>
          <form class='flex flex-col gap-3' onSubmit={insertIngredientFromInput}>
            <div>
              <div class='relative display flex items-baseline'>
                <p class='md:absolute -left-8 mr-2 heading-1 text-general-brand-accent'>1</p>
                <h2 class='heading-1 mb-4'>Add your ingredients</h2>
              </div>
              <p class='mb-12'>
                Ingredients here are not persisted to your profile so feel free to remove and add items as needed for this specific recipe.
              </p>

              <div class='flex flex-col md:flex-row items-start md:items-center gap-4'>
                <div class='flex gap-2'>
                  <TextField class='gap-1' onChange={setIngredientInput} value={ingredientInput()}>
                    <TextFieldLabel class='sr-only'>Add an ingredient</TextFieldLabel>
                    <div class='relative'>
                      <TextFieldInput
                        class='max-w-[32rem] indent-5 placeholder:text-primary-foreground/80'
                        /* {...props} */
                        type='text'
                        placeholder='Add your ingredient'
                      />
                      <SearchIcon class='absolute w-4 left-2 top-2 pointer-events-none text-general-fg-secondary' />
                    </div>
                  </TextField>
                  <Button type='submit' class='' disabled={false}>
                    Insert
                  </Button>
                </div>
                <Show when={initialIngredients()?.length}>
                  <Dialog open={pantryDialogOpen()} onOpenChange={setPantryDialogOpen}>
                    <DialogTrigger as={Button} variant='secondary'>
                      From my pantry
                    </DialogTrigger>
                    <DialogContent class=''>
                      <h3 class='text-sm font-medium'>From my pantry</h3>
                      <ul class='max-h-[30rem] overflow-y-auto lg:max-h-none grid grid-cols-1 lg:grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] gap-8'>
                        <For each={initialIngredients()}>
                          {(ingredient) => (
                            <Show when={!ingredientExists(ingredient)}>
                              <IngredientItem ingredient={ingredient} onInsert={insertIngredient} as='li' />
                            </Show>
                          )}
                        </For>
                      </ul>
                    </DialogContent>
                  </Dialog>
                </Show>
              </div>
            </div>
          </form>
        </div>

        <div>
          <Show when={ingredients().length} fallback={<div class='mb-8'>No ingredients have been added.</div>}>
            <ul class='max-h-[30rem] mb-12 overflow-y-auto lg:max-h-none grid grid-cols-1 lg:grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] gap-8'>
              <For each={ingredients()}>
                {(ingredient) => <IngredientItem ingredient={ingredient} onRemove={removeIngredient} as='li' />}
              </For>
            </ul>
          </Show>
        </div>
      </div>

      <div>
        <div class='relative display flex items-baseline'>
          <p class='md:absolute -left-8 mr-2 heading-1 text-general-brand-accent'>2</p>
          <h2 class='heading-1 mb-4'>Cuisine Preferences</h2>
        </div>

        <Select
          value={cuisinePreferences()}
          onChange={setCuisinePreferences}
          // @ts-expect-error
          optionValue={'value'}
          optionLabel={'label'}
          closeOnSelection={true}
          multiple={true}
          options={CuisinsePreferencesOptions}
          placeholder='Select a preferred cuisine…'
          // @ts-expect-error
          itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>}>
          <SelectTrigger aria-label='Preferred cuisine' class='bg-white'>
            <SelectValue<CuisineOption>>
              {(state) => {
                const selected = state.selectedOptions()

                if (selected) return selected.map((item) => item.label).join(', ')
                return ''
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
        <p class='mt-2 text-sm text-general-fg-secondary'>You can choose multiple</p>

        <Show when={cuisinePreferences().length} fallback={<div class='mt-8'>No cuisine preferences selected. We'll be creative!</div>}>
          <ul class='mt-4'>
            <For each={cuisinePreferences()}>
              {(cuisine) => <IngredientItem ingredient={cuisine.label} onRemove={removeCuisineItem} as='li' />}
            </For>
          </ul>
        </Show>
      </div>

      <div>
        <div class='relative display flex items-baseline'>
          <p class='md:absolute -left-8 mr-2 heading-1 text-general-brand-accent'>3</p>
          <h2 class='heading-1 mb-4'>Dietary Preferences</h2>
        </div>

        <Select
          value={dietaryPreferences()}
          onChange={setDietaryPreferences}
          // @ts-expect-error
          optionValue={'value'}
          optionLabel={'label'}
          multiple={true}
          closeOnSelection={true}
          options={DietaryPreferencesOptions}
          placeholder='Select any dietary preferences…'
          // @ts-expect-error
          itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>}>
          <SelectTrigger aria-label='Dietary preferences' class='bg-white'>
            <SelectValue<DietaryOption>>
              {(state) => {
                const selected = state.selectedOptions()

                if (selected) return selected.map((item) => item.label).join(', ')
                return ''
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
        <p class='mt-2 text-sm text-general-fg-secondary'>You can choose multiple</p>

        <Show when={dietaryPreferences().length} fallback={<div class='mt-8'>No dietary preferences selected.</div>}>
          <ul class='mt-4'>
            <For each={dietaryPreferences()}>
              {(diet) => <IngredientItem ingredient={diet.label} onRemove={removeDietaryItem} as='li' />}
            </For>
          </ul>
        </Show>
      </div>

      <div>
        <div class='relative display flex items-baseline mb-8 lg:mb-10'>
          <p class='md:absolute -left-8 mr-2 heading-1 text-general-brand-accent'>4</p>
          <h2 class='heading-1 mb-4'>Spice Level</h2>
        </div>

        <div class='flex justify-center'>
          <ToggleGroup
            defaultValue='mild'
            onChange={setSpiceLevel}
            value={spiceLevel()}
            aria-required={true}
            variant='card'
            size='card'
            multiple={false}
            class='grid grid-cols-1 xs:grid-cols-3 xl:grid-cols-3 gap-4 xl:gap-12 max-w-[48rem] justify-center items-stretch'>
            <ToggleGroupItem value='mild' as='div' class=' '>
              <div class='text-center'>
                <img
                  class='rounded-full mb-4'
                  alt='spice level hot habanero pepper'
                  src='/images/spice-level-mild.jpg'
                  height={512}
                  width={512}
                  loading='lazy'
                />
                <p class='heading-5 md:heading-4'>Mild</p>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem value='medium' as='div' class=' '>
              <div class='text-center'>
                <img
                  class='rounded-full mb-4'
                  alt='spice level hot habanero pepper'
                  src='/images/spice-level-medium.jpg'
                  height={512}
                  width={512}
                  loading='lazy'
                />
                <p class='heading-5 md:heading-4'>Medium</p>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem value='hot' as='div' class=' '>
              <div class='text-center'>
                <img
                  class='rounded-full mb-4'
                  alt='spice level hot habanero pepper'
                  src='/images/spice-level-hot.jpeg'
                  height={512}
                  width={512}
                  loading='lazy'
                />
                <p class='heading-5 md:heading-4'>Spicy</p>
              </div>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div>
        <div class='relative display flex items-baseline mb-8 lg:mb-10'>
          <p class='md:absolute -left-8 mr-2 heading-1 text-general-brand-accent'>5</p>
          <h2 class='heading-1 mb-4'>Cooking level</h2>
        </div>

        <div class='flex justify-center'>
          <ToggleGroup
            defaultValue='mild'
            onChange={setDifficulty}
            value={difficulty()}
            aria-required={true}
            variant='card'
            size='card'
            multiple={false}
            class='grid grid-cols-1 xs:grid-cols-3 xl:grid-cols-3 gap-4 xl:gap-12 max-w-[48rem] justify-center items-stretch'>
            <ToggleGroupItem value='beginner' as='div' class=' '>
              <div class='text-center'>
                <img
                  class='rounded-full mb-4'
                  alt='spice level hot habanero pepper'
                  src='/images/difficulty-beginner.jpeg'
                  height={512}
                  width={512}
                  loading='lazy'
                />
                <p class='heading-5 md:heading-4'>Beginner</p>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem value='intermediate' as='div' class=' '>
              <div class='text-center'>
                <img
                  class='rounded-full mb-4'
                  alt='spice level hot habanero pepper'
                  src='/images/difficulty-intermediate.jpeg'
                  height={512}
                  width={512}
                  loading='lazy'
                />
                <p class='heading-5 md:heading-4'>Intermediate</p>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem value='pro' as='div' class=' '>
              <div class='text-center'>
                <img
                  class='rounded-full mb-4'
                  alt='spice level hot habanero pepper'
                  src='/images/difficulty-pro.jpeg'
                  height={512}
                  width={512}
                  loading='lazy'
                />
                <p class='heading-5 md:heading-4'>Pro</p>
              </div>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div>
        <div class='relative display flex items-baseline mb-8'>
          {/* <p class='md:absolute -left-8 mr-2 heading-1 text-general-brand-accent'>check</p> */}
          <h2 class='heading-1 mb-4'>Ready!</h2>
        </div>
        <div class='flex flex-col gap-8 bg-white shadow-sm p-8 rounded-5 lg:rounded-10'>
          <div class=''>
            <h2 class='heading-4'>Servings</h2>
            <Label for='servings-field-input' class='sr-only'>
              Servings
            </Label>
            <NumberField
              id={'servings-field'}
              class='w-36'
              //defaultValue={1}
              value={servings()}
              onChange={setServings}
              minValue={1}
              maxValue={12}>
              <NumberFieldGroup>
                <NumberFieldInput />
                <NumberFieldIncrementTrigger />
                <NumberFieldDecrementTrigger />
              </NumberFieldGroup>
            </NumberField>
          </div>

          <div>
            <SummaryItem label='Ingredients' value={ingredients} />
            <SummaryItem label='Cuisine Preferences' value={cuisinePreferences} />
            <SummaryItem label='Dietary Preferences' value={dietaryPreferences} />
            <SummaryItem label='Spice Level' value={spiceLevel} />
            <SummaryItem label='Difficulty' value={difficulty} />
            <SummaryItem label='Servings' value={servings} />
          </div>

          <div class=''>
            <Button type='submit' onClick={submitGeneration}>
              Generate recipe
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={submissionDialogOpen()} onOpenChange={() => {}}>
        <DialogContent showCloseButton={false} class='brand-gradient'>
          <img loading='lazy' src='/images/loading-gif.gif' alt='Loading animation...' />
          <p class='sr-only'>Generating recipe please wait</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
