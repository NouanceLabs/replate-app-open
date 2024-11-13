import { getFeaturedRecipes } from '@/components/listings/api'
import { createAsync } from '@solidjs/router'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { For } from 'solid-js'
import { CarouselItem as Card } from './CarouselItem'

import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'

export const FeaturedRecipesCarousel = () => {
  const recipes = createAsync(() => getFeaturedRecipes())

  return (
    <Carousel
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
        <For each={recipes()}>
          {(recipe) => (
            <CarouselItem>
              <Card data={recipe} />
            </CarouselItem>
          )}
        </For>
      </CarouselContent>
    </Carousel>
  )
}
