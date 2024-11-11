import { Recipe } from '@payload/payload-types'
import { Access } from 'payload'

// @ts-expect-error
export const readAccess: Access<Recipe> = ({ req, data }) => {
  const user = req.user

  // If the user is an admin, they can read any recipe
  if (user?.role === 'admin') return true

  // If the recipe is published, anyone can read it

  return {
    or: [
      {
        published: {
          equals: true,
        },
      },
      ...(user?.id ? [{ owner: { equals: user.id } }] : []),
    ],
  }
}

export const updateAccess: Access<Recipe> = ({ req }) => {
  const user = req.user

  // If the user is an admin, they can update any recipe
  if (user?.role === 'admin') return true

  return false
}
