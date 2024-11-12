import { createAsync, cache } from '@solidjs/router'
import { usePayload } from '@/lib/usePayload'
import { LatestListing } from '@/components/listings/LatestListing'
import { GeneralLayout } from '@/layouts/General'
import { EditorsPickListing } from '@/components/listings/EditorsPickListing'

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
  return (
    <GeneralLayout>
      <div class=''>
        <h1 class='text-5xl leading-[1.2] font-medium my-16'>
          Welcome back,
          <br /> pantry chef.
        </h1>
      </div>

      <div class='mb-12'>
        <LatestListing />
      </div>
      <EditorsPickListing />
    </GeneralLayout>
  )
}
