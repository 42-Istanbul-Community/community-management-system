import type { SubmitEventHandler } from 'react'
import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import {
  Alert,
  Button,
  Container,
  Forbidden,
  FormField,
  Input,
} from '@/components/ui'
import { useCommunity } from '@/features/communities/hooks'
import type { Announcement } from '@/features/content/api'
import {
  useAnnouncement,
  useDeleteAnnouncement,
  useUpdateAnnouncement,
} from '@/features/content/hooks'
import { useCommunityPermissions } from '@/features/membership/hooks'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { ArrowLeft, Upload } from 'lucide-react'

const textareaClass =
  'w-full resize-y rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-body text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 hover:border-neutral-400'

const MAX_FILE_SIZE = 1024 * 1024 * 400

export function EditAnnouncementPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>()

  const { data: community, isPending: isCommunityPending } =
    useCommunity(slug)
  const { data: announcement, isPending: isAnnouncementPending } =
    useAnnouncement(id, slug)
  const { canModerate, isPending: isRolePending } = useCommunityPermissions(
    community?.id,
  )
  const currentUserId = useAuthStore((state) => state.user?.id)

  useDocumentTitle('Duyuruyu düzenle')

  if (isCommunityPending || isAnnouncementPending || isRolePending) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Yükleniyor...</p>
      </Container>
    )
  }

  if (!community || !announcement) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Duyuru bulunamadı.</p>
      </Container>
    )
  }

  const canEdit = canModerate || announcement.authorId === currentUserId

  if (!canEdit) {
    return (
      <Container className="py-14">
        <Forbidden />
      </Container>
    )
  }

  return (
    <AnnouncementEditForm
      communitySlug={community.slug}
      communityId={community.id}
      announcement={announcement}
    />
  )
}

function AnnouncementEditForm({
  communitySlug,
  communityId,
  announcement,
}: {
  communitySlug: string
  communityId: string
  announcement: Announcement
}) {
  const navigate = useNavigate()

  const update = useUpdateAnnouncement(communityId, announcement.id)
  const remove = useDeleteAnnouncement(communityId)

  const [title, setTitle] = useState(announcement.title)
  const [content, setContent] = useState(announcement.content)
  const [pinned, setPinned] = useState(announcement.pinned)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [removeAttachment, setRemoveAttachment] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const existingAttachment = announcement.attachments[0]

  const isDirty =
    title.trim() !== announcement.title ||
    content.trim() !== announcement.content ||
    pinned !== announcement.pinned ||
    attachment !== null ||
    removeAttachment

  const isValid =
    title.trim().length > 0 &&
    title.length <= 200 &&
    content.trim().length > 0

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!isValid || !isDirty) return

    update.mutate(
      {
        title: title.trim() !== announcement.title ? title.trim() : undefined,
        content:
          content.trim() !== announcement.content ? content.trim() : undefined,
        pinned: pinned !== announcement.pinned ? pinned : undefined,
        attachment: attachment ?? undefined,
        removeAttachment: removeAttachment || undefined,
      },
      {
        onSuccess: () =>
          navigate(paths.communities.announcement(communitySlug, announcement.id)),
      },
    )
  }

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-140">
        <Link
          to={paths.communities.announcement(communitySlug, announcement.id)}
          className="text-caption hover:text-primary-700 inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Duyuruya dön
        </Link>

        <h1 className="font-display text-h2 mt-5 font-semibold tracking-[-0.02em]">
          Duyuruyu düzenle
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          {update.error && <Alert tone="danger">{update.error.message}</Alert>}
          {remove.error && <Alert tone="danger">{remove.error.message}</Alert>}

          <FormField id="announcement-title" label="Başlık">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
              />
            )}
          </FormField>

          <FormField id="announcement-content" label="İçerik">
            {(fieldProps) => (
              <textarea
                {...fieldProps}
                rows={6}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className={textareaClass}
              />
            )}
          </FormField>

          <label className="text-body flex items-center gap-2 text-neutral-800">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(event) => setPinned(event.target.checked)}
              className="h-4 w-4 rounded border-neutral-300"
            />
            Duyuruyu sabitle
          </label>

          <FormField
            id="announcement-attachment"
            label="Ek dosya"
            error={fileError ?? undefined}
            isOptional
          >
            {() => (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null

                    if (file && file.size > MAX_FILE_SIZE) {
                      setFileError('Dosya en fazla 10 MB olabilir.')
                      setAttachment(null)
                      event.target.value = ''
                      return
                    }

                    setFileError(null)
                    setAttachment(file)
                    setRemoveAttachment(false)
                  }}
                  className="hidden"
                />

                {existingAttachment && !attachment && !removeAttachment && (
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-caption truncate text-neutral-600">
                      {existingAttachment.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setRemoveAttachment(true)}
                    >
                      Kaldır
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload size={15} aria-hidden="true" />
                    {existingAttachment ? 'Dosyayı değiştir' : 'Dosya seç'}
                  </Button>

                  {attachment && (
                    <>
                      <span className="text-caption truncate text-neutral-600">
                        {attachment.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAttachment(null)
                          if (fileRef.current) fileRef.current.value = ''
                        }}
                      >
                        Vazgeç
                      </Button>
                    </>
                  )}
                </div>

                {update.uploadProgress !== null && (
                  <p className="text-caption mt-3 text-neutral-600">
                    Dosya yükleniyor... %{update.uploadProgress}
                  </p>
                )}
              </div>
            )}
          </FormField>

          <div className="flex justify-end gap-2 border-t border-neutral-200 pt-5">
            <Link
              to={paths.communities.announcement(
                communitySlug,
                announcement.id,
              )}
            >
              <Button type="button" variant="secondary">
                Vazgeç
              </Button>
            </Link>

            <Button type="submit" disabled={!isValid || !isDirty || update.isPending}>
              {update.isPending ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}
            </Button>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-5">
          <div className="min-w-0">
            <p className="text-body font-medium text-neutral-900">
              Duyuruyu sil
            </p>
            <p className="text-caption mt-1 text-neutral-600">
              Bu işlem geri alınamaz.
            </p>
          </div>

          {confirmingDelete ? (
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                disabled={remove.isPending}
                onClick={() =>
                  remove.mutate(announcement.id, {
                    onSuccess: () =>
                      navigate(paths.communities.announcements(communitySlug)),
                  })
                }
              >
                {remove.isPending ? 'Siliniyor…' : 'Silmeyi onayla'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfirmingDelete(false)}
              >
                Vazgeç
              </Button>
            </div>
          ) : (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmingDelete(true)}
            >
              Duyuruyu sil
            </Button>
          )}
        </div>
      </div>
    </Container>
  )
}
