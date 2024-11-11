import { LikeButton } from '@/components/RecipeActions/LikeButton'
import { Button } from '@/components/ui/button'
import { publishRecipe, unPublishRecipe } from '@/lib/fetch'
import { Recipe } from '@payload/payload-types'
import { Accessor, createMemo, Match, Resource, Show, Switch } from 'solid-js'
import { toast } from 'solid-sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircleIcon } from '@/icons/HelpCircle'

type ActionsArgs = {
  isOwner: Accessor<boolean>
  recipe: Resource<Recipe>
  refetch: () => Promise<void>
}

export function RecipeActions({ isOwner, refetch, recipe }: ActionsArgs) {
  const isPublished = createMemo(() => recipe()?.published || false)
  const canPublish = createMemo(() => isOwner() && !isPublished() && Boolean(recipe()?.featuredImage))

  const publishRecipeSubmit = () => {
    const recipeData = recipe()
    if (recipeData?.id) {
      publishRecipe(recipeData.id).then((response) => {
        if (response.ok) {
          refetch()
          toast.success('Recipe published.')
        }
      })
    }
  }

  const unpublishRecipeSubmit = () => {
    const recipeData = recipe()
    if (recipeData?.id) {
      unPublishRecipe(recipeData.id).then((response) => {
        if (response.ok) {
          refetch()
          toast.success('Recipe unpublished.')
        }
      })
    }
  }

  return (
    <div class='flex items-center justify-center md:justify-end gap-8'>
      <Show when={recipe()}>
        <LikeButton recipe={recipe} recipeID={recipe()!.id} />
      </Show>

      <Show when={isOwner()}>
        <div class='flex items-center gap-2'>
          <Switch>
            <Match when={!isPublished()}>
              <Button disabled={!canPublish()} onClick={publishRecipeSubmit}>
                Publish recipe
              </Button>
            </Match>
            <Match when={isPublished()}>
              <Button onClick={unpublishRecipeSubmit} variant={'secondary'}>
                Unpublish recipe
              </Button>
            </Match>
          </Switch>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircleIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>Publishing your recipe will make it and your profile public to everyone.</p>
              <Show when={!canPublish()}>
                <p class='font-bold'>Add an image to be able to publish this recipe.</p>
              </Show>
            </TooltipContent>
          </Tooltip>
        </div>
      </Show>
    </div>
  )
}
