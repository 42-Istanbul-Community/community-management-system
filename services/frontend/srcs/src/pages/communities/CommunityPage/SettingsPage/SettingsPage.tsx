import type { FormEventHandler } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { SettingsSection } from './SettingsSection'
import {
  Alert,
  Avatar,
  Button,
  Forbidden,
  FormField,
  Input,
  Select,
  Tag,
} from '@/components/ui'
import type {
  ApiCommunityAccess,
  ApiCommunityStatus,
  ApiCommunityVisibility,
} from '@/features/communities/api'
import {
  useCommunities,
  useCommunityContext,
  useCommunityPermissions,
  useDeleteCommunity,
  useUpdateCommunity,
} from '@/features/communities/hooks'
import { assetUrl } from '@/lib'
import { Plus, Upload, X } from 'lucide-react'

const MAX_TAGS = 3
const MAX_FILE_SIZE = 1024 * 1024

const accessOptions = [
  { value: 'open', label: 'Açık — herkes katılabilir' },
  { value: 'restricted', label: 'Kısıtlı — başvuru onayı gerekir' },
  { value: 'closed', label: 'Kapalı — yeni üye alınmıyor' },
]

const visibilityOptions = [
  { value: 'public', label: 'Herkese açık' },
  { value: 'private', label: 'Gizli — sadece üyeler görebilir' },
]

const statusOptions = [
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Pasif — kulüp listelerde görünmez' },
]

const textareaClass =
  'w-full resize-y rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-body text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 hover:border-neutral-400'

