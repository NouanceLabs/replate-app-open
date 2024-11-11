import { Button } from '@/components/ui/button'
import { TrashIcon } from '@/icons/Trash'
import { Accessor, createMemo } from 'solid-js'
import { Dynamic } from 'solid-js/web'

interface IngredientItemProps {
  label: string
  value: Accessor<string> | Accessor<string[]> | Accessor<number> | Accessor<{ label: string; value: string }[]>

  as?: string
}

export const SummaryItem = (props: IngredientItemProps) => {
  const { label, value: valueFromProps, as: asFromProps } = props

  const component = asFromProps || 'div'

  const value = createMemo(() => {
    const value = valueFromProps()
    if (typeof value === 'string') return value
    if (typeof value === 'number') return value.toString()
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None'

      return value
        .map((item) => {
          if (typeof item === 'string') return item
          else return item.label
        })
        .join(', ')
    }

    return 'None'
  })

  return (
    <Dynamic
      component={component}
      class='py-2 border-b border-elements-border-primary capitalize gap-2 flex items-baseline justify-between'>
      <span class='py-2'>{label}</span>

      <p class='max-w-[12rem]'>{value()}</p>
    </Dynamic>
  )
}
