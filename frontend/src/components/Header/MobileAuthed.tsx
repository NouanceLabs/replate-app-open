import { useAuth } from '@/auth/provider'
import { Button } from '@/components/ui/button'
import { A, useLocation } from '@solidjs/router'
import { createSignal, Match, Show, Switch } from 'solid-js'
import { HomeIcon } from '@/icons/Home'
import { SearchIcon } from '@/icons/Search'
import { ChefHatIcon } from '@/icons/ChefHat'
import { createScrollPosition } from '@solid-primitives/scroll'
import { createEffect } from 'solid-js'
import clsx from 'clsx'
import { HeartIcon } from '@/icons/Heart'
import { UserIcon } from '@/icons/User'

export function MobileAuthedNav() {
  const location = useLocation()
  const { isAuthed } = useAuth()
  const [roundedCorners, setRoundCorners] = createSignal(false)
  const linkClass = 'py-2 block'
  const active = (path: string) => (path == location.pathname ? 'font-bold' : '')

  const windowScroll = createScrollPosition()

  createEffect(() => {
    if (windowScroll.y > 32) {
      setRoundCorners(true)
    } else {
      setRoundCorners(false)
    }
  })

  return (
    <div class={clsx(`flex justify-between bg-white container fixed bottom-0 left-0 lg:hidden border-t border-border`)}>
      <nav class='w-full'>
        <ul class='flex w-full items-center justify-between gap-4 py-2'>
          <li>
            <A class={`${linkClass} ${active('/')} `} href='/'>
              <HomeIcon />
              <span class='sr-only'>Home</span>
            </A>
          </li>
          <li>
            <A class={`${linkClass} ${active('/recipes')} `} href='/recipes'>
              <SearchIcon />
              <span class='sr-only'>Discover</span>
            </A>
          </li>
          <li class=''>
            <A
              class={`${linkClass} ${active('/generate')} flex items-center justify-center bg-general-brand-accent text-white p-4 -mt-10 h-[calc(100%+1rem)] rounded-full aspect-square`}
              href='/generate'>
              <ChefHatIcon class='h-auto w-8' />

              <span class='sr-only'>Generate</span>
            </A>
          </li>
          <li>
            <A class={`${linkClass} ${active('/saved')} `} href='/saved'>
              <HeartIcon />
              <span class='sr-only'>Saved</span>
            </A>
          </li>
          <li>
            <A class={`${linkClass} ${active('/profile')} `} href='/profile'>
              <UserIcon />
              <span class='sr-only'>My profile</span>
            </A>
          </li>
        </ul>
      </nav>
    </div>
  )
}
