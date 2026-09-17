import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'

import { Container } from '@/components/ui'
import { useExchange } from '@/features/auth/hooks'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths'
import { CircleAlert, LoaderCircle } from 'lucide-react'

export function ExchangePage() {
  useDocumentTitle('Giriş yapılıyor')

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const { mutate, isError, error } = useExchange()
  const hasRun = useRef(false)

  useEffect(() => {
    if (!token || hasRun.current) return

    hasRun.current = true
    mutate(token)
  }, [token, mutate])

  const hasFailed = !token || isError

  return (
    <Container className="flex min-h-100 items-center justify-center py-20">
      <div className="max-w-100 text-center">
        {hasFailed ? (
          <>
            <div className="bg-danger-soft mx-auto flex h-12 w-12 items-center justify-center rounded-full">
              <CircleAlert
                size={22}
                className="text-danger"
                aria-hidden="true"
              />
            </div>

            <h1 className="font-display mt-5 text-[22px] font-semibold tracking-tight">
              Giriş tamamlanamadı
            </h1>

            <p className="text-body mt-2.5 text-neutral-600">
              {!token
                ? 'Bağlantı eksik görünüyor. Giriş işlemini yeniden deneyin.'
                : (error?.message ??
                  'Bağlantının süresi dolmuş olabilir. Yeniden deneyin.')}
            </p>

            <Link
              to={paths.login}
              className="text-body text-primary-700 hover:text-primary-800 mt-6 inline-block font-medium transition-colors"
            >
              Giriş sayfasına dön
            </Link>
          </>
        ) : (
          <>
            <LoaderCircle
              size={28}
              className="text-primary-600 mx-auto animate-spin"
              aria-hidden="true"
            />

            <p
              aria-live="polite"
              className="text-body mt-5 font-medium text-neutral-700"
            >
              Giriş yapılıyor
            </p>

            <p className="text-caption mt-1.5 text-neutral-500">
              Bu işlem birkaç saniye sürebilir.
            </p>
          </>
        )}
      </div>
    </Container>
  )
}
