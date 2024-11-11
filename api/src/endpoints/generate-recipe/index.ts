import { Endpoint } from 'payload'
import { generateRecipetHandler } from './handler'

export const generateRecipe: Endpoint = {
  method: 'post',
  handler: generateRecipetHandler,
  path: '/recipes/generate',
}
