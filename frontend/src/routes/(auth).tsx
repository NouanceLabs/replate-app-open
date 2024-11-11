interface Props {
  children?: any
}

export default function AuthLayout(props: Props) {
  return <main class='container mx-auto max-w-[30rem]'>{props.children}</main>
}
