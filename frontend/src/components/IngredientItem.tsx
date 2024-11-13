import { Button } from '@/components/ui/button'
import { TrashIcon } from '@/icons/Trash'
import { Dynamic, Match, Switch } from 'solid-js/web'

interface IngredientItemProps {
  ingredient: string
  onRemove?: (ingredient: string) => void
  onInsert?: (ingredient: string) => void
  as?: string
}

export const IngredientItem = (props: IngredientItemProps) => {
  const { ingredient, onRemove, onInsert, as: asFromProps } = props

  const component = asFromProps || 'div'

  return (
    <Dynamic
      component={component}
      class='px-4 py-2 border-b border-elements-border-primary capitalize gap-2 flex items-center justify-between'>
      <span class='py-2'>{ingredient}</span>

      <Switch>
        <Match when={onRemove}>
          <Button variant={'ghost'} class='text-red-500 py-0' size={'sm'} onClick={() => onRemove!(ingredient!)}>
            <TrashIcon /> remove
          </Button>
        </Match>
        <Match when={onInsert}>
          <Button variant={'ghost'} class='text-general-brand-accent py-0' size={'sm'} onClick={() => onInsert!(ingredient!)}>
            insert
          </Button>
        </Match>
      </Switch>
    </Dynamic>
  )
}
