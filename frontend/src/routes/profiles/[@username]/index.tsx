import { cache } from '@solidjs/router'
import { usePayload } from '@/lib/usePayload'

const getUsers = cache(async () => {
  'use server'
  const payload = await usePayload()

  const users = await payload.find({
    collection: 'users',
  })

  return users.docs
}, 'users')

export default function UsernamePage() {
  return <main class=''>profile page goes here</main>
}
