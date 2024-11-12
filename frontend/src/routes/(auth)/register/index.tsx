import { RegisterForm } from '@/forms/register'
import { isAuthenticated } from '@/auth/api'
import { A } from '@solidjs/router'
export default function About() {
  isAuthenticated({ redirectTo: '/' })

  return (
    <div class='text-gray-700 w-full'>
      <div class='mb-8'>
        <h1 class='heading-1'>Welcome to Replate!</h1>
      </div>

      <RegisterForm />

      <div class='mt-8 prose'>
        <p>
          Already have an account?? <A href='/login'>Login</A>
        </p>
      </div>
    </div>
  )
}
