import { Endpoint } from 'payload'
import { getUnsplashImagesHandler } from './handler'

export const getUnsplashImages: Endpoint = {
  method: 'post',
  handler: getUnsplashImagesHandler,
  path: '/unsplash/get-images',
}
