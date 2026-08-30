import { Link } from 'react-router'

import type { ClubCardProps } from './ClubCard.types'
import { Avatar, Badge, Tag, buttonStyles } from '@/components/ui'
import { cn } from '@/lib/cn/cn'
import type { ApiCommunityAccess } from '@/features/communities/api'
import { paths } from '@/routes/paths/paths'
import { Users } from 'lucide-react'

const accessLabels: Record<ApiCommunityAccess, string> = {
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

export function ClubCard({
  name,
  slug,
  initials,
  description,
  tags,
  memberCount,
  access,
}: ClubCardProps) {
  const isClosed = access === 'closed'

  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white',
        'transition-colors duration-150 hover:shadow-md',
        isClosed ? 'hover:border-neutral-400' : 'hover:border-primary-600',
      )}
    >
      <div
        className={cn(
          'h-22 shrink-0',
          isClosed ? 'bg-neutral-200' : 'bg-primary-200',
        )}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="-mt-10.5 mb-3.5">
          <Avatar
            initials={initials}
            size="md"
            className={cn(
              'border-[3px] border-white shadow-sm',
              isClosed && 'bg-neutral-100 text-neutral-500',
            )}
          />
        </div>

        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <h3 className="font-display text-[18px] font-semibold">{name}</h3>
          <Badge tone={accessTones[access]}>{accessLabels[access]}</Badge>
        </div>

        <p className="mb-4.5 text-[14.5px] leading-[1.6] text-neutral-600">
          {description}
        </p>

        <div className="mb-4.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
          <span className="text-caption flex items-center gap-1.75 text-neutral-500">
            <Users size={14} aria-hidden="true" />
            {memberFormatter.format(memberCount)} üye
          </span>

          {isClosed ? (
            <button
              type="button"
              disabled
              className={buttonStyles({ size: 'sm' })}
            >
              Kulübe Git
            </button>
          ) : (
            <Link
              to={paths.community(slug)}
              className={buttonStyles({ size: 'sm' })}
            >
              Kulübe Git
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
