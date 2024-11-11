import { authenticateUser } from '@/auth/api'
import { Button } from '@/components/ui/button'
import { HeartIcon } from '@/icons/Heart'
import { likeRecipe, unlikeRecipe } from '@/lib/fetch'
import { APIOptions } from '@/lib/types'
import { usePayload } from '@/lib/usePayload'
import { Recipe } from '@payload/payload-types'
import { createResource, Resource } from 'solid-js'
import { toast } from 'solid-sonner'

const getExistingLike = async (id: string, options?: APIOptions) => {
  'use server'
  const user = await authenticateUser()
  const payload = await usePayload()

  try {
    const likesDocs = await payload.find({
      collection: 'likes',
      where: {
        recipe: {
          equals: id,
        },
      },
      overrideAccess: false,
      user: user,
      ...options,
    })

    const recipe = likesDocs.docs[0]

    if (!recipe) {
      throw new Error('Recipe not found')
    }

    return Boolean(recipe.id)
  } catch (error) {
    console.error(error)
    return false
  }
}

interface Props {
  //isOwner: Accessor<boolean>
  recipe: Resource<Recipe>
  recipeID: string
}

export const LikeButton = ({ recipe, recipeID }: Props) => {
  const [isLiked, { mutate }] = createResource<boolean>(() => getExistingLike(recipeID), {
    initialValue: false,
  })

  const likeRecipeSubmit = () => {
    const recipeData = recipe()
    if (recipeData?.id) {
      if (isLiked()) {
        unlikeRecipe(recipeData.id).then((response) => {
          if (response.ok) {
            toast.success('Recipe unliked.')
            mutate(false)
          }
        })
      } else {
        likeRecipe(recipeData.id).then((response) => {
          if (response.ok) {
            toast.success('Recipe liked.')
            mutate(true)
          }
        })
      }
    }
  }

  return (
    <div>
      <Button onClick={likeRecipeSubmit} variant='ghost' class='px-2 text-primary-foreground'>
        <HeartIcon enableFill={isLiked} class='fill-none' />
        <span class='sr-only'>{isLiked() ? 'Unlike' : 'Like'}</span>
      </Button>
    </div>
  )
}