export function SettingsPage() {
  const { community } = useCommunityContext()

  const { canAdmin, isPending: isRolePending } = useCommunityPermissions(
    community.id,
  )

  const update = useUpdateCommunity(community.slug)
  const remove = useDeleteCommunity(community.slug)
  const { data: communities } = useCommunities()

  const [name, setName] = useState(community.name)
  const [description, setDescription] = useState(community.description)
  const [tags, setTags] = useState<string[]>(community.tags)
  const [tagInput, setTagInput] = useState('')
  const [access, setAccess] = useState<ApiCommunityAccess>(community.access)
  const [visibility, setVisibility] = useState<ApiCommunityVisibility>(
    community.visibility,
  )
  const [status, setStatus] = useState<ApiCommunityStatus>(community.status)

  const [picture, setPicture] = useState<File | null>(null)
  const [background, setBackground] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const pictureRef = useRef<HTMLInputElement>(null)
  const backgroundRef = useRef<HTMLInputElement>(null)

  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const picturePreview = useMemo(
    () => (picture ? URL.createObjectURL(picture) : null),
    [picture],
  )

  const backgroundPreview = useMemo(
    () => (background ? URL.createObjectURL(background) : null),
    [background],
  )

  useEffect(() => {
    return () => {
      if (picturePreview) URL.revokeObjectURL(picturePreview)
      if (backgroundPreview) URL.revokeObjectURL(backgroundPreview)
    }
  }, [picturePreview, backgroundPreview])

  const suggestedTags = useMemo(
    () =>
      [...new Set(communities?.flatMap((item) => item.tags) ?? [])].sort(
        (a, b) => a.localeCompare(b, 'tr'),
      ),
    [communities],
  )

  const isDirty =
    name !== community.name ||
    description !== community.description ||
    tags.join(',') !== community.tags.join(',') ||
    access !== community.access ||
    visibility !== community.visibility ||
    status !== community.status ||
    picture !== null ||
    background !== null

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

  function pickFile(
    file: File | null,
    setter: (value: File | null) => void,
    input: HTMLInputElement,
  ) {
    if (file && file.size > MAX_FILE_SIZE) {
      setFileError('Görsel en fazla 1 MB olabilir.')
      setter(null)
      input.value = ''
      return
    }

    setFileError(null)
    setter(file)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!isDirty) return

    update.mutate({
      name: name !== community.name ? name : undefined,
      description:
        description !== community.description ? description : undefined,
      tags: tags.join(',') !== community.tags.join(',') ? tags : undefined,
      access: access !== community.access ? access : undefined,
      visibility: visibility !== community.visibility ? visibility : undefined,
      status: status !== community.status ? status : undefined,
      picture: picture ?? undefined,
      backgroundPicture: background ?? undefined,
    })
  }

  if (isRolePending) {
    return <p className="text-body text-neutral-600">Yükleniyor...</p>
  }

  if (!canAdmin) {
    return <Forbidden />
  }

  const backgroundSrc =
    backgroundPreview ?? assetUrl(community.backgroundPicture)

  return (
    <div className="flex flex-col gap-6">
      {update.isSuccess && !isDirty && (
        <Alert tone="success">Değişiklikler kaydedildi.</Alert>
      )}

      {fileError && <Alert tone="danger">{fileError}</Alert>}
      {update.error && <Alert tone="danger">{update.error.message}</Alert>}
      {remove.error && <Alert tone="danger">{remove.error.message}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <SettingsSection
          title="Görseller"
          description="Kulüp avatarı ve kapak görseli."
        >
          <div className="flex max-w-140 flex-col gap-6">
            <div className="flex items-center gap-5">
              <Avatar
                initials={community.initials}
                src={picturePreview ?? assetUrl(community.picture)}
                name={community.name}
                size="lg"
              />

              <div>
                <p className="text-body font-medium text-neutral-900">
                  Kulüp avatarı
                </p>
                <p className="text-caption mt-1 text-neutral-600">
                  Kare bir görsel en iyi sonucu verir, en fazla 1 MB.
                </p>

                <input
                  ref={pictureRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    pickFile(
                      event.target.files?.[0] ?? null,
                      setPicture,
                      event.target,
                    )
                  }
                  className="hidden"
                />

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => pictureRef.current?.click()}
                  >
                    <Upload size={15} aria-hidden="true" />
                    Görsel seç
                  </Button>

                  {picture && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPicture(null)
                        if (pictureRef.current) pictureRef.current.value = ''
                      }}
                    >
                      Kaldır
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-6">
              <p className="text-body font-medium text-neutral-900">
                Kapak görseli
              </p>
              <p className="text-caption mt-1 text-neutral-600">
                Kulüp sayfasının üst kısmında görünür, en fazla 1 MB.
              </p>

              <div
                aria-hidden="true"
                className="bg-primary-200 mt-3 h-28 w-full overflow-hidden rounded-md"
              >
                {backgroundSrc && (
                  <img
                    src={backgroundSrc}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <input
                ref={backgroundRef}
                type="file"
                accept="image/*"
                onChange={(event) =>
                  pickFile(
                    event.target.files?.[0] ?? null,
                    setBackground,
                    event.target,
                  )
                }
                className="hidden"
              />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => backgroundRef.current?.click()}
                >
                  <Upload size={15} aria-hidden="true" />
                  Görsel seç
                </Button>

                {background && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setBackground(null)
                      if (backgroundRef.current)
                        backgroundRef.current.value = ''
                    }}
                  >
                    Kaldır
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Genel bilgiler"
          description="Kulübün listelerde ve kulüp sayfasında nasıl göründüğünü belirler."
        >
          <div className="flex max-w-140 flex-col gap-5">
            <FormField id="community-name" label="Kulüp adı">
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
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
                <div className="flex flex-col gap-3">
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
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
                  )}

                  {suggestedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 pt-3">
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
                  )}

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
                    className="text-caption text-neutral-500"
                  >
                    {tags.length} / {MAX_TAGS} etiket seçildi.
                  </p>
                </div>
              )}
            </FormField>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Katılım ve görünürlük"
          description="Kulübün kimlere açık olduğunu ve yeni üyelerin nasıl katılabileceğini belirler."
        >
          <div className="flex max-w-140 flex-col gap-5">
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

            <FormField id="community-status" label="Durum">
              {() => (
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as ApiCommunityStatus)
                  }
                  options={statusOptions}
                  ariaLabel="Kulüp durumu"
                />
              )}
            </FormField>
          </div>
        </SettingsSection>

        <div className="flex justify-end">
          <Button type="submit" disabled={!isDirty || update.isPending}>
            {update.isPending ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}
          </Button>
        </div>
      </form>

      <SettingsSection
        title="Tehlikeli işlemler"
        description="Bu işlemler geri alınamaz."
        tone="danger"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-body font-medium text-neutral-900">Kulübü sil</p>
            <p className="text-caption mt-1 text-neutral-600">
              Tüm duyurular, etkinlikler ve üyelikler kalıcı olarak silinir.
            </p>
          </div>

          {confirmingDelete ? (
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                disabled={remove.isPending}
                onClick={() => remove.mutate()}
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
              Kulübü sil
            </Button>
          )}
        </div>
      </SettingsSection>
    </div>
  )
}
