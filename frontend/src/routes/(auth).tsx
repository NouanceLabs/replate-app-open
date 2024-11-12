import { GeneralLayout } from '@/layouts/General'

interface Props {
  children?: any
}

export default function AuthLayout(props: Props) {
  return (
    <GeneralLayout>
      <div class='container mx-auto max-w-[30rem]'>{props.children}</div>
    </GeneralLayout>
  )
}
