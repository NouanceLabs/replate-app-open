import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Accessor, createEffect, onCleanup } from 'solid-js'
import { useNavigate } from '@solidjs/router'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const useClickableCard = (cardRef: Accessor<HTMLElement | undefined>, anchorRef: Accessor<HTMLAnchorElement | undefined>) => {
  const navigate = useNavigate()

  let timeDown = 0
  let hasActiveParent = false
  let pressedButton = 0

  const handleMouseDown = (e: MouseEvent) => {
    if (e.target) {
      const target = e.target as Element

      const timeNow = +new Date()
      const parent = target?.closest('a')

      pressedButton = e.button

      if (!parent) {
        hasActiveParent = false
        timeDown = timeNow
      } else {
        hasActiveParent = true
      }
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    const anchor = anchorRef()
    if (anchor?.href) {
      const timeNow = +new Date()
      const difference = timeNow - timeDown

      if (anchor?.href && difference <= 250) {
        if (!hasActiveParent && pressedButton === 0 && !e.ctrlKey) {
          const href = new URL(anchor.href)

          navigate(href.pathname)
        }
      }
    }
  }

  createEffect(() => {
    const card = cardRef()

    if (card) {
      card.addEventListener('mousedown', handleMouseDown)
      card.addEventListener('mouseup', handleMouseUp)
    }

    onCleanup(() => {
      const card = cardRef()
      if (card) {
        card.removeEventListener('mousedown', handleMouseDown)
        card.removeEventListener('mouseup', handleMouseUp)
      }
    })
  })

  return {
    cardRef,
    anchorRef,
  }
}
