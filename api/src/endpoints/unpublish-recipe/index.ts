import { Endpoint } from 'payload'
import { unpublishRecipeHandler } from './handler'

export const unpublishRecipe: Endpoint = {
  method: 'post',
  handler: unpublishRecipeHandler,
  path: '/recipes/unpublish',
}
