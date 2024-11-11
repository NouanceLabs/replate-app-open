import { PayloadHandler } from 'payload'
import { headersWithCors } from '@payload/endpoints/headersWithCors'

export const unpublishRecipeHandler: PayloadHandler = async (req) => {
  const { payload, user } = req

  const headers = headersWithCors({
    headers: new Headers(),
    req,
  })

  if (!user) {
    return new Response('Unauthorized', { status: 401, headers })
  }

  const body = req.json ? await req.json() : null

  const recipeID = body?.recipeID

  if (!recipeID) {
    return new Response('Bad Request', { status: 400, headers })
  }

  const recipe = await payload.findByID({
    collection: 'recipes',
    id: recipeID,
    depth: 0,
  })

  if (!recipe || recipe.owner !== user.id || !recipe.published) {
    return new Response('Not found', { status: 404, headers })
  }

  try {
    await payload.update({
      collection: 'recipes',
      id: recipeID,
      data: {
        published: false,
        publishedAt: null,
      },
    })

    return new Response('Success!', { status: 200, headers })
  } catch (error) {
    payload.logger.error('Failed to unpublish recipe', { error })
    return new Response('Internal Server Error', { status: 500, headers })
  }
}
