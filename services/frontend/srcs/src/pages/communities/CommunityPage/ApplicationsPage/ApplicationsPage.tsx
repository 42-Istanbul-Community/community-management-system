import { useMemo, useState } from 'react'

import type { StatusFilter } from './ApplicationsPage.types'
import { EmptyState, Forbidden, Select } from '@/components/ui'
import { useUsers } from '@/features/auth/hooks'
import type { ApplicationStatus } from '@/features/communities/api'
import { ApplicationCard } from '@/features/communities/components'
import {
  useCommunityContext,
  useCommunityPermissions,
  useMembershipRequests,
  useResolveRequest,
} from '@/features/communities/hooks'
import { assetUrl } from '@/lib'
import { Inbox } from 'lucide-react'

const filterOptions = [
  { value: 'pending', label: 'Bekleyenler' },
  { value: 'approved', label: 'Onaylananlar' },
  { value: 'rejected', label: 'Reddedilenler' },
  { value: 'all', label: 'Tümü' },
]

const statusOrder: Record<ApplicationStatus, number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
}

export function ApplicationsPage() {
  const { community } = useCommunityContext()
  const [filter, setFilter] = useState<StatusFilter>('pending')

  const { canModerate, isPending: isRolePending } = useCommunityPermissions(
    community.id,
  )

  const { data: requests, isPending } = useMembershipRequests(community.id)
  const resolve = useResolveRequest(community.id)

  const userIds = useMemo(
    () => requests?.map((request) => request.user_id) ?? [],
    [requests],
  )

  const { data: users } = useUsers(userIds)

  const visible = useMemo(() => {
    const all = requests ?? []
    const filtered =
      filter === 'all' ? all : all.filter((item) => item.status === filter)

    return [...filtered].sort((a, b) => {
      if (a.status !== b.status)
        return statusOrder[a.status] - statusOrder[b.status]
      return b.created_at.localeCompare(a.created_at)
    })
  }, [requests, filter])

  const summary = useMemo(() => {
    const all = requests ?? []
    const count = (status: ApplicationStatus) =>
      all.filter((item) => item.status === status).length

    if (filter === 'approved') {
      const approved = count('approved')
      return approved > 0
        ? `${approved} başvuru onaylandı`
        : 'Onaylanmış başvuru yok'
    }

    if (filter === 'rejected') {
      const rejected = count('rejected')
      return rejected > 0
        ? `${rejected} başvuru reddedildi`
        : 'Reddedilmiş başvuru yok'
    }

    const pending = count('pending')
    return pending > 0
      ? `${pending} başvuru yanıt bekliyor`
      : 'Bekleyen başvuru yok'
  }, [requests, filter])

  function handleDecide(id: string, status: 'approved' | 'rejected') {
    resolve.mutate({ requestIds: [id], status })
  }

  if (isRolePending) {
    return <p className="text-body text-neutral-600">Yükleniyor...</p>
  }

  if (!canModerate) {
    return <Forbidden />
  }

  if (isPending) {
    return <p className="text-body text-neutral-600">Yükleniyor...</p>
  }

  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        icon={<Inbox size={22} aria-hidden="true" />}
        title="Başvuru yok"
        description="Kulübe katılmak isteyenlerin başvuruları burada görünecek."
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-caption text-neutral-500">{summary}</p>

        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as StatusFilter)}
          options={filterOptions}
          ariaLabel="Başvuru durumuna göre filtrele"
        />
      </div>

      {visible.length === 0 ? (
        <p className="text-body py-6 text-center text-neutral-600">
          Bu durumda başvuru bulunmuyor.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((request) => (
            <ApplicationCard
              key={request.id}
              request={request}
              applicantName={users?.[request.user_id]?.name ?? 'Kullanıcı'}
              applicantPicture={assetUrl(users?.[request.user_id]?.picture)}
              onDecide={handleDecide}
              isBusy={resolve.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}
