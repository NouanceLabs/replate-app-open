import { Access } from 'payload'

export const isAuthenticated: Access = ({ req }) => Boolean(req.user)
