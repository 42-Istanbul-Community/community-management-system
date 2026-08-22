import type { CommunityHeaderProps } from './CommunityHeader.types'
import { Avatar, Badge, Container, Tag } from '@/components/ui'
import { cn } from '@/lib'
import type { ClubAccess } from '@/mocks'
import { CalendarDays, Users } from 'lucide-react'

const accessLabels: Record<ClubAccess, string> = {
  open: 'Açık',
  restricted: 'Kısıtlı',
  closed: 'Kapalı',
}

const accessTones = {
  open: 'success',
  restricted: 'warning',
  closed: 'neutral',
} as const

const memberFormatter = new Intl.NumberFormat('tr-TR')
const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  year: 'numeric',
  month: 'long',
})

export function CommunityHeader({ club }: CommunityHeaderProps) {
  const isClosed = club.access === 'closed'

  return (
    <header>
      <div
        aria-hidden="true"
        className={cn(
          'h-28 w-full sm:h-36 lg:h-44',
          isClosed ? 'bg-neutral-200' : 'bg-primary-200',
        )}
      />

      <Container>
        <div className="-mt-12">
          <Avatar
            initials={club.initials}
            size="lg"
            className={cn(
              'border-4 border-neutral-50 shadow-sm',
              isClosed && 'bg-neutral-100 text-neutral-500',
            )}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2">
          <h1 className="font-display sm:text-h2 text-[26px] font-semibold tracking-tight sm:tracking-[-0.02em]">
            {club.name}
          </h1>

          <Badge tone={accessTones[club.access]}>
            {accessLabels[club.access]}
          </Badge>

          {club.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:ms-auto">
              {club.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </div>

        <div className="text-caption mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-neutral-500">
          <span className="flex items-center gap-1.75">
            <Users size={14} aria-hidden="true" />
            {memberFormatter.format(club.memberCount)} üye
          </span>

          <span className="flex items-center gap-1.75">
            <CalendarDays size={14} aria-hidden="true" />
            {dateFormatter.format(new Date(club.createdAt))} tarihinde kuruldu
          </span>
        </div>
      </Container>
    </header>
  )
}
