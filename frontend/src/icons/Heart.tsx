import { Accessor, JSX } from 'solid-js'

interface Props extends JSX.HTMLAttributes<SVGSVGElement> {
  enableFill?: Accessor<boolean>
}

export function HeartIcon({ enableFill, ...props }: Props) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M3.34255 7.77795C3.5687 7.23198 3.90017 6.7359 4.31804 6.31804C4.7359 5.90017 5.23198 5.5687 5.77795 5.34255C6.32392 5.1164 6.90909 5 7.50004 5C8.09099 5 8.67616 5.1164 9.22213 5.34255C9.7681 5.5687 10.2642 5.90017 10.682 6.31804L12 7.63604L13.318 6.31804C14.162 5.47412 15.3066 5.00001 16.5 5.00001C17.6935 5.00001 18.8381 5.47412 19.682 6.31804C20.526 7.16196 21.0001 8.30656 21.0001 9.50004C21.0001 10.6935 20.526 11.8381 19.682 12.682L12 20.364L4.31804 12.682C3.90017 12.2642 3.5687 11.7681 3.34255 11.2221C3.1164 10.6762 3 10.091 3 9.50004C3 8.90909 3.1164 8.32392 3.34255 7.77795Z'
        {...(enableFill && enableFill() ? { fill: 'currentColor' } : {})}
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}
