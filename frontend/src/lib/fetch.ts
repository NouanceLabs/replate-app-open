import { usePayloadAPI } from '@/lib/usePayload'
import { Recipe, User } from '@payload/payload-types'
import * as qs from 'qs-esm'

export const getUnsplashImages = async (recipeID: string, query?: string) => {
  const response = usePayloadAPI('/unsplash/get-images', {
    method: 'POST',
    body: JSON.stringify({ recipeID, query }),
  })

  return response
}

export const setUnsplashImage = async (recipeID: string, imageID: string) => {
  const response = usePayloadAPI('/unsplash/set-image', {
    method: 'POST',
    body: JSON.stringify({ recipeID, imageID }),
  })

  return response
}

export const publishRecipe = async (recipeID: string) => {
  const response = usePayloadAPI('/recipes/publish', {
    method: 'POST',
    body: JSON.stringify({ recipeID }),
  })

  return response
}

export const unPublishRecipe = async (recipeID: string) => {
  const response = usePayloadAPI('/recipes/unpublish', {
    method: 'POST',
    body: JSON.stringify({ recipeID }),
  })

  return response
}

export const likeRecipe = async (recipeID: string) => {
  const response = usePayloadAPI('/recipes/like', {
    method: 'POST',
    body: JSON.stringify({ recipeID }),
  })

  return response
}

export const unlikeRecipe = async (recipeID: string) => {
  const response = usePayloadAPI('/recipes/unlike', {
    method: 'POST',
    body: JSON.stringify({ recipeID }),
  })

  return response
}

export const hasLike = async (recipeID: string) => {
  const query = qs.stringify({
    where: {
      recipe: { equals: recipeID },
    },
    depth: 1,
    limit: 1,
    select: {
      recipe: true,
    },
  })

  const response = await usePayloadAPI(`/likes?${query}`, {
    method: 'GET',
    headers: {},
  })

  if (response.ok) {
    const data = await response.json()

    if (data.docs.length > 0) {
      return true
    }
  }

  return false
}

export const updateIngredientsClient = async (userID: string, ingredients: string[]) => {
  const response = await usePayloadAPI(`/users/${userID}`, {
    method: 'PATCH',
    body: JSON.stringify({ ingredients: ingredients.length > 0 ? ingredients.map((ingredient) => ({ ingredient })) : [] }),
  })

  if (response.ok) {
    const data = await response.json()

    if (data) {
      const formattedIngredients: string[] = []

      data.doc.ingredients?.forEach((item: NonNullable<NonNullable<User['ingredients']>[number]>) => {
        if (item.ingredient) {
          formattedIngredients.push(item.ingredient)
        }
      })

      return formattedIngredients
    }
  }

  return false
}

export const generateRecipeClient = async (body: string) => {
  const response = await usePayloadAPI(`/recipes/generate`, {
    method: 'POST',
    body,
  })

  if (response.ok) {
    const data = await response.json()

    if (data) {
      return data as Recipe
    }
  }

  return response.status
}

export const getRecipeByIDClient = async (id: string) => {
  const response = await usePayloadAPI(`/recipes/${id}`, {
    method: 'GET',
    headers: {},
  })

  if (response.ok) {
    const data = await response.json()
    console.log({ data })
    if (data) {
      return data as Recipe
    }
  }

  return response.status
}
