import type { ValidComponent } from 'solid-js'
import { splitProps } from 'solid-js'

import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import * as ToggleButtonPrimitive from '@kobalte/core/toggle-button'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const toggleVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'rounded-md bg-transparent',
        outline: 'rounded-md border border-border bg-transparent shadow-sm',
        card: 'border border-white hover:border-border hover:bg-white bg-white shadow-sm rounded-5 lg:rounded-10',
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-3',
        card: 'h-auto p-4 xl:p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ToggleButtonRootProps<T extends ValidComponent = 'button'> = ToggleButtonPrimitive.ToggleButtonRootProps<T> &
  VariantProps<typeof toggleVariants> & { class?: string | undefined }

const Toggle = <T extends ValidComponent = 'button'>(props: PolymorphicProps<T, ToggleButtonRootProps<T>>) => {
  const [local, others] = splitProps(props as ToggleButtonRootProps, ['class', 'variant', 'size'])
  return <ToggleButtonPrimitive.Root class={cn(toggleVariants({ variant: local.variant, size: local.size }), local.class)} {...others} />
}

export type { ToggleButtonRootProps as ToggleProps }
export { toggleVariants, Toggle }
