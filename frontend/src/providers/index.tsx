import { AuthProvider } from '@/auth/provider'

export const Providers = ({ children }: { children?: any }) => {
  return <AuthProvider>{children}</AuthProvider>
}
