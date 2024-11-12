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

export function DesktopHeader() {
  const location = useLocation()
  const { isAuthed } = useAuth()
  const [roundedCorners, setRoundCorners] = createSignal(false)
  const linkClass = 'py-2 flex items-center gap-2'
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
    <div
      class={clsx(`flex justify-between px-8 lg:px-12 bg-translucent-primary`, {
        'rounded-t-[3rem]': !roundedCorners(),
      })}>
      <div class='w-full border-b border-border py-5 flex justify-between gap-8 '>
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
              <Show when={isAuthed()}>
                <li>
                  <A class={`${linkClass} ${active('/generate')} `} href='/generate'>
                    <ChefHatIcon />
                    <span>Generate</span>
                  </A>
                </li>
              </Show>
            </ul>
          </nav>
        </div>

        <Switch>
          <Match when={!isAuthed()}>
            <div class='relative flex gap-6'>
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
          </Match>
          <Match when={isAuthed()}>
            <nav class='flex items-center'>
              <ul class='flex items-center gap-12'>
                <li>
                  <A class={`${linkClass} ${active('/saved')} `} href='/saved'>
                    <span class='sr-only'>Saved</span>
                    <HeartIcon enableFill={() => Boolean(active('/saved'))} />
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
          </Match>
        </Switch>
      </div>
    </div>
  )
}
