import { SavedLayout } from '@/layouts/Saved'
import { GeneratedRecipesListing } from '@/components/listings/GeneratedRecipesListing'
import { isAuthenticated } from '@/auth/api'
import { Title, Meta } from '@solidjs/meta'

export default function GeneratedPage() {
  isAuthenticated({ redirectTo: '/login', negate: true })

  return (
    <>
      <Title>Generated Recipes | Replate</Title>
      <Meta property='og:title' content='Generated Recipes | Replate' />
      <Meta property='og:title' content='Generated Recipes | Replate' />
      <SavedLayout>
        <GeneratedRecipesListing />
      </SavedLayout>
    </>
  )
}
