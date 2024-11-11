import { DesktopHeader } from '@/components/Header/Desktop'

export function Header() {
  return (
    <header class='fixed top-0 left-0 w-full border-t-[1rem] border-primary'>
      <div class='container'>
        <DesktopHeader />
      </div>
    </header>
  )
}
