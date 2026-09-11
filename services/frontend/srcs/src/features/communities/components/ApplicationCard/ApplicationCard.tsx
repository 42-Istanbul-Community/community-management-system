import type { ApplicationCardProps } from './ApplicationCard.types'
import type { BadgeTone } from '@/components/ui'
import { Avatar, Badge, Button } from '@/components/ui'
import type { ApplicationStatus } from '@/features/communities/api'
import { getInitials } from '@/lib'
import { Check, X } from 'lucide-react'

const statusMeta: Record<
  ApplicationStatus,
  { label: string; tone: BadgeTone }
> = {
  pending: {
    label: 'Bekliyor',
    tone: 'warning',
  },
  approved: {
    label: 'Onaylandı',
    tone: 'success',
  },
  rejected: {
    label: 'Reddedildi',
    tone: 'danger',
  },
}

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function ApplicationCard({
  request,
  applicantName,
  applicantPicture,
  onDecide,
  isBusy,
}: ApplicationCardProps) {
  const meta = statusMeta[request.status]
  const isPending = request.status === 'pending'

  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar
            initials={getInitials(applicantName)}
            src={applicantPicture}
            name={applicantName}
            size="sm"
            className="h-10 w-10 text-[13px]"
          />

          <div className="min-w-0">
            <p className="text-body font-medium text-neutral-900">
              {applicantName}
            </p>
            <p className="text-caption text-neutral-500">
              {dateFormatter.format(new Date(request.created_at))} tarihinde
              başvurdu
            </p>
          </div>
        </div>

        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>

      {request.message && (
        <p className="text-body mt-3.5 text-neutral-700">{request.message}</p>
      )}

      {isPending && (
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            disabled={isBusy}
            onClick={() => onDecide(request.id, 'approved')}
          >
            <Check size={15} aria-hidden="true" />
            Onayla
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={isBusy}
            onClick={() => onDecide(request.id, 'rejected')}
          >
            <X size={15} aria-hidden="true" />
            Reddet
          </Button>
        </div>
      )}
    </article>
  )
}
