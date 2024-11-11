import { LoginForm } from '@/forms/login'

import { createAsync, redirect } from '@solidjs/router'
import { isAuthenticated } from '@/auth/api'

export default function LoginPage() {
  const getIsAuthenticated = createAsync(() => isAuthenticated({ redirectTo: '/' }))
  const isAuthed = getIsAuthenticated()

  if (isAuthed) {
    redirect('/')
  }

  return (
    <div>
      <h1 class='max-6-xs text-6xl text-sky-700 font-thin uppercase my-16'>Login page</h1>
      <LoginForm />
    </div>
  )
}
