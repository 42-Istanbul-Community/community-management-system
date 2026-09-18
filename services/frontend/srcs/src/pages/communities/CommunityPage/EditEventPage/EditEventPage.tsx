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
import type { CommunityEvent } from '@/features/content/api'
import {
  useDeleteEvent,
  useEvent,
  useUpdateEvent,
} from '@/features/content/hooks'
import { useCommunityPermissions } from '@/features/membership/hooks'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { ArrowLeft, Upload } from 'lucide-react'

const textareaClass =
  'w-full resize-y rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-body text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 hover:border-neutral-400'

const MAX_FILE_SIZE = 10 * 1024 * 1024

function toDatetimeLocal(iso: string) {
  const date = new Date(iso)
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function EditEventPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>()

  const { data: community, isPending: isCommunityPending } =
    useCommunity(slug)
  const { data: event, isPending: isEventPending } = useEvent(
    id,
    slug,
    community?.id,
  )
  const { canModerate, isPending: isRolePending } = useCommunityPermissions(
    community?.id,
  )
  const currentUserId = useAuthStore((state) => state.user?.id)

  useDocumentTitle('Etkinliği düzenle')

  if (isCommunityPending || isEventPending || isRolePending) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Yükleniyor...</p>
      </Container>
    )
  }

  if (!community || !event) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Etkinlik bulunamadı.</p>
      </Container>
    )
  }

  const canEdit = canModerate || event.authorId === currentUserId

  if (!canEdit) {
    return (
      <Container className="py-14">
        <Forbidden />
      </Container>
    )
  }

  return (
    <EventEditForm
      communitySlug={community.slug}
      communityId={community.id}
      event={event}
    />
  )
}

function EventEditForm({
  communitySlug,
  communityId,
  event,
}: {
  communitySlug: string
  communityId: string
  event: CommunityEvent
}) {
  const navigate = useNavigate()

  const update = useUpdateEvent(communityId, event.id)
  const remove = useDeleteEvent(communityId)

  const [title, setTitle] = useState(event.title)
  const [content, setContent] = useState(event.description)
  const [startAt, setStartAt] = useState(toDatetimeLocal(event.startAt))
  const [endAt, setEndAt] = useState(
    event.endAt ? toDatetimeLocal(event.endAt) : '',
  )
  const [capacity, setCapacity] = useState(
    event.capacity !== null ? String(event.capacity) : '',
  )
  const [attachment, setAttachment] = useState<File | null>(null)
  const [removeAttachment, setRemoveAttachment] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const existingAttachment = event.attachments[0]

  const startAtIso = new Date(startAt).toISOString()
  const endAtIso = endAt ? new Date(endAt).toISOString() : null
  const capacityValue = capacity ? Number(capacity) : null

  const isDirty =
    title.trim() !== event.title ||
    content.trim() !== event.description ||
    startAtIso !== event.startAt ||
    endAtIso !== event.endAt ||
    capacityValue !== event.capacity ||
    attachment !== null ||
    removeAttachment

  const isDateOrderValid =
    !endAt || new Date(endAt) >= new Date(startAt)

  const isValid =
    title.trim().length > 0 &&
    title.length <= 200 &&
    content.trim().length > 0 &&
    startAt.trim().length > 0 &&
    isDateOrderValid

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (formEvent) => {
    formEvent.preventDefault()
    if (!isValid || !isDirty) return

    update.mutate(
      {
        title: title.trim() !== event.title ? title.trim() : undefined,
        content:
          content.trim() !== event.description ? content.trim() : undefined,
        capacity: capacityValue !== event.capacity ? (capacityValue ?? undefined) : undefined,
        startAt: startAtIso !== event.startAt ? startAtIso : undefined,
        endAt: endAtIso !== event.endAt ? (endAtIso ?? undefined) : undefined,
        attachment: attachment ?? undefined,
        removeAttachment: removeAttachment || undefined,
      },
      {
        onSuccess: () =>
          navigate(paths.communities.event(communitySlug, event.id)),
      },
    )
  }

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-140">
        <Link
          to={paths.communities.event(communitySlug, event.id)}
          className="text-caption hover:text-primary-700 inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Etkinliğe dön
        </Link>

        <h1 className="font-display text-h2 mt-5 font-semibold tracking-[-0.02em]">
          Etkinliği düzenle
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          {update.error && <Alert tone="danger">{update.error.message}</Alert>}
          {remove.error && <Alert tone="danger">{remove.error.message}</Alert>}

          <FormField id="event-title" label="Başlık">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={title}
                onChange={(formEvent) => setTitle(formEvent.target.value)}
                maxLength={200}
              />
            )}
          </FormField>

          <FormField id="event-content" label="Açıklama">
            {(fieldProps) => (
              <textarea
                {...fieldProps}
                rows={5}
                value={content}
                onChange={(formEvent) => setContent(formEvent.target.value)}
                className={textareaClass}
              />
            )}
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField id="event-start" label="Başlangıç">
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="datetime-local"
                  value={startAt}
                  onChange={(formEvent) => setStartAt(formEvent.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="event-end"
              label="Bitiş"
              isOptional
              error={
                !isDateOrderValid
                  ? 'Bitiş, başlangıçtan önce olamaz.'
                  : undefined
              }
            >
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="datetime-local"
                  value={endAt}
                  onChange={(formEvent) => setEndAt(formEvent.target.value)}
                />
              )}
            </FormField>
          </div>

          <FormField
            id="event-capacity"
            label="Kontenjan"
            hint="Boş bırakılırsa sınırsız katılım olur."
            isOptional
          >
            {(fieldProps) => (
              <Input
                {...fieldProps}
                type="number"
                min={1}
                value={capacity}
                onChange={(formEvent) => setCapacity(formEvent.target.value)}
              />
            )}
          </FormField>

          <FormField
            id="event-attachment"
            label="Ek dosya"
            error={fileError ?? undefined}
            isOptional
          >
            {() => (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  onChange={(formEvent) => {
                    const file = formEvent.target.files?.[0] ?? null

                    if (file && file.size > MAX_FILE_SIZE) {
                      setFileError('Dosya en fazla 10 MB olabilir.')
                      setAttachment(null)
                      formEvent.target.value = ''
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
            <Link to={paths.communities.event(communitySlug, event.id)}>
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
              Etkinliği sil
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
                  remove.mutate(event.id, {
                    onSuccess: () =>
                      navigate(paths.communities.events(communitySlug)),
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
              Etkinliği sil
            </Button>
          )}
        </div>
      </div>
    </Container>
  )
}
