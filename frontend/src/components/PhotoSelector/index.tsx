import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getUnsplashImages, setUnsplashImage } from '@/lib/fetch'
import { UnsplashImage } from '@/lib/types'
import { Accessor, createEffect, createSignal, For, Match, Resource, Show, Switch } from 'solid-js'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { toast } from 'solid-sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircleIcon } from '@/icons/HelpCircle'
import { Recipe } from '@payload/payload-types'
import clsx from 'clsx'
import { LoadingIndicator } from '@/components/LoadingIndicator'

interface Props {
  recipe: Accessor<Recipe> | Resource<Recipe>
  refetch?: () => Promise<void>
}

export const PhotoSelector = ({ recipe, refetch }: Props) => {
  const [hasBeenOpened, setHasBeenOpened] = createSignal(false)
  const [images, setImages] = createSignal<UnsplashImage[]>([])
  const [hasError, setHasError] = createSignal(false)
  const [selectedImage, setSelectedImage] = createSignal<string | null>(null)
  const [submitting, setSubmitting] = createSignal(false)
  const [open, setOpen] = createSignal(false)

  const [query, setQuery] = createSignal<string>()

  createEffect(() => {
    if (hasBeenOpened() && recipe()?.id) {
      getUnsplashImages(recipe()!.id, query())
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            setImages(data.results)
          } else {
            setHasError(true)
          }
        })
        .catch((error) => {
          setHasError(true)
        })
    }
  })

  const submitImage = () => {
    if (recipe()!.id && selectedImage()) {
      setSubmitting(true)
      setUnsplashImage(recipe()!.id, selectedImage()!)
        .then((response) => {
          if (response.ok) {
            toast.success('Image set successfully.')
            if (refetch) refetch().then(() => setOpen(false))
            setSubmitting(false)
          }
        })
        .catch((error) => {
          toast.error('Failed to set the image. Please try again.')
        })
    }
  }

  const activeQuery = (keyword: string) => {
    return query() === keyword
  }

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setHasBeenOpened(true)} as={Button} variant={'secondary'} class='text-sm' /* as={Button} */>
        Add a photo
      </DialogTrigger>
      <DialogContent class='max-w-[60rem] p-0'>
        <div class='relative flex flex-col gap-6 p-6 pb-0 '>
          <DialogHeader class='mb-8 text-left'>
            <DialogTitle>Choose a photo for this recipe.</DialogTitle>
            <DialogDescription>All images are sourced from Unsplash.</DialogDescription>
          </DialogHeader>

          <Show when={recipe()?.keywords}>
            <div>
              <p class='text-sm mb-1'>Additional filters</p>
              <div>
                <For each={recipe()!.keywords}>
                  {(keyword) => (
                    <button
                      onClick={() => setQuery(keyword)}
                      class={clsx(`inline-block border border-border px-2 py-1 rounded-2 text-xs mr-2 mb-2`, {
                        'bg-general-fg-primary text-white': activeQuery(keyword),
                        'bg-transparent ': !activeQuery(keyword),
                      })}>
                      {keyword}
                    </button>
                  )}
                </For>
              </div>
            </div>
          </Show>

          <Switch
            fallback={
              <div class='flex justify-center items-center gap-4'>
                <LoadingIndicator />
                <p>Loading images</p>
              </div>
            }>
            <Match when={images().length > 0}>
              <div class=''>
                <ToggleGroup class=' grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4' onChange={setSelectedImage}>
                  <For each={images()}>
                    {(image) => {
                      const attribution = `Photo by <a target="_blank" href="${image.user.links.html}?utm_source=replate&utm_medium=referral">@${image.user.username}</a> at <a target="_blank" href="${image.links.html}?utm_source=replate&utm_medium=referral">Unsplash</a>.`

                      return (
                        <ToggleGroupItem
                          class='relative h-auto w-auto p-0 aria-pressed:border-general-brand-accent aria-pressed:border-4 aspect-square flex items-stretch justify-stretch'
                          value={image.id}>
                          <img loading='lazy' class='object-cover w-full' src={image.urls.small} alt={image.alt_description} />

                          <Tooltip>
                            <TooltipTrigger class='text-white absolute top-1 right-1'>
                              <HelpCircleIcon />
                              <span class='sr-only'>Attribution</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p innerHTML={attribution}></p>
                            </TooltipContent>
                          </Tooltip>
                        </ToggleGroupItem>
                      )
                    }}
                  </For>
                </ToggleGroup>
              </div>
            </Match>
            <Match when={hasError()}>
              <div>
                There has been an error fetching the images. We likely hit our API limits, we're actively trying to increase our capacity.
                Please try again later.
              </div>
            </Match>
          </Switch>

          <div class='sticky bottom-0 bg-background pt-3 pb-3'>
            <Button onClick={submitImage} disabled={!selectedImage()}>
              Confirm selection
            </Button>
          </div>
        </div>

        <Dialog open={submitting()} onOpenChange={() => {}}>
          <DialogContent
            showCloseButton={false}
            class='bg-gradient-to-br from-general-brand-subtle to-white py-12 flex justify-center items-center'>
            <LoadingIndicator />

            <p class=''>Setting the image...</p>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
