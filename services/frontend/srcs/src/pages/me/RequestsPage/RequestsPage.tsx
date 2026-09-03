import { Link } from 'react-router'

import { Button, Container, EmptyState } from '@/components/ui'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths'
import { ArrowLeft, Inbox } from 'lucide-react'

export function RequestsPage() {
  useDocumentTitle('Başvurularım')

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-140">
        <Link
          to={paths.me.root}
          className="text-caption hover:text-primary-700 transtion-colors inline-flex items-center gap-1.5 font-medium text-neutral-600"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Profilime dön
        </Link>

        <h1 className="font-display text-h2 mt-5 font-semibold tracking-[-0.02em]">
          Başvurularım
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Kulüp katılım ve kulüp açma taleplerinizin durumunu buradan takip
          edebilirsiniz.
        </p>

        <div className="mt-10">
          <EmptyState
            icon={<Inbox size={22} aria-hidden="true" />}
            title="Henüz bir başvurunuz yok"
            description="Bir kulübe katılma isteği gönderdiğinizde veya kulüp açma talebi oluşturduğunuzda burada görünecek."
            action={
              <Link to={paths.communities.root}>
                <Button variant="secondary">Kulüpleri keşfet</Button>
              </Link>
            }
          />
        </div>
      </div>
    </Container>
  )
}
