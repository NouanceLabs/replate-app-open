import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import { Header } from '@/components/Header'
import './globals.css'
import { Toaster } from 'solid-sonner'
import { AuthProvider } from '@/auth/provider'

export default function App() {
  return (
    <Router
      root={(props) => (
        <AuthProvider>
          <Header />
          <Suspense>{props.children}</Suspense>
          <Toaster richColors closeButton />
        </AuthProvider>
      )}>
      <FileRoutes />
    </Router>
  )
}
