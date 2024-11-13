import { GenerateLayout } from '@/layouts/Generate'
import { GenerateForm } from '@/forms/generate'
import { isAuthenticated } from '@/auth/api'
import { Title, Meta } from '@solidjs/meta'
export default function GeneratePage() {
  isAuthenticated({ redirectTo: '/login', negate: true })

  return (
    <>
      <Title>Generate | Replate</Title>
      <Meta property='og:title' content='Generate | Replate' />
      <Meta property='og:title' content='Generate | Replate' />
      <GenerateLayout>
        <GenerateForm />
      </GenerateLayout>
    </>
  )
}
