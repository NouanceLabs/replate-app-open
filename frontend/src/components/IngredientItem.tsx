import { Button } from '@/components/ui/button'
import { TrashIcon } from '@/icons/Trash'
import { Dynamic } from 'solid-js/web'

interface IngredientItemProps {
  ingredient: string
  onRemove: (ingredient: string) => void
  as?: string
}

export const IngredientItem = (props: IngredientItemProps) => {
  const { ingredient, onRemove, as: asFromProps } = props

  const component = asFromProps || 'div'

  return (
    <Dynamic
      component={component}
      class='px-4 py-2 border-b border-elements-border-primary capitalize gap-2 flex items-center justify-between'>
      <span class='py-2'>{ingredient}</span>

      <Button variant={'ghost'} class='text-red-500 py-0' size={'sm'} onClick={() => onRemove(ingredient!)}>
        <TrashIcon /> remove
      </Button>
    </Dynamic>
  )
}
