import { Endpoint } from 'payload'
import { unlikeRecipeHandler } from './handler'

export const unlikeRecipe: Endpoint = {
  method: 'post',
  handler: unlikeRecipeHandler,
  path: '/recipes/unlike',
}
