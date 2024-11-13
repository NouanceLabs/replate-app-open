import { SavedLayout } from '@/layouts/Saved'
import { SavedRecipesListing } from '@/components/listings/SavedRecipesListing'
import { isAuthenticated } from '@/auth/api'
import { Title, Meta } from '@solidjs/meta'

export default function SavedPage() {
  isAuthenticated({ redirectTo: '/login', negate: true })

  return (
    <>
      <Title>Saved Recipes | Replate</Title>
      <Meta property='og:title' content='Saved Recipes | Replate' />
      <Meta property='og:title' content='Saved Recipes | Replate' />
      <SavedLayout>
        <SavedRecipesListing />
      </SavedLayout>
    </>
  )
}
