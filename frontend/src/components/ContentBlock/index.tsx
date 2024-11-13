import { useAuth } from '@/auth/provider'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@solidjs/router'
import { toast } from 'solid-sonner'

export const ContentBlock = () => {
  const { isAuthed } = useAuth()
  const navigate = useNavigate()

  const onClick = (e: any) => {
    e.preventDefault()

    if (isAuthed()) {
      navigate('/generate')
    } else {
      toast.info(
        <div class='prose prose-p:text-sm'>
          <p>
            You must be <a href='/login'>logged in</a> to generate a recipe.
          </p>
        </div>,
        {
          duration: 5000,
        }
      )
    }
  }

  return (
    <div class='flex flex-col gap-8 xl:flex-row xl:gap-16 xl:items-center'>
      <div>
        <p class='heading-4 text-general-brand-accent mb-3'>Haven’t found anything yet?</p>
        <h2 class='heading-1 mb-6'>Generate your own recipes with Replate.</h2>
        <Button onClick={onClick}>Generate</Button>
      </div>

      <div class='xl:max-w-[70%]'>
        <img class='rounded-6 lg:rounded-10' src='/images/home-content-block.jpeg' alt='Home content block' />
      </div>
    </div>
  )
}
