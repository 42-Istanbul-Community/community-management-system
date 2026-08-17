import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { Button, FormField, Input } from '@/components/ui'
import { AuthDivider, OAuthButtons } from '@/features/auth/components'
import { loginSchema } from '@/features/auth/schemas'
import type { LoginValues } from '@/features/auth/schemas'
import { paths } from '@/routes/paths'
import { zodResolver } from '@hookform/resolvers/zod'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  function onSubmit(values: LoginValues) {
    // TODO: API katmanı hazır olunca POST /auth/login
    void values
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

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          Giriş Yap
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
