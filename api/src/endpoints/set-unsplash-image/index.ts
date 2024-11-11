import { Endpoint } from 'payload'
import { setUnsplashImageHandler } from './handler'

export const setUnsplashImage: Endpoint = {
  method: 'post',
  handler: setUnsplashImageHandler,
  path: '/unsplash/set-image',
}
