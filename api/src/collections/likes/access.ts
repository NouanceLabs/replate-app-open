import { Like } from '@payload/payload-types'
import { Access } from 'payload'

export const readAccess: Access<Like> = ({ req }) => {
  const user = req.user

  // Only logged in users can like a recipe
  if (user?.role === 'admin') return true

  return {
    user: {
      equals: user?.id,
    },
  }
}

export const createAccess: Access<Like> = ({ req }) => {
  const user = req.user

  // Only logged in users can like a recipe
  if (user) return true

  return false
}

export const deleteAccess: Access<Like> = ({ req, data }) => {
  const user = req.user

  if (user?.role === 'admin') return true

  const owner = typeof data?.user === 'string' ? data?.user : data?.user?.id

  // Only owners can remove their likes
  if (user?.id === owner) return true

  return false
}
