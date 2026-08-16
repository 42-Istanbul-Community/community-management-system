import { Link } from 'react-router'

import { Button, FormField, Input } from '@/components/ui'
import {
  AuthDivider,
  AvatarUpload,
  OAuthButtons,
} from '@/features/auth/components'
import { paths } from '@/routes/paths'

export default function RegisterPage() {
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

      <OAuthButtons />
      <AuthDivider />
      <form className="flex flex-col gap-4">
        <FormField id="register-name" label="Ad Soyad">
          {(field) => (
            <Input
              {...field}
              autoComplete="name"
              placeholder="Adınız Soyadınız"
            />
          )}
        </FormField>

        <FormField id="register-email" label="E-posta">
          {(field) => (
            <Input
              {...field}
              type="email"
              autoComplete="email"
              placeholder="ornek@42istanbul.com.tr"
            />
          )}
        </FormField>

        <FormField
          id="register-password"
          label="Şifre"
          hint="En az 8 karakter olmalı"
        >
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
            />
          )}
        </FormField>

        <FormField id="register-password-confirm" label="Şifre tekrar">
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
            />
          )}
        </FormField>

        <div className="border-t border-neutral-200 pt-4">
          <AvatarUpload />
        </div>

        <Button type="submit" className="mt-2 w-full">
          Kayıt Ol
        </Button>
      </form>

      <p className="text-body mt-6 text-center text-neutral-600">
        Zaten hesabınız var mı?{' '}
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
