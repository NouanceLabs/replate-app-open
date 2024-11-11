import { Access } from 'payload'

export const isSelfOrAdmin: Access = ({ req, data }) => {
  const user = req.user

  if (user && user.role === 'admin') {
    return true
  }

  return {
    id: {
      equals: user?.id,
    },
  }
}
