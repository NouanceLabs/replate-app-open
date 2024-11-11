import { Endpoint } from 'payload'
import { likeRecipeHandler } from './handler'

export const likeRecipe: Endpoint = {
  method: 'post',
  handler: likeRecipeHandler,
  path: '/recipes/like',
}
