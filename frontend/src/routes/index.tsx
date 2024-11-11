import { createAsync, cache } from '@solidjs/router'
import { usePayload } from '@/lib/usePayload'
import { Test } from '@/components/Test'
import { LatestListing } from '@/components/listings/LatestListing'

const getUsers = cache(async () => {
  'use server'
  const payload = await usePayload()

  const users = await payload.find({
    collection: 'users',
  })

  return users.docs
}, 'users')

export const route = {
  preload: () => getUsers(),
}

export default function Home() {
  const users = createAsync(() => getUsers())

  return (
    <main class=''>
      <div class='container'>
        <div class='w-full min-h-[80vh] brand-gradient rounded-[4rem]'></div>
      </div>

      <div class='container'>
        <h1 class='text-5xl leading-[1.2] font-medium my-16'>
          Welcome back,
          <br /> pantry chef.
        </h1>

        <Test />
      </div>

      <div class='container'>
        <div class=' primary-gradient px-12 py-24 rounded-[6.25rem]'>
          <LatestListing />
        </div>
      </div>
    </main>
  )
}
