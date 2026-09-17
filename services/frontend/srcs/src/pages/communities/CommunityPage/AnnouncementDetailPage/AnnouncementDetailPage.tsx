import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import {
  Alert,
  AttachmentList,
  Avatar,
  Breadcrumb,
  Button,
  Container,
} from '@/components/ui'
import { useUser } from '@/features/auth/hooks'
import { useCommunity } from '@/features/communities/hooks'
import {
  useAnnouncement,
  useAttachmentUrls,
  useDeleteAnnouncement,
} from '@/features/content/hooks'
import { useCommunityPermissions } from '@/features/membership/hooks'
import { useDocumentTitle } from '@/hooks'
import { assetUrl, getInitials } from '@/lib'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { Pin } from 'lucide-react'

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function AnnouncementDetailPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>()
  const navigate = useNavigate()

  const { data: community, isPending: isCommunityPending } = useCommunity(slug)
  const { data: announcement, isPending: isAnnouncementPending } =
    useAnnouncement(id, slug)
  const { data: author } = useUser(announcement?.authorId)
  const attachments = useAttachmentUrls(announcement?.attachments ?? [])
  const { canModerate } = useCommunityPermissions(community?.id)
  const currentUserId = useAuthStore((state) => state.user?.id)
  const remove = useDeleteAnnouncement(community?.id)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useDocumentTitle(announcement?.title ?? 'Duyuru')

  if (isCommunityPending || isAnnouncementPending) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Yükleniyor...</p>
      </Container>
    )
  }

  if (!community || !announcement) {
    return (
      <Container className="py-14">
        <h1 className="font-display text-h2 font-semibold tracking-tight">
          Duyuru bulunamadı
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Aradığınız duyuru kaldırılmış olabilir.
        </p>
      </Container>
    )
  }

  const authorName = author?.name ?? 'Kulüp yöneticisi'
  const canEdit = canModerate || announcement.authorId === currentUserId

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-180">
        <Breadcrumb
          items={[
            { label: 'Kulüpler', to: paths.communities.root },
            {
              label: community.name,
              to: paths.communities.detail(community.slug),
            },
            { label: announcement.title },
          ]}
        />

        <article className="mt-8">
          {remove.error && (
            <Alert tone="danger" className="mb-5">
              {remove.error.message}
            </Alert>
          )}

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
              initials={getInitials(authorName)}
              src={assetUrl(author?.picture)}
              name={authorName}
              size="sm"
              className="h-9 w-9 text-[13px]"
            />

            <div className="min-w-0">
              <p className="text-caption font-medium text-neutral-800">
                {authorName}
              </p>
              <p className="text-[12px] text-neutral-500">
                {dateFormatter.format(new Date(announcement.createdAt))}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-4 text-[17px] leading-[1.75] text-neutral-800">
            {announcement.content
              .split('\n\n')
              .map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>

          <AttachmentList attachments={attachments} />

          {canEdit && (
            <div className="mt-8 flex gap-2 border-t border-neutral-200 pt-6">
              <Link
                to={paths.communities.editAnnouncement(
                  community.slug,
                  announcement.id,
                )}
              >
                <Button type="button" variant="secondary" size="sm">
                  Düzenle
                </Button>
              </Link>

              {confirmingDelete ? (
                <>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    disabled={remove.isPending}
                    onClick={() =>
                      remove.mutate(announcement.id, {
                        onSuccess: () =>
                          navigate(
                            paths.communities.announcements(community.slug),
                          ),
                      })
                    }
                  >
                    {remove.isPending ? 'Siliniyor…' : 'Silmeyi onayla'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Vazgeç
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Sil
                </Button>
              )}
            </div>
          )}
        </article>
      </div>
    </Container>
  )
}
