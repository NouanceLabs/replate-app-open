import { getPayload as getPayloadFromLibrary } from 'payload'
import config from '@payload/payload.config'
import { createAsync, cache } from '@solidjs/router'

const VITE_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT as string

export async function usePayload() {
  'use server'
  const payload = await getPayloadFromLibrary({ config })

  return payload
}

export async function usePayloadAPI(endpoint: string, options: RequestInit = {}) {
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
