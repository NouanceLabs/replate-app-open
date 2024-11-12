import { LoginForm } from '@/forms/login'
import { isAuthenticated } from '@/auth/api'
import { A } from '@solidjs/router'

export default function LoginPage() {
  isAuthenticated({ redirectTo: '/' })

  return (
    <div class='text-gray-700 w-full'>
      <div class='mb-8'>
        <h1 class='heading-1'>Welcome back!</h1>
      </div>
      <LoginForm />

      <div class='mt-8 prose'>
        <p>
          Don't have an account yet? <A href='/register'>Register now</A>
        </p>
      </div>
    </div>
  )
}
