import type { SubmitHandler } from '@modular-forms/solid'
import { createForm, getValue, reset, setValue, setValues } from '@modular-forms/solid'
import { TextField, TextFieldInput, TextFieldLabel, TextFieldErrorMessage } from '@/components/ui/text-field'
import { Button } from '@/components/ui/button'

import * as v from 'valibot'

import { authenticateUser, loginClient } from '@/auth/api'
import { toast } from 'solid-sonner'
import { action, useAction, useNavigate } from '@solidjs/router'
import { SearchIcon } from '@/icons/Search'
import { createEffect, createMemo, createResource, createSignal, For, Show } from 'solid-js'
import { usePayload } from '@/lib/usePayload'
import { TrashIcon } from '@/icons/Trash'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { updateIngredientsClient } from '@/lib/fetch'
import { IngredientItem } from '@/components/IngredientItem'
import { useAuth } from '@/auth/provider'

const IngredientsSchema = v.object({
  ingredient: v.string('Your ingredient must be a string.'),
})

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
      // Something weird going on here, leaving it out for now
      /* select: {
        ingredients: {
          ingredient: true,
        },
      }, */
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

export type IngredientsFormType = v.InferOutput<typeof IngredientsSchema>

export function IngredientsForm() {
  const [initialIngredients, { mutate }] = createResource(() => getIngredients())
  const { user } = useAuth()

  // We manage the ingredient list in a separate state so we can add and remove items without affecting the form state
  const [managedIngredients, setManagedIngredients] = createSignal<string[]>(initialIngredients() || [])

  const [resetDialogOpen, setResetDialogOpen] = createSignal<boolean>(false)

  const [ingredientsForm, { Form, Field }] = createForm<IngredientsFormType>()

  createEffect(() => {
    if (initialIngredients()) setManagedIngredients(initialIngredients() || [])
  })

  const handleSubmit: SubmitHandler<IngredientsFormType> = ({ ingredient }) => {
    setManagedIngredients((prev) => [...prev, ingredient])
    reset(ingredientsForm, { keepDirty: true, keepSubmitCount: true, keepSubmitted: true, keepTouched: true })
  }

  const removeIngredient = (ingredient: string) => {
    setManagedIngredients((prev) => prev.filter((item) => item !== ingredient))
  }

  const resetForm = () => {
    setManagedIngredients(initialIngredients() || [])
    setResetDialogOpen(false)
    reset(ingredientsForm, { keepDirty: false, keepSubmitCount: false, keepSubmitted: false, keepTouched: false })
  }

  const confirmForm = async () => {
    const userData = user()

    if (userData) {
      const response = await updateIngredientsClient(userData.id, managedIngredients())

      if (response) mutate(response)
      reset(ingredientsForm, { keepDirty: false, keepSubmitCount: false, keepSubmitted: false, keepTouched: false })
      toast.success('Your ingredients have been updated.')
    }
  }

  const showActions = createMemo(() => {
    return ingredientsForm.submitted || initialIngredients()?.length !== managedIngredients().length
  })

  return (
    <div class='grid gap-6'>
      <div class='flex flex-col gap-12 xl:flex-row'>
        <Form onSubmit={handleSubmit} class='flex-grow'>
          <div class='flex flex-col gap-3'>
            <div>
              <h1 class='heading-1 mb-4'>Add your ingredients</h1>
              <p class='mb-12'>
                These ingredients will be saved to your profile. So you can always save the things you have handy at home.
              </p>
              <Field name='ingredient'>
                {(field, props) => (
                  <TextField
                    class='gap-1'
                    validationState={field.error ? 'invalid' : 'valid'}
                    value={(field.value as unknown as string) || ''}>
                    <TextFieldLabel class='sr-only'>Add an ingredient</TextFieldLabel>
                    <div class='relative mt-2'>
                      <TextFieldInput
                        class='max-w-[32rem] indent-5 placeholder:text-primary-foreground/80'
                        {...props}
                        type='text'
                        placeholder='Add your ingredient'
                      />
                      <SearchIcon class='absolute w-4 left-2 top-2 pointer-events-none text-general-fg-secondary' />
                    </div>
                    <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
                  </TextField>
                )}
              </Field>
            </div>

            <Button type='submit' class='sr-only' disabled={ingredientsForm.submitting}>
              {ingredientsForm.submitting && <div class='mr-2 size-4 animate-spin'>...loading</div>}
              Insert
            </Button>
          </div>
        </Form>
        <div class='flex gap-4'>
          <Dialog open={resetDialogOpen()} onOpenChange={setResetDialogOpen}>
            <Show when={showActions()}>
              <DialogTrigger as={Button} variant={'secondary'}>
                Reset
              </DialogTrigger>
            </Show>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>You will lose your updated list of ingredients.</DialogDescription>
                <DialogFooter>
                  <Button onClick={resetForm} variant='destructive'>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Show when={showActions()}>
            <Button class='whitespace-nowrap' variant={'default'} onClick={confirmForm}>
              Confirm changes
            </Button>
          </Show>
        </div>
      </div>

      <div>
        <Show when={managedIngredients().length} fallback={<div>No ingredients have been added.</div>}>
          <ul class='grid grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] gap-8'>
            <For each={managedIngredients()}>
              {(ingredient) => <IngredientItem ingredient={ingredient} onRemove={removeIngredient} as='li' />}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  )
}
