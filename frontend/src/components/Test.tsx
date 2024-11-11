import { useAuth } from '@/auth/provider'
import { createEffect, createMemo } from 'solid-js'

export const Test = () => {
  const { user, test, refresh } = useAuth()

  const memouser = createMemo(() => user())

  return (
    <div>
      <h1>Hello, World!</h1>
      <p>This is a test component.</p>
      <div>test: {memouser()?.email}</div>
      <div>always: {test()}</div>
      <button onClick={() => refresh()}>refresh</button>
    </div>
  )
}
