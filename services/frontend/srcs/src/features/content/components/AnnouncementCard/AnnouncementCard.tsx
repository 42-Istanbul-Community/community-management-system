import { Link } from 'react-router'

import type { AnnouncementCardProps } from './AnnouncementCard.types'
import { cn } from '@/lib'
import { paths } from '@/routes/paths'
import { Paperclip, Pin } from 'lucide-react'

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const { title, content, authorName, pinned, createdAt } = announcement

  return (
    <article
      className={cn(
        'rounded-lg border bg-white p-5 transition-colors',
        pinned
          ? 'border-primary-200 bg-primary-50'
          : 'border-neutral-200 hover:border-neutral-300',
      )}
    >
      {pinned && (
        <p className="text-caption text-primary-700 mb-2 flex items-center gap-1.5 font-medium">
          <Pin size={13} aria-hidden="true" />
          Sabitlenmiş duyuru
        </p>
      )}

      <h3 className="font-display text-[18px] font-semibold">
        <Link
          to={paths.communities.announcement(announcement.communitySlug, announcement.id)}
          className="hover:text-primary-700 transition-colors"
        >
          {title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 text-[15px] leading-[1.65] text-neutral-700">
        {content}
      </p>

      {announcement.attachments.length > 0 && (
        <p className="text-caption mt-3 flex items-center gap-1.5 text-neutral-500">
          <Paperclip size={13} aria-hidden="true" />
          {announcement.attachments.length} ek
        </p>
      )}

      <p className="text-caption mt-4 text-neutral-500">
        {authorName} · {dateFormatter.format(new Date(createdAt))}
      </p>
    </article>
  )
}
