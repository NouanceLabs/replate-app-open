import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import { Header } from '@/components/Header'
import './globals.css'
import { Toaster } from 'solid-sonner'
import { AuthProvider } from '@/auth/provider'
import { MetaProvider, Title, Link, Meta } from '@solidjs/meta'

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Replate</Title>
          <Link rel='canonical' href='https://replate.food' />
          <Meta name='description' content='Generate personalised recipes based on the ingredients you have at home.' />
          <Meta property='og:title' content='Replate' />
          <Meta property='og:description' content='Generate personalised recipes based on the ingredients you have at home.' />
          <Meta property='og:image' content='https://replate.food/images/og.jpg' />
          <Meta property='og:title' content='Replate' />
          <Meta property='og:description' content='Generate personalised recipes based on the ingredients you have at home.' />
          <Meta property='twitter:image' content='https://replate.food/images/og.jpg' />

          <AuthProvider>
            <Header />
            <Suspense>{props.children}</Suspense>
            <Toaster richColors closeButton />
          </AuthProvider>
        </MetaProvider>
      )}>
      <FileRoutes />
    </Router>
  )
}
