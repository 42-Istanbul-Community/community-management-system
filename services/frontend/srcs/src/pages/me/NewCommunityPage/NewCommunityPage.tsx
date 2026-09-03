import type { FormEventHandler } from 'react'
import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'

import {
  Alert,
  Button,
  Container,
  FormField,
  Input,
  Select,
  Tag,
} from '@/components/ui'
import type {
  ApiCommunityAccess,
  ApiCommunityVisibility,
} from '@/features/communities/api'
import {
  useCommunities,
  useCreateCommunity,
} from '@/features/communities/hooks'
import { useDocumentTitle } from '@/hooks'
import { paths } from '@/routes/paths'
import { ArrowLeft, CircleCheck, Plus, Upload, X } from 'lucide-react'

const MAX_TAGS = 3

const accessOptions = [
  { value: 'open', label: 'Açık — herkes katılabilir' },
  { value: 'restricted', label: 'Kısıtlı — başvuru onayı gerekir' },
  { value: 'closed', label: 'Kapalı — yeni üye alınmıyor' },
]

const visibilityOptions = [
  { value: 'public', label: 'Herkese açık' },
  { value: 'private', label: 'Gizli — sadece üyeler görebilir' },
]

const textareaClass =
  'w-full resize-y rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-body text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 hover:border-neutral-400'

const MAX_FILE_SIZE = 1024 * 1024

