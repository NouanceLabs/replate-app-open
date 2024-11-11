import { Endpoint } from 'payload'
import { publishRecipeHandler } from './handler'

export const publishRecipe: Endpoint = {
  method: 'post',
  handler: publishRecipeHandler,
  path: '/recipes/publish',
}
