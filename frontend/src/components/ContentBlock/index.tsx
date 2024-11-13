import { Button } from '@/components/ui/button'

export const ContentBlock = () => {
  return (
    <div class='flex flex-col gap-8 xl:flex-row xl:gap-16 xl:items-center'>
      <div>
        <p class='heading-4 text-general-brand-accent mb-3'>Haven’t found anything yet?</p>
        <h2 class='heading-1 mb-6'>Generate your own recipes with Replate.</h2>
        <Button>Generate</Button>
      </div>

      <div class='xl:max-w-[70%]'>
        <img class='rounded-6 lg:rounded-10' src='/images/home-content-block.jpeg' alt='Home content block' />
      </div>
    </div>
  )
}
