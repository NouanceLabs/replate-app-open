import { Endpoint } from 'payload'
import { hasLikeHandler } from './handler'

export const hasLike: Endpoint = {
  method: 'post',
  handler: hasLikeHandler,
  path: '/recipes/has-like',
}
