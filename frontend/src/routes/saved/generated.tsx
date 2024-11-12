import { SavedLayout } from '@/layouts/Saved'
import { GeneratedRecipesListing } from '@/components/listings/GeneratedRecipesListing'
import { isAuthenticated } from '@/auth/api'

export default function GeneratedPage() {
  isAuthenticated({ redirectTo: '/login', negate: true })

  return (
    <SavedLayout>
      <GeneratedRecipesListing />
    </SavedLayout>
  )
}
