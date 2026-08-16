import { Link } from 'react-router'

import { Button, FormField, Input } from '@/components/ui'
import { AuthDivider, OAuthButtons } from '@/features/auth/components/'
import { paths } from '@/routes/paths'

export default function LoginPage() {
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

      <OAuthButtons />

      <AuthDivider />

      <form className="flex flex-col gap-4">
        <FormField id="email" label="E-posta">
          {(field) => (
            <Input
              {...field}
              type="email"
              autoComplete="email"
              placeholder="ornek@42istanbul.com.tr"
            />
          )}
        </FormField>

        <FormField id="password" label="Şifre">
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          )}
        </FormField>

        <Button type="submit" className="mt-2 w-full cursor-pointer">
          Giriş Yap
        </Button>
      </form>

      <p className="text-body mt-6 text-center text-neutral-600">
        Hesabınız yok mu?{' '}
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
