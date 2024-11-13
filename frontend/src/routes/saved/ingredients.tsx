import { SavedLayout } from '@/layouts/Saved'
import { IngredientsForm } from '@/forms/ingredients'
import { isAuthenticated } from '@/auth/api'
import { Title, Meta } from '@solidjs/meta'

export default function SavedPage() {
  isAuthenticated({ redirectTo: '/login', negate: true })

  return (
    <>
      <Title>Ingredients | Replate</Title>
      <Meta property='og:title' content='Ingredients | Replate' />
      <Meta property='og:title' content='Ingredients | Replate' />
      <SavedLayout>
        <IngredientsForm />
      </SavedLayout>
    </>
  )
}
