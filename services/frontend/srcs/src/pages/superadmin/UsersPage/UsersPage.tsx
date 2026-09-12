import { Link } from 'react-router'

import { Container, EmptyState } from '@/components/ui'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths'
import { ArrowLeft, Users } from 'lucide-react'

export function UsersPage() {
  useDocumentTitle('Kullanıcılar')

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-160">
        <Link
          to={paths.superadmin.root}
          className="text-caption hover:text-primary-700 inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Yönetime dön
        </Link>

        <h1 className="font-display text-h2 mt-5 font-semibold tracking-[-0.02em]">
          Kullanıcılar
        </h1>

        <div className="mt-10">
          <EmptyState
            icon={<Users size={22} aria-hidden="true" />}
            title="Kullanıcı listesi henüz hazır değil"
            description="Kayıtlı kullanıcıları listeleyen bir endpoint eklendiğinde burada görünecek."
          />
        </div>
      </div>
    </Container>
  )
}
