import type { FormEventHandler } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'

import {
  Alert,
  Avatar,
  Button,
  Container,
  FormField,
  Input,
} from '@/components/ui'
import { useMe, useUpdateUser } from '@/features/auth/hooks'
import { useDocumentTitle } from '@/hooks'
import { assetUrl, getInitials } from '@/lib'
import { paths } from '@/routes/paths'
import { ArrowLeft, Upload } from 'lucide-react'

export function MeEditPage() {
  useDocumentTitle('Profili düzenle')

  const { data: me, isPending } = useMe()
  const { mutate, isPending: isSaving, isSuccess, error } = useUpdateUser()

  const [nameInput, setNameInput] = useState<string | null>(null)
  const [picture, setPicture] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const preview = useMemo(
    () => (picture ? URL.createObjectURL(picture) : null),
    [picture],
  )

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  if (isPending) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Yükleniyor...</p>
      </Container>
    )
  }

  if (!me) {
    return (
      <Container className="py-14">
        <h1 className="font-display text-h2 font-semibold tracking-tight">
          Profil yüklenemedi
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Lütfen daha sonra tekrar deneyiniz.
        </p>
      </Container>
    )
  }

  const name = nameInput ?? me.name
  const isDirty = name !== me.name || picture !== null

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!isDirty) return

    mutate({
      name: name !== me.name ? name : undefined,
      picture: picture ?? undefined,
    })
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
          Profili düzenle
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Görünen adınız ve fotoğrafınız kulüplerde bu şekilde görünür.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-7">
          {isSuccess && !isDirty && (
            <Alert tone="success">Profiliniz güncellendi.</Alert>
          )}

          {error && <Alert tone="danger">{error.message}</Alert>}

          <div className="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-white p-6 sm:flex-row sm:gap-6">
            <Avatar
              initials={getInitials(name)}
              src={preview ?? assetUrl(me.picture)}
              name={name}
              size="lg"
            />

            <div className="text-center sm:text-left">
              <p className="text-body font-medium text-neutral-900">
                Profil fotoğrafı
              </p>
              <p className="text-caption mt-1 text-neutral-600">
                Kare bir görsel en iyi sonucu verir.
              </p>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setPicture(event.target.files?.[0] ?? null)
                }
                className="hidden"
              />

              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={15} aria-hidden="true" />
                  Fotoğraf seç
                </Button>

                {picture && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPicture(null)
                      if (fileRef.current) fileRef.current.value = ''
                    }}
                  >
                    Vazgeç
                  </Button>
                )}
              </div>

              {picture && (
                <p className="text-caption mt-2 truncate text-neutral-500">
                  {picture.name}
                </p>
              )}
            </div>
          </div>

          <FormField
            id="profile-name"
            label="Görünen ad"
            hint="Kulüplerde ve duyurularda bu isim görünür."
          >
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={name}
                onChange={(event) => setNameInput(event.target.value)}
              />
            )}
          </FormField>

          <div className="flex justify-end gap-2 border-t border-neutral-200 pt-5">
            <Link to={paths.me.root}>
              <Button type="button" variant="secondary">
                Vazgeç
              </Button>
            </Link>

            <Button type="submit" disabled={!isDirty || isSaving}>
              {isSaving ? 'Kaydediliyor…' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
