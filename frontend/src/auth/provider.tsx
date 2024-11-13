import { createContext, onMount, createSignal, useContext, Accessor, createEffect, createMemo, Setter } from 'solid-js'
import { User } from '@payload/payload-types'
import { createStore } from 'solid-js/store'
import { authenticateUser, loginClient, logoutClient, refreshClient } from '@/auth/api'
import { createAsync, createAsyncStore, redirect } from '@solidjs/router'
import { toast } from 'solid-sonner'

type AuthContextType = {
  user: Accessor<User | null>
  setUser: Setter<User | null>
  login: (args: Parameters<typeof loginClient>[0]) => void
  logout: () => void
  refresh: () => void
  isAuthed: () => boolean
  isLoading: Accessor<boolean>
  isInitialised: Accessor<boolean>
}

const initialState: AuthContextType = {
  user: () => null,
  setUser: () => null,
  login: () => null,
  logout: () => null,
  refresh: () => null,
  isAuthed: () => false,
  isLoading: () => true,
  isInitialised: () => false,
}

const AuthContext = createContext<AuthContextType>(initialState)

type Props = {
  children?: any
}

export const AuthProvider = (props: Props) => {
  const getUserOnRender = createAsyncStore(() => authenticateUser(), {
    initialValue: null,
  })
  const [user, setUser] = createSignal<User | null>(null)
  const [isLoading, setIsLoading] = createSignal<boolean>(true)
  const [isInitialised, setIsInitialised] = createSignal<boolean>(false)

  const isAuthed = createMemo(() => user() !== null)

  createEffect(() => {
    if (getUserOnRender) {
      const userFromInitialRender = getUserOnRender()
      if (userFromInitialRender && (userFromInitialRender.email || userFromInitialRender.username)) {
        setUser(userFromInitialRender)
      }
    }

    setIsInitialised(true)
  })

  const login = async (args: Parameters<typeof loginClient>[0]) => {
    await loginClient(args).then(() => {
      setUser(null)
      redirect('/')
    })
  }

  const logout = async () => {
    await logoutClient().then(() => {
      setUser(null)
      redirect('/')
    })
  }

  const refresh = async () => {
    try {
      const refresh = await refreshClient()

      if (refresh.ok) {
        const tokenData = await refresh.json()

        if (tokenData.user) {
          setUser(tokenData.user)
        }
      }
    } catch (error) {
      toast.error('Error refreshing user.')
    }
  }

  onMount(async () => {
    const user = await authenticateUser()

    if (user) {
      setUser(user)
    }

    setIsLoading(false)
  })

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAuthed, refresh, isLoading, isInitialised }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
