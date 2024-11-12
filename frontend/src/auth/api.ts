import { usePayload, usePayloadAPI } from '@/lib/usePayload'
import { getRequestEvent } from 'solid-js/web'
import { cache, redirect } from '@solidjs/router'

import jwt from 'jsonwebtoken'
import { User } from '@payload/payload-types'

export const isAuthenticated = cache(async ({ redirectTo, negate = false }: { redirectTo?: string; negate?: boolean } = {}) => {
  'use server'
  const payload = await usePayload()

  const event = getRequestEvent()
  const httpCookie = event?.request.headers.get('Cookie')
  const cookies = httpCookie?.split(';').map((cookie) => cookie.trim())

  const tokenCookie = cookies?.find((cookie) => cookie.startsWith('payload-token='))
  const token = tokenCookie?.split('=')[1]

  if (token) {
    const validToken = jwt.verify(token, payload.secret)

    if (validToken) {
      const authStrategy = payload.authStrategies[0]

      if (authStrategy) {
        const authResponse = await authStrategy.authenticate({ payload, headers: event?.request.headers! })

        if (redirectTo && authResponse.user && !negate) {
          throw redirect(redirectTo)
        }

        return Boolean(authResponse.user)
      }
    }
  }

  if (negate && redirectTo) {
    throw redirect(redirectTo)
  }

  return false
}, 'isAuthenticated')

export const authenticateUser = cache(async () => {
  'use server'
  const payload = await usePayload()

  const event = getRequestEvent()
  const httpCookie = event?.request.headers.get('Cookie')
  const cookies = httpCookie?.split(';').map((cookie) => cookie.trim())

  const tokenCookie = cookies?.find((cookie) => cookie.startsWith('payload-token='))
  const token = tokenCookie?.split('=')[1]

  if (token) {
    const validToken = jwt.verify(token, payload.secret)

    if (validToken) {
      const authStrategy = payload.authStrategies[0]

      if (authStrategy) {
        const authResponse = await authStrategy.authenticate({ payload, headers: event?.request.headers! })

        if (authResponse.user) {
          return authResponse.user as unknown as User
        }
      }
    }
  }

  return null
}, 'authenticateUser')

export const getUser = cache(async () => {
  'use server'
  const payload = await usePayload()

  const event = getRequestEvent()
  const httpCookie = event?.request.headers.get('Cookie')
  const cookies = httpCookie?.split(';').map((cookie) => cookie.trim())

  const tokenCookie = cookies?.find((cookie) => cookie.startsWith('payload-token='))
  const token = tokenCookie?.split('=')[1]

  if (token) {
    const validToken = jwt.verify(token, payload.secret)

    if (validToken) {
      const authStrategy = payload.authStrategies[0]

      if (authStrategy) {
        const authResponse = await authStrategy.authenticate({ payload, headers: event?.request.headers! })

        if (authResponse.user) {
          return authResponse.user as unknown as User
        }
      }
    }
  }

  return null
}, 'getUser')

type LoginWithEmailArgs = {
  email: string
  password: string
  username?: never
}

type LoginWithUsernameArgs = {
  email?: never
  password: string
  username: string
}

type LoginArgs = LoginWithEmailArgs | LoginWithUsernameArgs

export const loginClient = async ({ username, email, password }: LoginArgs) => {
  try {
    const response = usePayloadAPI('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    })

    return response
  } catch (error) {
    console.log('Failed to login. Tell someone.')
  }
}

export const registerClient = async (email: string, username: string, password: string, confirmPassword: string) => {
  try {
    const response = usePayloadAPI('/users', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, confirmPassword }),
    })

    return response
  } catch (error) {
    console.log('Failed to register. Tell someone.')
  }
}

export const logoutClient = async () => {
  const response = usePayloadAPI('/users/logout', {
    method: 'POST',
    headers: {},
  })

  return response
}

export const refreshClient = async () => {
  const response = usePayloadAPI('/users/refresh-token', {
    method: 'POST',
    headers: {},
  })

  return response
}
