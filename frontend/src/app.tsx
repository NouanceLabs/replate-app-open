import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import { Header } from '@/components/Header'
import './globals.css'
import { Toaster } from 'solid-sonner'
import { AuthProvider } from '@/auth/provider'
import { MetaProvider, Title, Link, Meta } from '@solidjs/meta'
import { Footer } from '@/components/Footer'

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
          <Link rel='icon' type='image/png' href='/favicon-96x96.png' sizes='96x96' />
          <Link rel='icon' type='image/svg+xml' href='/favicon.svg' />
          <Link rel='shortcut icon' href='/favicon.ico' />
          <Link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
          <Meta name='apple-mobile-web-app-title' content='Replate' />
          <Link rel='manifest' href='/site.webmanifest' />

          <AuthProvider>
            <Header />
            <Suspense>{props.children}</Suspense>
            <Toaster richColors closeButton />
            <Footer />
          </AuthProvider>
        </MetaProvider>
      )}>
      <FileRoutes />
    </Router>
  )
}
