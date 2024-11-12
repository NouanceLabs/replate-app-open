import { useAuth } from '@/auth/provider'
import { A, useLocation } from '@solidjs/router'
import { createSignal, Show } from 'solid-js'
import { createScrollPosition } from '@solid-primitives/scroll'
import { createEffect } from 'solid-js'
import clsx from 'clsx'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MenuIcon } from '@/icons/Menu'

export function MobileHeader() {
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
      class={clsx(`flex justify-between px-4  md:px-8 bg-translucent-primary`, {
        'rounded-t-6 md:rounded-t-[3rem]': !roundedCorners(),
      })}>
      <div class='w-full border-b border-border py-5 flex justify-between gap-8 '>
        <div class='flex justify-between gap-12 w-full'>
          <A class='font-medium text-2xl' href='/'>
            Replate
          </A>
          <Show when={!isAuthed()}>
            <Sheet>
              <SheetTrigger>
                <MenuIcon />
                <span class='sr-only'>Open menu</span>
              </SheetTrigger>
              <SheetContent class='w-full max-w-[32rem]'>
                <div class='pt-16'>
                  <nav>
                    <ul class='flex flex-col gap-3'>
                      <li>
                        <A class={`${linkClass} ${active('/login')} `} href='/login'>
                          Login
                        </A>
                      </li>
                      <li>
                        <A class={`${linkClass} ${active('/register')} `} href='/register'>
                          Register
                        </A>
                      </li>
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </Show>
        </div>
      </div>
    </div>
  )
}
