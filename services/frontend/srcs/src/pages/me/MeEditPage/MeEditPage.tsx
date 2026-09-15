import type { FormEventHandler } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'

import {
  Alert,
  Avatar,
  Button,
  Container,
  FormField,
  Input,
  ProgressBar,
} from '@/components/ui'
import {
  useDeleteUserPictures,
  useMe,
  useUpdateUser,
} from '@/features/auth/hooks'
import { useDocumentTitle } from '@/hooks'
import { assetUrl, getInitials } from '@/lib'
import { paths } from '@/routes/paths'
import { ArrowLeft, Upload } from 'lucide-react'

export function MeEditPage() {
  useDocumentTitle('Profili düzenle')
  const navigate = useNavigate()

  const { data: me, isPending } = useMe()
  const {
    mutateAsync: updateUser,
    isPending: isSaving,
    error,
    uploadProgress,
  } = useUpdateUser()
  const {
    mutateAsync: deletePictures,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteUserPictures()

  const [nameInput, setNameInput] = useState<string | null>(null)
  const [picture, setPicture] = useState<File | null>(null)
  const [background, setBackground] = useState<File | null>(null)
  const [removePicture, setRemovePicture] = useState(false)
  const [removeBackground, setRemoveBackground] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const backgroundRef = useRef<HTMLInputElement>(null)

  const preview = useMemo(
    () => (picture ? URL.createObjectURL(picture) : null),
    [picture],
  )

  const backgroundPreview = useMemo(
    () => (background ? URL.createObjectURL(background) : null),
    [background],
  )

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
      if (backgroundPreview) URL.revokeObjectURL(backgroundPreview)
    }
  }, [preview, backgroundPreview])

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
  const isSaveBusy = isSaving || isDeleting
  const isDirty =
    name !== me.name ||
    picture !== null ||
    background !== null ||
    removePicture ||
    removeBackground

  const avatarSrc = preview ?? (removePicture ? null : assetUrl(me.picture))
  const backgroundSrc =
    backgroundPreview ?? (removeBackground ? null : assetUrl(me.background_picture))

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!isDirty || isSaveBusy) return

    if (name !== me.name || picture || background) {
      await updateUser({
        name: name !== me.name ? name : undefined,
        picture: picture ?? undefined,
        backgroundPicture: background ?? undefined,
      })
    }

    if (removePicture || removeBackground) {
      await deletePictures({
        picture: removePicture,
        backgroundPicture: removeBackground,
      })
    }

    navigate(paths.me.root)
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
          {error && <Alert tone="danger">{error.message}</Alert>}
          {deleteError && <Alert tone="danger">{deleteError.message}</Alert>}

          <div className="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-white p-6 sm:flex-row sm:gap-6">
            <Avatar
              initials={getInitials(name)}
              src={avatarSrc}
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
                onChange={(event) => {
                  setPicture(event.target.files?.[0] ?? null)
                  setRemovePicture(false)
                }}
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

                {picture ? (
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
                ) : removePicture ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRemovePicture(false)}
                  >
                    Geri al
                  </Button>
                ) : (
                  me.picture && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setRemovePicture(true)}
                    >
                      Kaldır
                    </Button>
                  )
                )}
              </div>

              {picture && (
                <p className="text-caption mt-2 truncate text-neutral-500">
                  {picture.name}
                </p>
              )}

              {removePicture && (
                <p className="text-caption mt-2 text-neutral-500">
                  Kaydedince kaldırılacak.
                </p>
              )}

              {uploadProgress !== null && (
                <ProgressBar
                  value={uploadProgress}
                  max={100}
                  label={`Fotoğraf yükleniyor... %${uploadProgress}`}
                  className="mt-3"
                />
              )}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <p className="text-body font-medium text-neutral-900">
              Kapak fotoğrafı
            </p>
            <p className="text-caption mt-1 text-neutral-600">
              Profilinizin üst kısmında görünür.
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
              onChange={(event) => {
                setBackground(event.target.files?.[0] ?? null)
                setRemoveBackground(false)
              }}
              className="hidden"
            />

            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => backgroundRef.current?.click()}
              >
                <Upload size={15} aria-hidden="true" />
                Görsel seç
              </Button>

              {background ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBackground(null)
                    if (backgroundRef.current) backgroundRef.current.value = ''
                  }}
                >
                  Vazgeç
                </Button>
              ) : removeBackground ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRemoveBackground(false)}
                >
                  Geri al
                </Button>
              ) : (
                me.background_picture && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRemoveBackground(true)}
                  >
                    Kaldır
                  </Button>
                )
              )}
            </div>

            {background && (
              <p className="text-caption mt-2 truncate text-neutral-500">
                {background.name}
              </p>
            )}

            {removeBackground && (
              <p className="text-caption mt-2 text-neutral-500">
                Kaydedince kaldırılacak.
              </p>
            )}
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

            <Button type="submit" disabled={!isDirty || isSaveBusy}>
              {isSaveBusy ? 'Kaydediliyor…' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
