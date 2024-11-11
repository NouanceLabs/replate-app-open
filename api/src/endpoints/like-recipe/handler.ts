import { PayloadHandler } from 'payload'
import { headersWithCors } from '@payload/endpoints/headersWithCors'

export const likeRecipeHandler: PayloadHandler = async (req) => {
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

  if (!recipe.published && recipe.owner !== user.id) {
    return new Response('Not found', { status: 404, headers })
  }

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

  if (existingLike.docs[0]) {
    return new Response('Conflict', { status: 409, headers })
  }

  try {
    await payload.create({
      collection: 'likes',
      data: {
        recipe: recipeID,
        user: user.id,
      },
    })

    return new Response('Success!', { status: 200, headers })
  } catch (error) {
    payload.logger.error('Failed to like recipe', { error })
    return new Response('Internal Server Error', { status: 500, headers })
  }
}
