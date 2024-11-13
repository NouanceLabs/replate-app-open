import type { SubmitHandler } from '@modular-forms/solid'
import { createForm } from '@modular-forms/solid'
import { TextField, TextFieldInput, TextFieldLabel, TextFieldErrorMessage } from '@/components/ui/text-field'
import { Button } from '@/components/ui/button'

import * as v from 'valibot'

import { loginClient } from '@/auth/api'
import { toast } from 'solid-sonner'
import { useNavigate } from '@solidjs/router'
import { LoadingIndicator } from '@/components/LoadingIndicator'
import { useAuth } from '@/auth/provider'

const LoginSchema = v.pipe(
  v.object({
    email: v.pipe(v.string('Your email must be a string.'), v.email('The email address is badly formatted.')),
    username: v.string('Your username must be a string.'),
    password: v.pipe(v.string('Your password must be a string.'), v.nonEmpty('Please enter your password.')),
  }),
  v.forward(
    v.partialCheck(
      [['email'], ['username']],
      (input) => {
        return Boolean(input.email || input.username)
      },
      'Provide your username or email to login.'
    ),
    ['username']
  )
)

export type LoginForm = v.InferOutput<typeof LoginSchema>

export function LoginForm() {
  const [authForm, { Form, Field }] = createForm<LoginForm>()
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit: SubmitHandler<LoginForm> = async ({ email, username, password }) => {
    let response

    if (email && password) {
      response = await loginClient({ email, password })
    } else if (username && password) {
      response = await loginClient({ username, password })
    }

    if (response?.ok) {
      const data = await response.json()

      if (data?.user) {
        setUser(data.user)
        toast.success('You have successfully logged in.')
        navigate('/')
        return
      }
    }

    toast.error('Failed to login.')
  }

  return (
    <div class='grid gap-6'>
      <Form onSubmit={handleSubmit}>
        <div class='flex flex-col gap-3'>
          <div class='flex flex-col mb-6'>
            <Field name='email'>
              {(field, props) => (
                <TextField class='gap-1' validationState={field.error ? 'invalid' : 'valid'}>
                  <TextFieldLabel class=''>Email</TextFieldLabel>
                  <TextFieldInput {...props} type='email' class='placeholder:text-gray-500' placeholder='me@email.com' />
                  <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
                </TextField>
              )}
            </Field>
            <div class='text-center text-gray-500 flex justify-center mt-1 -mb-5'>
              <div class='bg-primary rounded-full'>or</div>
            </div>
            <Field name='username'>
              {(field, props) => (
                <TextField class='gap-1' validationState={field.error ? 'invalid' : 'valid'}>
                  <TextFieldLabel class=''>Username</TextFieldLabel>
                  <div class='relative'>
                    <TextFieldInput {...props} type='text' class='indent-4' />
                    <span class='absolute left-2 top-2 pointer-events-none text-gray-500' aria-hidden='true'>
                      @
                    </span>
                  </div>
                  <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
                </TextField>
              )}
            </Field>
          </div>
          <Field name='password'>
            {(field, props) => (
              <TextField class='gap-1' validationState={field.error ? 'invalid' : 'valid'}>
                <TextFieldLabel class=''>Password</TextFieldLabel>
                <TextFieldInput {...props} type='password' />
                <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
              </TextField>
            )}
          </Field>

          <Button type='submit' disabled={authForm.submitting}>
            {authForm.submitting && <LoadingIndicator className='mr-2' />}
            Login
          </Button>
        </div>
      </Form>
    </div>
  )
}
