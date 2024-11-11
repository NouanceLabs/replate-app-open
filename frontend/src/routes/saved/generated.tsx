import { cache } from '@solidjs/router'
import { usePayload } from '@/lib/usePayload'
import { SavedLayout } from '@/layouts/Saved'
import { GeneratedRecipesListing } from '@/components/listings/GeneratedRecipesListing'

const getUsers = cache(async () => {
  'use server'
  const payload = await usePayload()

  const users = await payload.find({
    collection: 'users',
  })

  return users.docs
}, 'users')

export default function GeneratedPage() {
  return (
    <SavedLayout>
      <GeneratedRecipesListing />
    </SavedLayout>
  )
}
