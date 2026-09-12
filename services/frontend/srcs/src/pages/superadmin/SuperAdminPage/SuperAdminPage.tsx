import { Link } from 'react-router'

import { Container } from '@/components/ui'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths'
import { Inbox, Users } from 'lucide-react'

export function SuperAdminPage() {
  useDocumentTitle('Yönetim')

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-160">
        <h1 className="font-display text-h2 font-semibold tracking-[-0.02em]">
          Yönetim
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Kulüp taleplerini karara bağlayın ve kullanıcıları yönetin.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            to={paths.superadmin.communityRequests}
            className="hover:border-primary-300 rounded-lg border border-neutral-200 bg-white p-5 transition-colors"
          >
            <Inbox size={20} className="text-primary-600" aria-hidden="true" />
            <p className="text-body mt-3 font-medium text-neutral-900">
              Kulüp talepleri
            </p>
            <p className="text-caption mt-1 text-neutral-600">
              Yeni kulüp açma taleplerini inceleyin
            </p>
          </Link>

          <Link
            to={paths.superadmin.users}
            className="hover:border-primary-300 rounded-lg border border-neutral-200 bg-white p-5 transition-colors"
          >
            <Users size={20} className="text-primary-600" aria-hidden="true" />
            <p className="text-body mt-3 font-medium text-neutral-900">
              Kullanıcılar
            </p>
            <p className="text-caption mt-1 text-neutral-600">
              Kayıtlı kullanıcıları görüntüleyin
            </p>
          </Link>
        </div>
      </div>
    </Container>
  )
}
