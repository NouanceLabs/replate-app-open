import { getPayload } from 'payload'
import config from '../../../api/src/payload.config'
import { createAsync, cache } from '@solidjs/router'

export async function usePayload() {
  'use server'
  const payload = await getPayload({ config })

  return payload
}

export async function usePayloadAPI(endpoint: string, options: RequestInit = {}) {
  const VITE_API_ENDPOINT = (import.meta.env.VITE_API_ENDPOINT || process.env.VITE_API_ENDPOINT || 'https://api.replate.food/api') as string

  const url = `${VITE_API_ENDPOINT}${endpoint}`

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
}
