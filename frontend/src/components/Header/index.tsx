import { useAuth } from '@/auth/provider'
import { DesktopHeader } from '@/components/Header/Desktop'
import { MobileHeader } from '@/components/Header/Mobile'
import { MobileAuthedNav } from '@/components/Header/MobileAuthed'
import { Show } from 'solid-js'

export function Header() {
  const { isAuthed } = useAuth()
  return (
    <>
      <div class='h-[1rem] lg:h-[2rem]' />
      <header class='z-20 left-0 sticky top-0 w-full '>
        <div class='container hidden lg:block'>
          <DesktopHeader />
        </div>
        <div class='lg:hidden'>
          <div class='md:container'>
            <MobileHeader />
          </div>
        </div>
        <Show when={isAuthed()}>
          <MobileAuthedNav />
        </Show>
      </header>
      <div class='-mt-[2.25rem] lg:-mt-[5.125rem]' />
    </>
  )
}
