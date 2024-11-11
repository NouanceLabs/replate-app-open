import { PayloadHandler } from 'payload'
import { headersWithCors } from '@payloadcms/next/utilities'

export const hasLikeHandler: PayloadHandler = async (req) => {
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

  if (!recipe) {
    return new Response('Not found', { status: 404, headers })
  }

  try {
    const existingLike = await payload.find({
      collection: 'likes',
      where: {
        and: [
          {
            user: {
              equals: user.id,
            },
          },
          { recipe: { equals: recipeID } },
        ],
      },
    })

    return new Response(String(Boolean(existingLike.docs[0])), { status: 200, headers })
  } catch (error) {
    payload.logger.error('Failed to find existing like', { error })
    return new Response('Internal Server Error', { status: 500, headers })
  }
}
