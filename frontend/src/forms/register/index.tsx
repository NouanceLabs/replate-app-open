import type { SubmitHandler } from '@modular-forms/solid'
import { createForm, FormError, valiForm } from '@modular-forms/solid'
import { TextField, TextFieldInput, TextFieldLabel, TextFieldErrorMessage } from '@/components/ui/text-field'
import { Button } from '@/components/ui/button'

import * as v from 'valibot'
import { loginClient, registerClient } from '@/auth/api'

import { useNavigate } from '@solidjs/router'
import { useAuth } from '@/auth/provider'
import { LoadingIndicator } from '@/components/LoadingIndicator'

const RegisterSchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string('Your email must be a string.'),
      v.nonEmpty('Please enter your email.'),
      v.email('The email address is badly formatted.')
    ),
    username: v.pipe(
      v.string('Your username must be a string.'),
      v.nonEmpty('Please enter your username.'),
      v.minLength(6, 'Your username must have 6 characters or more.'),
      v.maxLength(18, 'Your username must have less than 19 characters.')
    ),
    password: v.pipe(
      v.string('Your password must be a string.'),
      v.nonEmpty('Please enter your password.'),
      v.minLength(12, 'Your password must have 12 characters or more.'),
      v.maxLength(128, 'Your password must have less than 129 characters.')
    ),
    confirmPassword: v.pipe(
      v.string('Your password must be a string.'),
      v.nonEmpty('Please enter your password.'),
      v.minLength(12, 'Your password must have 12 characters or more.'),
      v.maxLength(128, 'Your password must have less than 129 characters.')
    ),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => {
        return input.password === input.confirmPassword
      },
      'The two passwords do not match.'
    ),
    ['confirmPassword']
  )
)

export type RegisterForm = v.InferOutput<typeof RegisterSchema>

export function RegisterForm() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [authForm, { Form, Field }] = createForm<RegisterForm>()

  const handleSubmit: SubmitHandler<RegisterForm> = async ({ email, username, password, confirmPassword }) => {
    const registration = await registerClient(email, username, password, confirmPassword)

    if (registration?.ok) {
      const loginResponse = await loginClient({ email, password })

      if (loginResponse?.ok) {
        const data = await loginResponse.json()

        if (data?.user) {
          console.log('setting user')
          setUser(data.user)
          navigate('/')
        }
      }
    } else {
      const errorLog = await registration?.json()
      const errors: Record<string, any> = {}

      errorLog?.errors?.forEach((error: any) => {
        const errorItem = error.data.errors[0]
        if (errorItem && 'field' in errorItem) errors[errorItem.field] = errorItem.message
      })

      throw new FormError('There was an error registering.', errors)
    }
  }

  return (
    <div class='grid gap-6'>
      <Form onSubmit={handleSubmit}>
        <div>{authForm.response.message}</div>
        <div class='flex flex-col gap-4'>
          <Field name='email'>
            {(field, props) => (
              <TextField class='gap-1' validationState={field.error ? 'invalid' : 'valid'}>
                <TextFieldLabel class=''>Email</TextFieldLabel>
                <TextFieldInput {...props} type='email' placeholder='me@email.com' />
                <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
              </TextField>
            )}
          </Field>
          <Field name='username'>
            {(field, props) => (
              <TextField class='gap-1' validationState={field.error ? 'invalid' : 'valid'}>
                <TextFieldLabel class=''>Username</TextFieldLabel>
                <div class='relative'>
                  <TextFieldInput {...props} type='text' class='indent-4' />
                  <span class='absolute left-2 top-2 pointer-events-none' aria-hidden='true'>
                    @
                  </span>
                </div>
                <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
              </TextField>
            )}
          </Field>
          <Field name='password'>
            {(field, props) => (
              <TextField class='gap-1' validationState={field.error ? 'invalid' : 'valid'}>
                <TextFieldLabel class=''>Password</TextFieldLabel>
                <TextFieldInput {...props} type='password' />
                <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
                <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
              </TextField>
            )}
          </Field>
          <Field name='confirmPassword'>
            {(field, props) => (
              <TextField class='gap-1' validationState={field.error ? 'invalid' : 'valid'}>
                <TextFieldLabel class=''>Confirm password</TextFieldLabel>
                <TextFieldInput {...props} type='password' />
                <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
              </TextField>
            )}
          </Field>

          <Button type='submit' disabled={authForm.submitting}>
            {authForm.submitting && <LoadingIndicator className='mr-2' />}
            Register
          </Button>
        </div>
      </Form>
    </div>
  )
}
