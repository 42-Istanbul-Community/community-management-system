import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { Alert, Button, FormField, Input } from '@/components/ui'
import { AuthDivider, OAuthButtons } from '@/features/auth/components'
import { useLogin } from '@/features/auth/hooks'
import { authErrorMessage } from '@/features/auth/lib'
import { loginSchema } from '@/features/auth/schemas'
import type { LoginValues } from '@/features/auth/schemas'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes'
import { zodResolver } from '@hookform/resolvers/zod'

export function LoginPage() {
  useDocumentTitle('Giriş Yap')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const loginMutation = useLogin()

  function onSubmit(values: LoginValues) {
    loginMutation.mutate(values)
  }

  return (
    <>
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-semibold tracking-tight">
          Tekrar hoş geldiniz
        </h1>
        <p className="text-body mt-1.5 text-neutral-600">
          Kulüplerinize devam etmek için giriş yapın.
        </p>
      </div>

      {loginMutation.isError && (
        <Alert className="mb-4">{authErrorMessage(loginMutation.error)}</Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <FormField
          id="login-email"
          label="E-posta"
          error={errors.email?.message}
        >
          {(field) => (
            <Input
              {...field}
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="ornek@42istanbul.com.tr"
              hasError={Boolean(errors.email)}
            />
          )}
        </FormField>

        <FormField
          id="login-password"
          label="Şifre"
          error={errors.password?.message}
        >
          {(field) => (
            <Input
              {...field}
              {...register('password')}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              hasError={Boolean(errors.password)}
            />
          )}
        </FormField>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="mt-2 w-full"
        >
          {loginMutation.isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </Button>
      </form>

      <AuthDivider />

      <OAuthButtons />

      <p className="text-body mt-6 flex flex-wrap justify-center gap-1 text-neutral-600">
        Hesabınız yok mu?
        <Link
          to={paths.register}
          className="text-primary-700 hover:text-primary-800 font-medium underline-offset-4 transition-colors hover:underline"
        >
          Kayıt olun
        </Link>
      </p>
    </>
  )
}
