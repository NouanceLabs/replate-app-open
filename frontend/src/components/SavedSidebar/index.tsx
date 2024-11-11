import { A, useLocation } from '@solidjs/router'
import clsx from 'clsx'

export const SavedSidebar = () => {
  const location = useLocation()
  const isActive = (path: string) => path === location.pathname

  const baseStyles =
    'flex flex-grow justify-start pl-2 sm:pl-0 sm:justify-center lg:justify-start items-center py-4 lg:py-8 lg:pl-4  transition-colors duration-200'

  return (
    <aside class='border-b flex-grow-[2] flex-shrink-0 border-elements-border-primary lg:border-r lg:border-b-0 lg:pb-[5rem] lg:max-w-[22.25rem]'>
      <div class='mb-12 lg:mb-[5rem] lg:pr-12 '>
        <h2 class='heading-2 text-general-brand-accent'>Your digital pantry</h2>
        <p class='heading-1 hidden md:block max-w-[25rem]'>Saved Recipes & Ingredients</p>
      </div>

      <nav aria-label='Saved lists'>
        <h3 class='font-bold mb-4'>Your lists</h3>
        <ul class='flex flex-col sm:flex-row lg:flex-col justify-between'>
          <li class='flex-grow flex '>
            <A
              href='/saved'
              class={clsx(baseStyles, 'sm:border-r md:border-r-0 md:border-b  border-elements-border-primary', {
                'font-bold bg-general-brand-subtle ': isActive('/saved'),
                'hover:bg-white': !isActive('/saved'),
              })}>
              <span>Recipes</span>
            </A>
          </li>
          <li class='flex-grow sm:max-w-[50%] md:max-w-none flex '>
            <A
              href='/saved/ingredients'
              class={clsx(baseStyles, {
                'font-bold bg-general-brand-subtle ': isActive('/saved/ingredients'),
                'hover:bg-white': !isActive('/saved/ingredients'),
              })}>
              <span>Ingredients</span>
            </A>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
