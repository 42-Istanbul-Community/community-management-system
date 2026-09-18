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
import { useCreateAnnouncement } from '@/features/content/hooks'
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

export function NewAnnouncementPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const { data: community, isPending: isCommunityPending } = useCommunity(slug)
  const { canModerate, isPending: isRolePending } = useCommunityPermissions(
    community?.id,
  )

  const { mutate, isPending, error, uploadProgress } = useCreateAnnouncement(
    community?.id,
  )

  useDocumentTitle('Duyuru paylaş')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
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

  const isValid =
    title.trim().length > 0 && title.length <= 200 && content.trim().length > 0

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!isValid) return

    mutate(
      {
        title: title.trim(),
        content: content.trim(),
        pinned,
        visibility,
        attachment: attachment ?? undefined,
      },
      {
        onSuccess: () =>
          navigate(paths.communities.announcements(community.slug)),
      },
    )
  }

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-140">
        <Link
          to={paths.communities.announcements(community.slug)}
          className="text-caption hover:text-primary-700 inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Duyurulara dön
        </Link>

        <h1 className="font-display text-h2 mt-5 font-semibold tracking-[-0.02em]">
          Duyuru paylaş
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          {error && <Alert tone="danger">{error.message}</Alert>}

          <FormField id="announcement-title" label="Başlık">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Bu haftaki gündem"
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

          <FormField id="announcement-visibility" label="Görünürlük">
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
            <Link to={paths.communities.announcements(community.slug)}>
              <Button type="button" variant="secondary">
                Vazgeç
              </Button>
            </Link>

            <Button type="submit" disabled={!isValid || isPending}>
              {isPending ? 'Paylaşılıyor…' : 'Duyuruyu paylaş'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
