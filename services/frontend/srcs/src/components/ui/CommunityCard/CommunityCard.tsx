import { Link } from 'react-router'

import type { CommunityCardProps } from './CommunityCard.types'
import { Avatar, Badge, Tag, buttonStyles } from '@/components/ui'
import { useCommunityPermissions } from '@/features'
import type { ApiCommunityAccess } from '@/features/communities/api'
import { assetUrl, cn } from '@/lib'
import { paths } from '@/routes'
import { useAuthStore } from '@/stores'
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

export function CommunityCard({
  id,
  name,
  slug,
  initials,
  picture,
  backgroundPicture,
  description,
  tags,
  memberCount,
  access,
}: CommunityCardProps) {
  const isSuperAdmin = useAuthStore(
    (state) => state.user?.role === 'super_admin',
  )
  const { isMember, canModerate } = useCommunityPermissions(id)

  const isClosed = access === 'closed'
  const cover = assetUrl(backgroundPicture)

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
          'relative z-0 aspect-4/1 shrink-0 overflow-hidden',
          isClosed ? 'bg-neutral-200' : 'bg-primary-200',
        )}
      >
        {cover && (
          <img src={cover} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="relative z-10 -mt-10.5 mb-3.5">
          <Avatar
            initials={initials}
            src={assetUrl(picture)}
            name={name}
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

          {isClosed && !isSuperAdmin && isMember && canModerate ? (
            <button
              type="button"
              disabled
              className={buttonStyles({ size: 'sm' })}
            >
              Kulübe Git
            </button>
          ) : (
            <Link
              to={paths.communities.detail(slug)}
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
