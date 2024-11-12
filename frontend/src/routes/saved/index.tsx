import { SavedLayout } from '@/layouts/Saved'
import { SavedRecipesListing } from '@/components/listings/SavedRecipesListing'
import { isAuthenticated } from '@/auth/api'
export default function SavedPage() {
  isAuthenticated({ redirectTo: '/login', negate: true })

  return (
    <SavedLayout>
      <SavedRecipesListing />
    </SavedLayout>
  )
}
