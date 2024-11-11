import { headersWithCors } from '@payload/endpoints/headersWithCors'
import { PayloadHandler } from 'payload'
import * as qs from 'qs-esm'

export const getUnsplashImagesHandler: PayloadHandler = async (req) => {
  const UNSPLASH_API_URL = 'https://api.unsplash.com'
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

  const { payload, user } = req

  const headers = headersWithCors({
    headers: new Headers(),
    req,
  })

  if (!UNSPLASH_ACCESS_KEY) {
    payload.logger.error('UNSPLASH_ACCESS_KEY is not set')
    return new Response('Internal Server Error', { status: 500, headers })
  }

  if (!user) {
    return new Response('Unauthorized', { status: 401, headers })
  }

  const body = req.json ? await req.json() : null

  const recipeID = body?.recipeID
  const searchQuery = body?.query

  if (!recipeID) {
    return new Response('Bad Request', { status: 400, headers })
  }

  const recipe = await payload.findByID({
    collection: 'recipes',
    id: recipeID,
    depth: 0,
  })

  if (!recipe || recipe.owner !== user.id) {
    return new Response('Not found', { status: 404, headers })
  }

  try {
    const queryObject = {
      query: searchQuery || `${recipe.title} food`,
      page: 1,
      per_page: 12,
      client_id: UNSPLASH_ACCESS_KEY,
    }

    const query = qs.stringify(queryObject)

    const response = await fetch(`${UNSPLASH_API_URL}/search/photos?${query}`, {
      method: 'get',
    })
    const images = await response.json()

    if (!response.ok) {
      payload.logger.error('Failed to fetch images from Unsplash', { response })
      return new Response('Internal Server Error', { status: 500, headers })
    }

    return new Response(JSON.stringify(images), {
      status: 200,
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
    })
  } catch (error) {
    payload.logger.error('Failed to fetch images from Unsplash', { error })
    return new Response('Internal Server Error', { status: 500, headers })
  }
}
