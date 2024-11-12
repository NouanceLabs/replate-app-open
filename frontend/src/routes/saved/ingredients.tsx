import { SavedLayout } from '@/layouts/Saved'
import { IngredientsForm } from '@/forms/ingredients'
import { isAuthenticated } from '@/auth/api'

export default function SavedPage() {
  isAuthenticated({ redirectTo: '/login', negate: true })

  return (
    <SavedLayout>
      <IngredientsForm />
    </SavedLayout>
  )
}
