import { PayloadHandler } from 'payload'
import { responseFormat, systemMessage } from './prompt'

import OpenAI from 'openai'
import { Recipe } from '@payload/payload-types'
import { headersWithCors } from '@payloadcms/next/utilities'

const OPENAI_SECRET_KEY = process.env.OPENAI_SECRET_KEY
const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID
const DEBUG = process.env.DEBUG

export const generateRecipetHandler: PayloadHandler = async (req) => {
  const { payload, user } = req

  const headers = headersWithCors({
    headers: new Headers(),
    req,
  })

  if (!OPENAI_SECRET_KEY || !OPENAI_PROJECT_ID) {
    payload.logger.error('OPENAI_SECRET_KEY or OPENAI_PROJECT_ID is not set')
    return new Response('Internal Server Error', { status: 500, headers })
  }

  if (!user) {
    return new Response('Unauthorized', { status: 401, headers })
  }

  const body = req.json ? await req.json() : null

  const ingredients: string = body?.ingredients
  const spiceLevel: Recipe['spiceLevel'] = body?.spiceLevel || 'mild'
  const dietaryPreferences: string = body?.dietaryPreferences || 'none'
  const cuisinePreferences: string = body?.cuisinePreferences || 'none'
  const difficulty: Recipe['difficulty'] = body?.difficulty || 'intermediate'
  const servings: Recipe['servings'] = body?.servings || 2

  if (!ingredients) {
    return new Response('Bad Request', { status: 400, headers })
  }

  try {
    const openai = new OpenAI({
      apiKey: OPENAI_SECRET_KEY,
      project: OPENAI_PROJECT_ID,
    })

    const promptMessage = `Create a recipe using the following ingredients: ${ingredients}. Spice level: ${spiceLevel}. Dietary preferences: ${dietaryPreferences}. Cuisine preferences: ${cuisinePreferences}. Difficulty: ${difficulty}. Servings: ${servings}`

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      model: 'gpt-4o-mini',
      messages: [systemMessage, { role: 'user', content: promptMessage }],
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: responseFormat,
    }

    if (DEBUG) {
      console.log('Prompting with message ', { promptMessage })
    }

    const response = await openai.chat.completions.create(params)

    if (DEBUG) {
      console.log('OPENAI response', { response })
    }

    if (!response.choices[0].message.content) {
      payload.logger.error('OPENAI didnt respond with the right message contents', { response })
      return new Response('Internal Server Error', { status: 500, headers })
    }

    const recipeData = JSON.parse(response.choices[0].message.content)

    const recipe = await payload.create({
      collection: 'recipes',
      depth: 0,
      data: {
        ...recipeData,
        spiceLevel,
        difficulty,
        aiGenerated: true,
        owner: user.id,

        servings: Number(servings),
        ...(dietaryPreferences === 'none'
          ? { dietaryPreferences: undefined }
          : { dietaryPreferences: dietaryPreferences.split(',') }),
        ...(cuisinePreferences === 'none'
          ? { cuisinePreferences: undefined }
          : { cuisinePreferences: cuisinePreferences.split(',') }),
      },
    })

    const createdPrompt = await payload.create({
      collection: 'prompts',
      data: {
        inputPrompt: { message: promptMessage },
        fullPrompt: {
          messages: [systemMessage, { role: 'user', content: promptMessage }],
        },
        fullResponse: { message: response.choices[0].message.content },
        owner: user.id,
        recipe: recipe.id,
        title: `${recipe.title} by ${user.username || user.email}`,
        createdAt: recipe.createdAt,
        model: 'gpt-4o-mini',
      },
    })

    return new Response(JSON.stringify(recipe), { status: 200, headers })
  } catch (error) {
    payload.logger.error('Failed to generate recipe', { error })
    return new Response('Internal Server Error', { status: 500, headers })
  }
}
