import { RegisterForm } from '@/forms/register'
import { isAuthenticated } from '@/auth/api'
export default function About() {
  isAuthenticated({ redirectTo: '/' })

  return (
    <div class='mx-auto text-gray-700 p-4'>
      <h1 class='max-6-xs text-6xl text-sky-700 font-thin uppercase my-16'>Registration page</h1>
      <RegisterForm />
    </div>
  )
}
