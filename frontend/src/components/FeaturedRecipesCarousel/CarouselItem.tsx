import { Image } from '@/components/Media/Image'
import { Button } from '@/components/ui/button'
import { ClockIcon } from '@/icons/Clock'
import { FireIcon } from '@/icons/Fire'
import { LightningBoltIcon } from '@/icons/LightningBolt'
import { formatCalories, formatDifficulty } from '@/lib/utils'
import { Media, Recipe } from '@payload/payload-types'
import { A } from '@solidjs/router'

interface Props {
  data: Recipe
}

export const CarouselItem = ({ data }: Props) => {
  return (
    <article class='relative'>
      <Image
        media={data.featuredImage as Media}
        className='object-cover  w-full rounded-6 lg:rounded-10 h-[36rem] xl:h-[45rem]'
        wrapperClassName='h-full w-full '
        size='xlarge'
      />

      <div class='absolute bottom-2 left-4 right-4 md:bottom-8 md:left-auto md:right-8 flex flex-col items-start gap-4'>
        <div class='bg-general-inverse text-white px-4 py-2 rounded-xl'>Featured recipe</div>
        <div class='bg-background rounded-xl p-4'>
          <h2 class='heading-3 mb-4 max-w-[18.75rem]'>{data.title}</h2>
          <div class='flex justify-between flex-wrap gap-8'>
            <div class='flex gap-2 text-sm'>
              <div class='flex gap-0 lg:gap-1 items-center'>
                <ClockIcon />
                <span class=''>{data.prepTime?.replace('minutes', 'min')}</span>
              </div>

              <div class='flex gap-1 items-center'>
                <FireIcon />
                <span class=''>{formatCalories(data.calories!)}</span>
              </div>

              <div class='flex gap-1 items-center'>
                <LightningBoltIcon />
                <span class=''>{formatDifficulty(data.difficulty!, 'short')}</span>
              </div>
            </div>

            <Button class='underline' variant='link' size={'sm'} as={A} href={`/recipes/${data.slug}`}>
              View recipe
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
