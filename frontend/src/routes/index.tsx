import { createAsync } from '@solidjs/router'
import { LatestListing } from '@/components/listings/LatestListing'
import { GeneralLayout } from '@/layouts/General'
import { EditorsPickListing } from '@/components/listings/EditorsPickListing'
import { ContentBlock } from '@/components/ContentBlock'
import { FeaturedRecipesCarousel } from '@/components/FeaturedRecipesCarousel'
import { isAuthenticated } from '@/auth/api'
import { Match, Switch } from 'solid-js'

export default function Home() {
  const isAuth = createAsync(() => isAuthenticated())

  return (
    <GeneralLayout>
      <div class='mb-16'>
        <Switch>
          <Match when={isAuth()}>
            <h1 class='text-5xl leading-[1.2] font-medium mb-16'>
              Welcome back,
              <br /> pantry chef.
            </h1>
          </Match>
          <Match when={!isAuth()}>
            <h1 class='text-5xl leading-[1.2] font-medium mb-16'>Create magic from your pantry.</h1>
          </Match>
        </Switch>

        <FeaturedRecipesCarousel />
      </div>

      <div class='flex flex-col gap-[7rem]'>
        <LatestListing />

        <EditorsPickListing />

        <ContentBlock />
      </div>
    </GeneralLayout>
  )
}
