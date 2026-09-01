import type { LegalLayoutProps } from './LegalLayout.types'
import { Container } from '@/components/ui'

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  return (
    <Container className="py-14">
      <div className="mx-auto max-w-180">
        <h1 className="font-display text-h2 font-semibold tracking-[-0.02em]">
          {title}
        </h1>
        <p className="text-caption mt-3 text-neutral-500">
          Son güncelleme: {dateFormatter.format(new Date(updatedAt))}
        </p>
        <div className="mt-10 flex flex-col gap-8">{children}</div>
      </div>
    </Container>
  )
}
