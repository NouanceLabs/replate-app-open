import { GenerateSidebar } from '@/components/GenerateSidebar'
import clsx from 'clsx'

interface Props {
  children?: any
  className?: string
  containerClassName?: string
}

export const GenerateLayout = ({ children, className, containerClassName }: Props) => {
  return (
    <main class={clsx('md:container mx-auto mt-8', className)}>
      <div
        class={clsx(
          'pt-[10rem] pb-[5rem] px-4 md:px-12 primary-gradient rounded-[3.25rem] flex flex-col lg:flex-row gap-6 md:gap-12 lg:gap-20',
          containerClassName
        )}>
        <GenerateSidebar />

        <div class='flex-grow'>{children}</div>
      </div>
    </main>
  )
}
