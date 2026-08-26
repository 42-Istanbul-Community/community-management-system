import type { FormEvent } from 'react'
import { useState } from 'react'

import { SettingsSection } from './SettingsSection'
import { Alert, Button, FormField, Input, Select } from '@/components/ui'
import { useCommunityContext } from '@/features/communities'
import type { ClubAccess } from '@/mocks'

const accessOptions = [
  {
    value: 'open',
    label: 'Açık — herkes katılabilir',
  },
  {
    value: 'restricted',
    label: 'Kısıtlı — başvuru onayı gerekir',
  },
  {
    value: 'close',
    label: 'Kapalı — yeni üye alınmıyor',
  },
]

export default function SettingsPage() {
  const { club } = useCommunityContext()

  const [name, setName] = useState(club.name)
  const [description, setDescription] = useState(club.description)
  const [tags, setTags] = useState(club.tags.join(', '))
  const [access, setAccess] = useState<ClubAccess>(club.access)
  const [saved, setSaved] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const isDirty =
    name !== club.name ||
    description !== club.description ||
    tags !== club.tags.join(', ') ||
    access !== club.access

  function change<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value)
      setSaved(false)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <div className="flex max-w-180 flex-col gap-6">
      {saved && <Alert tone="success">Değişiklikler kaydedildi.</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <SettingsSection
          title="Genel Bilgiler"
          description="Kulübün listelerde ve kulüp sayfasında nasıl göründüğünü belirler."
        >
          <div className="flex flex-col gap-5">
            <FormField id="community-name" label="Kulüp adı">
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  value={name}
                  onChange={(e) => change(setName)(e.target.value)}
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
                  onChange={(e) => change(setDescription)(e.target.value)}
                  className="text-body w-full resize-y rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 transition-colors duration-150 placeholder:text-neutral-400 hover:border-neutral-400"
                />
              )}
            </FormField>

            <FormField
              id="community-tags"
              label="Etiketler"
              hint="Virgülle ayırın. Örnek: sanat, açık hava"
              isOptional
            >
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  value={tags}
                  onChange={(e) => change(setTags)(e.target.value)}
                />
              )}
            </FormField>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Katılım"
          description="Yeni üyelerin kulübe nasıl katılabileceğini belirler."
        >
          <FormField id="community-access" label="Erişim">
            {() => (
              <Select
                value={access}
                onValueChange={(value) =>
                  change(setAccess)(value as ClubAccess)
                }
                options={accessOptions}
                ariaLabel="Erişim seviyesi"
              />
            )}
          </FormField>
        </SettingsSection>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={!isDirty}>
            Değişiklikleri kaydet
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
              <Button variant="danger" size="sm" onClick={() => null}>
                Silmeyi onayla
              </Button>{' '}
              // API, DELETE /communities/:slug
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
