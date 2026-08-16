import { type ChangeEvent, useRef, useState } from 'react'

import { Camera, X } from 'lucide-react'

const MAX_SIZE = 1 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function AvatarUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Yalnızca JPG, PNG veya WebP yükleyebilirsiniz.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_SIZE) {
      setError("Dosya boyutu 2 MB'ı aşamaz.")
      event.target.value = ''
      return
    }

    setError(null)
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
  }

  function handleRemove() {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Profil fotoğrafı seç"
          className="hover:border-primary-600 hover:bg-primary-50 flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-neutral-300 bg-neutral-50 transition-colors"
        >
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <Camera size={20} className="text-neutral-400" aria-hidden="true" />
          )}
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Fotoğrafı kaldır"
            className="absolute -end-1 -top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700"
          >
            <X size={12} aria-hidden="true" />
          </button>
        )}
      </div>

      <div>
        <p className="text-caption font-medium text-neutral-800">
          Profil fotoğrafı
          <span className="ml-0.5 text-[12.5px] text-neutral-500">
            (isteğe bağlı)
          </span>
        </p>
        {error ? (
          <p role="alert" className="text-danger mt-0.5 text-[12.5px]">
            {error}
          </p>
        ) : (
          <p className="mt-0.5 text-[12.5px] text-neutral-500">
            JPG, PNG veya WebP · en fazla 2 MB
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
