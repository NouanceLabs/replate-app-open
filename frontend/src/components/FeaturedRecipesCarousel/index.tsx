import { getFeaturedRecipes } from '@/components/listings/api'
import { createAsync } from '@solidjs/router'
import { Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { createSignal, For } from 'solid-js'
import { CarouselItem as Card } from './CarouselItem'

import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'

export const FeaturedRecipesCarousel = () => {
  const recipes = createAsync(() => getFeaturedRecipes())
  const [api, setApi] = createSignal<ReturnType<CarouselApi>>()

  return (
    <Carousel
      setApi={setApi}
      plugins={[
        Autoplay({
          stopOnMouseEnter: true,
          stopOnInteraction: false,
          playOnInit: true,
          delay: 5000,
        }),
        Fade(),
      ]}>
      <CarouselContent>
        <For each={recipes()} fallback={<div>Loading...</div>}>
          {(recipe) => (
            <CarouselItem>
              <Card data={recipe} />
            </CarouselItem>
          )}
        </For>
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  )
}
