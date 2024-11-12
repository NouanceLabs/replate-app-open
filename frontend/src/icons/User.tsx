import { JSX } from 'solid-js'

export function UserIcon(props: JSX.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M12.3573 8.19036C12.9825 7.56523 13.3337 6.71739 13.3337 5.83333C13.3337 4.94928 12.9825 4.10143 12.3573 3.47631C11.7322 2.85119 10.8844 2.5 10.0003 2.5C9.11627 2.5 8.26842 2.85119 7.6433 3.47631C7.01818 4.10143 6.66699 4.94928 6.66699 5.83333C6.66699 6.71739 7.01818 7.56523 7.6433 8.19036C8.26842 8.81548 9.11627 9.16667 10.0003 9.16667C10.8844 9.16667 11.7322 8.81548 12.3573 8.19036Z'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M5.87554 13.3752C6.9695 12.2812 8.45323 11.6667 10.0003 11.6667C11.5474 11.6667 13.0312 12.2812 14.1251 13.3752C15.2191 14.4692 15.8337 15.9529 15.8337 17.5H4.16699C4.16699 15.9529 4.78157 14.4692 5.87554 13.3752Z'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}
