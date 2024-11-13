import { A } from '@solidjs/router'

export default function NotFound() {
  return (
    <main class='pt-[8rem] pb-[6rem] text-center mx-auto text-gray-700 p-4'>
      <h1 class='heading-1 text-general-brand-accent uppercase my-16'>Not Found</h1>
      <div class='prose mx-auto'>
        <p class='mt-8'>
          Sorry we couldn't find this page. You can try{' '}
          <A href='/recipes' class=' hover:underline'>
            searching
          </A>{' '}
          for a recipe or going back to the{' '}
          <A href='/' class=' hover:underline'>
            homepage
          </A>
          .
        </p>
      </div>
      <p class='my-4'>
        <A href='/' class=' hover:underline'>
          Home
        </A>
        {' - '}
        <A href='/recipes' class=' hover:underline'>
          Search recipes
        </A>
      </p>
    </main>
  )
}
