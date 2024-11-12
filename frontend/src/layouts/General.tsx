import clsx from 'clsx'

interface Props {
  children?: any
  className?: string
  containerClassName?: string
}

export const GeneralLayout = ({ children, className, containerClassName }: Props) => {
  return (
    <main class={clsx('md:container mx-auto mt-0', className)}>
      <div class={clsx('pt-[10rem] pb-[5rem] px-4 md:px-12 primary-gradient rounded-6 lg:rounded-[3.25rem]', containerClassName)}>
        {children}
      </div>
    </main>
  )
}
