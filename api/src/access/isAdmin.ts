import { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req }) => Boolean(req?.user && req.user?.role === 'admin')

export const isAdminField: FieldAccess = ({ req }) =>
  Boolean(req?.user && req.user?.role === 'admin')
