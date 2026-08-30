import { useParams } from 'react-router'

import { Avatar, Breadcrumb, Container } from '@/components/ui'
import { AttachmentList } from '@/components/ui'
import { useCommunity } from '@/features/communities/hooks'
import { useDocumentTitle } from '@/hooks'
import { getInitials } from '@/lib'
import { announcements } from '@/mocks'
import { paths } from '@/routes/paths'
import { Pin } from 'lucide-react'

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export default function AnnouncementDetailPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>()

  const { data: community } = useCommunity(slug)
  const announcement = announcements.find((item) => item.id === id)

  useDocumentTitle(announcement?.title ?? 'Duyuru bulunamadı')

  return !community || !announcement ? (
    <Container className="py-14">
      <h1 className="font-display text-h2 font-semibold tracking-tight">
        Duyuru bulunamadı
      </h1>
      <p className="text-body-lg mt-3 text-neutral-700">
        Aradığınız duyuru kaldırılmış olabilir.
      </p>
    </Container>
  ) : (
    <Container className="py-10">
      <div className="mx-auto max-w-180">
        <Breadcrumb
          items={[
            { label: 'Kulüpler', to: paths.communities },
            { label: community.name, to: paths.community(community.slug) },
            { label: 'Duyuru' },
          ]}
        />

        <article className="mt-8">
          {announcement.pinned && (
            <p className="text-caption text-primary-700 mb-3 flex items-center gap-1.5 font-medium">
              <Pin size={13} aria-hidden="true" />
              Sabitlenmiş duyuru
            </p>
          )}

          <h1 className="font-display text-h2 font-semibold tracking-[-0.02em]">
            {announcement.title}
          </h1>

          <div className="mt-5 flex items-center gap-2.5 border-b border-neutral-200 pb-5">
            <Avatar
              initials={getInitials(announcement.authorName)}
              size="sm"
              className="h-9 w-9 text-[13px]"
            />

            <div className="min-w-0">
              <p className="text-caption font-medium text-neutral-800">
                {announcement.authorName}
              </p>
              <p className="text-[12px] text-neutral-500">
                {dateFormatter.format(new Date(announcement.createdAt))}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-4 text-[17px] leading-[1.75] text-neutral-800">
            {announcement.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <AttachmentList attachments={announcement.attachments} />
        </article>
      </div>
    </Container>
  )
}
