import { cache } from '@solidjs/router'
import { usePayload } from '@/lib/usePayload'
import { GenerateLayout } from '@/layouts/Generate'
import { GenerateForm } from '@/forms/generate'

const getUsers = cache(async () => {
  'use server'
  const payload = await usePayload()

  const users = await payload.find({
    collection: 'users',
  })

  return users.docs
}, 'users')

export default function GeneratePage() {
  return (
    <GenerateLayout>
      <GenerateForm />
    </GenerateLayout>
  )
}
