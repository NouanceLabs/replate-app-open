import { useAuth } from '@/auth/provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { isAuthenticated, logoutClient } from '@/auth/api'
import { A, createAsync, useLocation } from '@solidjs/router'
import { createEffect, createMemo, For, Show } from 'solid-js'
import { HomeIcon } from '@/icons/Home'
import { SearchIcon } from '@/icons/Search'
import { ChefHatIcon } from '@/icons/ChefHat'
import { TopRightMask } from '@/icons/TopRightMask'

export function DesktopHeader() {
  const location = useLocation()
  const { user, isAuthed, isInitialised } = useAuth()
  const linkClass = 'py-2 flex items-center gap-2'
  const active = (path: string) => (path == location.pathname ? 'font-bold' : '')

  const userFallback = createMemo(() => (user()?.fullName || user()?.email)?.slice(0, 2).toUpperCase())

  return (
    <div class='flex justify-between gap-12 pt-8 pl-6 '>
      <div class='flex gap-12'>
        <A class='font-medium text-3xl' href='/'>
          Replate
        </A>
        <nav class=''>
          <ul class='flex items-center gap-12'>
            <li>
              <A class={`${linkClass} ${active('/')} `} href='/'>
                <HomeIcon />
                <span>Home</span>
              </A>
            </li>
            <li>
              <A class={`${linkClass} ${active('/recipes')} `} href='/recipes'>
                <SearchIcon />
                <span>Discover</span>
              </A>
            </li>
            <li>
              <A class={`${linkClass} ${active('/generate')} `} href='/generate'>
                <ChefHatIcon />
                <span>Generate</span>
              </A>
            </li>
            <li>
              <A class={`${linkClass} ${active('/saved')} `} href='/saved'>
                <span>SAved</span>
              </A>
            </li>
            <li>
              <A class={`${linkClass} ${active('/my-profile')} `} href='/my-profile'>
                <span>My profile</span>
              </A>
            </li>
            <li>
              <A class={`${linkClass} ${active('/settings')} `} href='/settings'>
                <span>My settings</span>
              </A>
            </li>
          </ul>
        </nav>
      </div>

      <Show when={!isAuthed()}>
        <div class='relative flex gap-6 px-4 py-8 -mt-8 navigation-top-right'>
          {/* @ts-expect-error */}
          <TopRightMask class='absolute top-0 right-[calc(-1rem-1px)] h-[160%]' preserveAspectRatio='none' />
          <div class='relative'>
            <A href='/login'>
              <Button variant={'secondary'}>Login</Button>
            </A>
          </div>
          <div class='relative'>
            <A href='/register'>
              <Button>Register</Button>
            </A>
          </div>
        </div>
      </Show>
    </div>
  )
}
