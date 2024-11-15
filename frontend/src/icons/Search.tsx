import { JSX } from 'solid-js'

export function SearchIcon(props: JSX.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg width='25' height='24' viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M21.5 21L15.5 15M17.5 10C17.5 10.9193 17.3189 11.8295 16.9672 12.6788C16.6154 13.5281 16.0998 14.2997 15.4497 14.9497C14.7997 15.5998 14.0281 16.1154 13.1788 16.4672C12.3295 16.8189 11.4193 17 10.5 17C9.58075 17 8.6705 16.8189 7.82122 16.4672C6.97194 16.1154 6.20026 15.5998 5.55025 14.9497C4.90024 14.2997 4.38463 13.5281 4.03284 12.6788C3.68106 11.8295 3.5 10.9193 3.5 10C3.5 8.14348 4.2375 6.36301 5.55025 5.05025C6.86301 3.7375 8.64348 3 10.5 3C12.3565 3 14.137 3.7375 15.4497 5.05025C16.7625 6.36301 17.5 8.14348 17.5 10Z'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}
