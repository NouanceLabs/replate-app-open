import { Media, Recipe } from '@payload/payload-types'
import { Image } from '@/components/Media/Image'
import { FireIcon } from '@/icons/Fire'
import { ClockIcon } from '@/icons/Clock'
import { LightningBoltIcon } from '@/icons/LightningBolt'
import { createSignal, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { formatCalories, formatDifficulty, useClickableCard } from '@/lib/utils'

interface Props {
  data: Recipe
}

export const RecipeCard = ({ data }: Props) => {
  const { featuredImage, title, calories, difficulty, prepTime, slug } = data
  const [cardRef, setCardRef] = createSignal<HTMLElement>()
  const [anchorRef, setAnchorRef] = createSignal<HTMLAnchorElement>()

  useClickableCard(cardRef, anchorRef)

  const href = `/recipes/${slug}`

  return (
    <article class='relative aspect-square hover:cursor-pointer focus-within:outline' ref={setCardRef}>
      <A ref={setAnchorRef} href={href}>
        <h3 class='sr-only'>{title}</h3>
      </A>

      <div class='text-sm absolute bottom-1 left-1 md:bottom-4 md:left-4 z-10 bg-elements-fg-card text-general-fg-inverse px-3 py-2 rounded-2 flex gap-1 md:gap-2'>
        <div class='flex gap-0 lg:gap-1 items-center'>
          <ClockIcon />
          <span class=''>{prepTime?.replace('minutes', 'min')}</span>
        </div>

        <div class='flex gap-1 items-center'>
          <FireIcon />
          <span class=''>{formatCalories(calories!)}</span>
        </div>

        <div class='flex gap-1 items-center'>
          <LightningBoltIcon />
          <span class=''>{formatDifficulty(difficulty!, 'short')}</span>
        </div>
      </div>
      <Show
        when={Boolean(featuredImage)}
        fallback={<div class='flex items-center justify-center p-4 text-center w-full h-full bg-white rounded-xl'>{data.title}</div>}>
        <Image
          enableWrapper={false}
          className='relative top-0 left-0 w-full h-full object-cover rounded-xl'
          media={featuredImage as Media}
          size='medium'
        />
      </Show>
    </article>
  )
}
