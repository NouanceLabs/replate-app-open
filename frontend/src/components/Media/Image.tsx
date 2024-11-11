import { Media } from '@payload/payload-types'
import clsx from 'clsx'

interface Props {
  media: Media
  size?: 'medium' | 'large' | 'thumbnail' | 'xlarge'
  className?: string
  wrapperClassName?: string
  /**
   * @default true
   */
  enableWrapper?: boolean
}

export const Image = ({ enableWrapper = true, media, size: sizeFromProps, className, wrapperClassName }: Props) => {
  const { alt, url: urlFromProps, sizes } = media ?? {}
  const size = sizeFromProps || 'medium'
  const targetSize = sizes?.[size]

  const fileName = targetSize?.filename || urlFromProps
  const url = `${import.meta.env.VITE_CDN}/${fileName}`

  if (enableWrapper) {
    return (
      <figure class={clsx(wrapperClassName)}>
        <img class={clsx(className)} src={url} alt={alt} loading='lazy' />
      </figure>
    )
  }

  return <img class={clsx(className)} src={url} alt={alt} loading='lazy' />
}
