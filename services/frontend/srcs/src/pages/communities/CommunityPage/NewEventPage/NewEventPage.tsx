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
  ProgressBar,
  Select,
} from '@/components/ui'
import { useCommunity } from '@/features/communities/hooks'
import type { ContentVisibility } from '@/features/content/api'
import { useCreateEvent } from '@/features/content/hooks'
import { useCommunityPermissions } from '@/features/membership/hooks'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths'
import { ArrowLeft, Upload } from 'lucide-react'

const visibilityOptions: { value: ContentVisibility; label: string }[] = [
  { value: 'member', label: 'Sadece üyeler' },
  { value: 'moderator', label: 'Sadece moderatör ve yöneticiler' },
  { value: 'community_page', label: 'Kulüp sayfasını görebilen herkes' },
  { value: 'all', label: 'Herkese açık' },
]

const textareaClass =
  'w-full resize-y rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-body text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 hover:border-neutral-400'

const MAX_FILE_SIZE = 1024 * 1024 * 400

export function NewEventPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const { data: community, isPending: isCommunityPending } =
    useCommunity(slug)
  const { canModerate, isPending: isRolePending } = useCommunityPermissions(
    community?.id,
  )

  const { mutate, isPending, error, uploadProgress } = useCreateEvent(
    community?.id,
  )

  useDocumentTitle('Etkinlik oluştur')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [capacity, setCapacity] = useState('')
  const [visibility, setVisibility] = useState<ContentVisibility>('member')
  const [attachment, setAttachment] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  if (isCommunityPending || isRolePending) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Yükleniyor...</p>
      </Container>
    )
  }

  if (!community) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Kulüp bulunamadı.</p>
      </Container>
    )
  }

  if (!canModerate) {
    return (
      <Container className="py-14">
        <Forbidden />
      </Container>
    )
  }

  const isDateOrderValid =
    !startAt || !endAt || new Date(endAt) >= new Date(startAt)

  const isValid =
    title.trim().length > 0 &&
    title.length <= 200 &&
    content.trim().length > 0 &&
    endAt.trim().length > 0 &&
    isDateOrderValid

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!isValid) return

    mutate(
      {
        title: title.trim(),
        content: content.trim(),
        endAt: new Date(endAt).toISOString(),
        startAt: startAt ? new Date(startAt).toISOString() : undefined,
        capacity: capacity ? Number(capacity) : undefined,
        visibility,
        attachment: attachment ?? undefined,
      },
      {
        onSuccess: () => navigate(paths.communities.events(community.slug)),
      },
    )
  }

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-140">
        <Link
          to={paths.communities.events(community.slug)}
          className="text-caption hover:text-primary-700 inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Etkinliklere dön
        </Link>

        <h1 className="font-display text-h2 mt-5 font-semibold tracking-[-0.02em]">
          Etkinlik oluştur
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          {error && <Alert tone="danger">{error.message}</Alert>}

          <FormField id="event-title" label="Başlık">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Aylık buluşma"
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
                onChange={(event) => setContent(event.target.value)}
                className={textareaClass}
              />
            )}
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField id="event-start" label="Başlangıç" isOptional>
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="datetime-local"
                  value={startAt}
                  onChange={(event) => setStartAt(event.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="event-end"
              label="Bitiş"
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
                  onChange={(event) => setEndAt(event.target.value)}
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
                onChange={(event) => setCapacity(event.target.value)}
              />
            )}
          </FormField>

          <FormField id="event-visibility" label="Görünürlük">
            {() => (
              <Select
                value={visibility}
                onValueChange={(value) =>
                  setVisibility(value as ContentVisibility)
                }
                options={visibilityOptions}
                ariaLabel="Görünürlük"
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
                  }}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload size={15} aria-hidden="true" />
                    Dosya seç
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
                        Kaldır
                      </Button>
                    </>
                  )}
                </div>

                {uploadProgress !== null && (
                  <ProgressBar
                    value={uploadProgress}
                    max={100}
                    label={`Dosya yükleniyor... %${uploadProgress}`}
                    className="mt-3"
                  />
                )}
              </div>
            )}
          </FormField>

          <div className="flex justify-end gap-2 border-t border-neutral-200 pt-5">
            <Link to={paths.communities.events(community.slug)}>
              <Button type="button" variant="secondary">
                Vazgeç
              </Button>
            </Link>

            <Button type="submit" disabled={!isValid || isPending}>
              {isPending ? 'Oluşturuluyor…' : 'Etkinliği oluştur'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
