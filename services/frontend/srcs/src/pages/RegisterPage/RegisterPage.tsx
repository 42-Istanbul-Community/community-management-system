import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { Button, FormField, Input } from '@/components/ui'
import {
  AuthDivider,
  AvatarUpload,
  OAuthButtons,
} from '@/features/auth/components'
import { registerSchema } from '@/features/auth/schemas'
import type { RegisterValues } from '@/features/auth/schemas'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths/paths'
import { zodResolver } from '@hookform/resolvers/zod'

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  function onSubmit(values: RegisterValues) {
    // TODO: POST /orchestration/register (multipart)
    void values
  }

  useDocumentTitle('Kayıt Ol')
  return (
    <>
      <div className="mb-7">
        <h1 className="font-display text-[26px] font-semibold tracking-tight">
          Hesap oluşturun
        </h1>
        <p className="text-body mt-1.5 text-neutral-600">
          Kulüplere katılmak için birkaç adım yeterli.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <FormField
          id="register-name"
          label="Ad Soyad"
          error={errors.name?.message}
        >
          {(field) => (
            <Input
              {...field}
              {...register('name')}
              autoComplete="name"
              placeholder="Adınız ve soyadınız"
              hasError={Boolean(errors.name)}
            />
          )}
        </FormField>

        <FormField
          id="register-email"
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
          id="register-password"
          label="Şifre"
          hint="En az 10 karakter, bir büyük harf ve bir rakam"
          error={errors.password?.message}
        >
          {(field) => (
            <Input
              {...field}
              {...register('password')}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              hasError={Boolean(errors.password)}
            />
          )}
        </FormField>

        <FormField
          id="register-password-confirm"
          label="Şifre tekrar"
          error={errors.passwordConfirm?.message}
        >
          {(field) => (
            <Input
              {...field}
              {...register('passwordConfirm')}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              hasError={Boolean(errors.passwordConfirm)}
            />
          )}
        </FormField>

        <div className="border-t border-neutral-200 pt-4">
          <Controller
            name="picture"
            control={control}
            render={({ field }) => (
              <AvatarUpload
                value={field.value}
                onChange={field.onChange}
                error={errors.picture?.message}
              />
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          Kayıt Ol
        </Button>
      </form>

      <AuthDivider />

      <OAuthButtons />

      <p className="text-body mt-6 flex justify-center gap-1 text-neutral-600">
        Zaten hesabınız var mı?
        <Link
          to={paths.login}
          className="text-primary-700 hover:text-primary-800 font-medium underline-offset-4 transition-colors hover:underline"
        >
          Giriş yapın
        </Link>
      </p>
    </>
  )
}
