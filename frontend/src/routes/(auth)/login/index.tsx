import { LoginForm } from '@/forms/login'
import { isAuthenticated } from '@/auth/api'

export default function LoginPage() {
  isAuthenticated({ redirectTo: '/' })

  return (
    <div>
      <h1 class='max-6-xs text-6xl text-sky-700 font-thin uppercase my-16'>Login page</h1>
      <LoginForm />
    </div>
  )
}
