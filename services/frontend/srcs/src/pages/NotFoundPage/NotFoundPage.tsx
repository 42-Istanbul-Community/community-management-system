import { Link } from 'react-router'

import { Container, buttonStyles } from '@/components/ui'
import { useDocumentTitle } from '@/hooks'
import { cn } from '@/lib/cn/cn'

export function NotFoundPage() {
  useDocumentTitle('Sayfa bulunamadı')
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-14 text-center">
      <span className="text-caption font-mono text-neutral-500">404</span>
      <h1 className="font-display text-h2 mt-3 font-semibold tracking-tight">
        Aradığınız sayfa bulunamadı.
      </h1>
      <p className="text-body-lg mt-3 max-w-md text-neutral-700">
        Bağlantı taşınmış veya hiç var olmamış olabilir.
      </p>
      <Link to="/" className={cn(buttonStyles(), 'mt-8')}>
        Ana sayfaya dön
      </Link>
    </Container>
  )
}