export function NewCommunityPage() {
  useDocumentTitle('Kulüp aç')

  const { mutate, isPending, isSuccess, error } = useCreateCommunity()
  const { data: communities } = useCommunities()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [access, setAccess] = useState<ApiCommunityAccess>('open')
  const [visibility, setVisibility] = useState<ApiCommunityVisibility>('public')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [rules, setRules] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const suggestedTags = useMemo(() => {
    const all = new Set<string>()
    communities?.forEach((community) =>
      community.tags.forEach((tag) => all.add(tag)),
    )
    return [...all].sort((a, b) => a.localeCompare(b, 'tr'))
  }, [communities])

  const isValid =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    message.trim().length > 0

  const isTagLimitReached = tags.length >= MAX_TAGS
  const trimmedTagInput = tagInput.trim()
  const canAddTag =
    trimmedTagInput.length > 0 &&
    !tags.includes(trimmedTagInput) &&
    !isTagLimitReached

  function toggleTag(tag: string) {
    setTags((current) => {
      if (current.includes(tag)) return current.filter((item) => item !== tag)
      if (current.length >= MAX_TAGS) return current
      return [...current, tag]
    })
  }

  function addTag() {
    if (!canAddTag) return

    setTags((current) => [...current, trimmedTagInput])
    setTagInput('')
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!isValid) return

    mutate({
      name: name.trim(),
      description: description.trim(),
      message: message.trim(),
      access,
      visibility,
      tags,
      rules: rules ?? undefined,
    })
  }

  if (isSuccess) {
    return (
      <Container className="flex min-h-100 items-center justify-center py-20">
        <div className="max-w-110 text-center">
          <div className="bg-success-soft mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <CircleCheck
              size={22}
              className="text-success"
              aria-hidden="true"
            />
          </div>

          <h1 className="font-display mt-5 text-[24px] font-semibold tracking-tight">
            Talebiniz alındı
          </h1>

          <p className="text-body mt-3 text-neutral-600">
            Kulüp açma talebiniz yöneticilere iletildi. Durumunu
            başvurularınızdan takip edebilirsiniz.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Link to={paths.me.requests}>
              <Button>Başvurularım</Button>
            </Link>
            <Link to={paths.me.root}>
              <Button variant="secondary">Profilime dön</Button>
            </Link>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-140">
        <Link
          to={paths.me.root}
          className="text-caption hover:text-primary-700 inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Profilime dön
        </Link>

        <h1 className="font-display text-h2 mt-5 font-semibold tracking-[-0.02em]">
          Kulüp aç
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Talebiniz yöneticiler tarafından incelendikten sonra kulübünüz yayına
          alınır.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          {error && <Alert tone="danger">{error.message}</Alert>}

          <FormField id="community-name" label="Kulüp adı">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Fotoğrafçılık Kulübü"
              />
            )}
          </FormField>

          <FormField
            id="community-description"
            label="Açıklama"
            hint="Kulübün ne yaptığını birkaç cümleyle anlatın."
          >
            {(fieldProps) => (
              <textarea
                {...fieldProps}
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className={textareaClass}
              />
            )}
          </FormField>

          <FormField id="community-tags" label="Etiketler" isOptional>
            {() => (
              <div className="rounded-md border border-neutral-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-caption font-medium text-neutral-700">
                    Seçilenler
                  </p>
                  <p className="text-caption text-neutral-500">
                    {tags.length} / {MAX_TAGS}
                  </p>
                </div>

                {tags.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        aria-label={`${tag} etiketini kaldır`}
                        className="text-tag bg-primary-100 text-primary-700 hover:bg-primary-200 flex cursor-pointer items-center gap-1.5 rounded-full py-1 ps-2.5 pe-2 font-medium transition-colors"
                      >
                        {tag}
                        <X size={12} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-caption mt-2.5 text-neutral-500">
                    Henüz etiket seçilmedi.
                  </p>
                )}

                <div className="mt-4 border-t border-neutral-100 pt-4">
                  <p className="text-caption mb-2.5 font-medium text-neutral-700">
                    Öneriler
                  </p>

                  {suggestedTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedTags.map((tag) => (
                        <Tag
                          key={tag}
                          isActive={tags.includes(tag)}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <p className="text-caption text-neutral-500">
                      Öneri bulunamadı.
                    </p>
                  )}
                </div>

                <div className="mt-4 border-t border-neutral-100 pt-4">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter') return
                        event.preventDefault()
                        addTag()
                      }}
                      disabled={isTagLimitReached}
                      placeholder="Kendi etiketini yaz"
                      aria-label="Yeni etiket"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addTag}
                      disabled={!canAddTag}
                    >
                      <Plus size={15} aria-hidden="true" />
                      Ekle
                    </Button>
                  </div>

                  <p
                    aria-live="polite"
                    className="text-caption mt-2 text-neutral-500"
                  >
                    {isTagLimitReached
                      ? `En fazla ${MAX_TAGS} etiket seçebilirsiniz.`
                      : 'Eklemek için Enter’a basabilirsiniz.'}
                  </p>
                </div>
              </div>
            )}
          </FormField>

          <FormField id="community-access" label="Katılım">
            {() => (
              <Select
                value={access}
                onValueChange={(value) =>
                  setAccess(value as ApiCommunityAccess)
                }
                options={accessOptions}
                ariaLabel="Katılım türü"
              />
            )}
          </FormField>

          <FormField id="community-visibility" label="Görünürlük">
            {() => (
              <Select
                value={visibility}
                onValueChange={(value) =>
                  setVisibility(value as ApiCommunityVisibility)
                }
                options={visibilityOptions}
                ariaLabel="Görünürlük"
              />
            )}
          </FormField>

          <FormField
            id="community-rules"
            label="Kulüp tüzüğü"
            hint="PDF olarak yükleyebilirsiniz."
            isOptional
          >
            {() => (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null

                    if (file && file.size > MAX_FILE_SIZE) {
                      setFileError('Dosya en fazla 1 MB olabilir.')
                      setRules(null)
                      event.target.value = ''
                      return
                    }

                    setFileError(null)
                    setRules(file)
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

                  {rules && (
                    <>
                      <span className="text-caption truncate text-neutral-600">
                        {rules.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setRules(null)
                          if (fileRef.current) fileRef.current.value = ''
                        }}
                      >
                        Kaldır
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </FormField>

          <FormField
            id="community-message"
            label="Yöneticilere mesaj"
            hint="Kulübü neden açmak istediğinizi kısaca yazın."
          >
            {(fieldProps) => (
              <textarea
                {...fieldProps}
                rows={3}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={textareaClass}
              />
            )}
          </FormField>

          <div className="flex justify-end gap-2 border-t border-neutral-200 pt-5">
            <Link to={paths.me.root}>
              <Button type="button" variant="secondary">
                Vazgeç
              </Button>
            </Link>

            <Button type="submit" disabled={!isValid || isPending}>
              {isPending ? 'Gönderiliyor…' : 'Talep gönder'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
