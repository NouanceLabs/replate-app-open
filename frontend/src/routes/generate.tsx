import { GenerateLayout } from '@/layouts/Generate'
import { GenerateForm } from '@/forms/generate'
import { isAuthenticated } from '@/auth/api'

export default function GeneratePage() {
  isAuthenticated({ redirectTo: '/login', negate: true })

  return (
    <GenerateLayout>
      <GenerateForm />
    </GenerateLayout>
  )
}
