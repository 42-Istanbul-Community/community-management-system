import { useMemo, useState } from 'react'

import { EmptyState, Select } from '@/components/ui'
import { ApplicationCard, useCommunityContext } from '@/features/communities'
import type { Application, ApplicationStatus } from '@/mocks'
import { applications as allApplications } from '@/mocks'
import { Inbox } from 'lucide-react'

type StatusFilter = ApplicationStatus | 'all'

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

export default function ApplicationsPage() {
  const { club } = useCommunityContext()

  const [items, setItems] = useState<Application[]>(() =>
    allApplications.filter((item) => item.communitySlug === club.slug),
  )
  const [filter, setFilter] = useState<StatusFilter>('pending')

  const visible = useMemo(() => {
    const filtered =
      filter === 'all' ? items : items.filter((item) => item.status === filter)

    return [...filtered].sort((a, b) => {
      if (a.status !== b.status)
        return statusOrder[a.status] - statusOrder[b.status]
      return b.createdAt.localeCompare(a.createdAt)
    })
  }, [items, filter])

  const summary = useMemo(() => {
    const count = (status: ApplicationStatus) =>
      items.filter((item) => item.status === status).length

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
  }, [items, filter])

  function handleDecide(id: string, status: ApplicationStatus) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    )
  }

  if (items.length === 0) {
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
          {visible.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onDecide={handleDecide}
            />
          ))}
        </div>
      )}
    </div>
  )
}
