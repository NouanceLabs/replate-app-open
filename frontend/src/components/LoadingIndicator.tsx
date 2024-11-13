import { SpinnerIcon } from '@/icons/Spinner'
import clsx from 'clsx'
import { JSX } from 'solid-js'

interface Props {
  className?: string
  icon?: JSX.HTMLAttributes<SVGSVGElement>
}

export const LoadingIndicator = ({ icon, className }: Props) => {
  return (
    <div class={className}>
      <SpinnerIcon {...icon} class={clsx(' animate-spin', icon?.class)} />
    </div>
  )
}
