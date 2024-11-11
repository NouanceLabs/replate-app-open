import OpenAI from 'openai'

export const responseFormat: OpenAI.Chat.ChatCompletionCreateParams['response_format'] = {
  type: 'json_schema',
  json_schema: {
    name: 'recipe_schema',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the recipe.',
        },
        instructions: {
          type: 'array',
          description: 'A list of steps to prepare the recipe.',
          items: {
            type: 'object',
            properties: {
              content: {
                type: 'string',
                description: 'Text content describing a step in the recipe.',
              },
            },
            required: ['content'],
            additionalProperties: false,
          },
        },
        ingredients: {
          type: 'array',
          description: 'List of ingredients required for the recipe.',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the ingredient.',
              },
            },
            required: ['name'],
            additionalProperties: false,
          },
        },
        difficulty: {
          type: 'string',
          description: 'The difficulty level of the recipe.',
        },
        spiceLevel: {
          type: 'string',
          description: 'The spiciness level of the recipe.',
        },
        cuisinePreferences: {
          type: 'string',
          description: 'Dietary preferences related to the recipe.',
        },
        dietaryPreferences: {
          type: 'string',
          description: 'Dietary preferences related to the recipe.',
        },
        calories: {
          type: 'string',
          description: 'Caloric content of the recipe.',
        },
        prepTime: {
          type: 'string',
          description: 'Preparation time required for the recipe.',
        },
        keywords: {
          type: 'array',
          description: 'An array containing a list of keywords.',
          items: {
            type: 'string',
          },
        },
      },
      required: [
        'title',
        'instructions',
        'ingredients',
        'difficulty',
        'spiceLevel',
        'dietaryPreferences',
        'calories',
        'prepTime',
        'cuisinePreferences',
        'keywords',
      ],
      additionalProperties: false,
    },
  },
}

export const systemMessageText = `Given a list of ingredients separated by commas, dietary preferences, difficulty level, cuisine preferences and spice level, generate a recipe that includes only the ingredients provided within the provided parameters. The recipe should include a title, list of instructions, list of ingredients, difficulty level, spice level, dietary preferences, calories in kcal, and preparation time in minutes or hours if it's above 2 hours. The recipe should be structured as a JSON object.

Adhere to the difficulty level in determining the preparation time.

Do not include any additional information in the response.

Try to respect the cuisine preferences provided but this are not required.

Try to respect the number of servings provided.

It is important to respect the dietary preferences.

It is important to respect the spice level.

Yuo do not have to include every single ingredient in the recipe, but the recipe should include at least some of the ingredients provided and no additional ones.

Disregard any ingredient that is not an actual ingredient in a recipe. For example, do not include "love" or "happiness" as ingredients.

Do not include any ingredients that are not provided.

Do not generate anything else except for recipes.

Common spices and condiments are not considered ingredients. For example salt and pepper are not considered ingredients.

Instructions should always be clear.

Return a list of up to 3 keywords that are relevant to the recipe. For example 'Beef and Chicken Stir Fry' should return ['Beef Stir Fry', 'Chicken Stir Fry', 'Stir Fry']. One of the keywords should be the food type.

Think through this step by step.
`

export const systemMessage: OpenAI.Chat.ChatCompletionCreateParams['messages'][0] = {
  role: 'system',
  content: [
    {
      type: 'text',
      text: systemMessageText,
    },
  ],
}
