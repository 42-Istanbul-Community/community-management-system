import { useEffect, useMemo, useRef } from 'react'
import type { ChangeEvent } from 'react'

import { ACCEPTED_IMAGE_TYPES } from '@/features/auth/schemas'
import { Camera, X } from 'lucide-react'

type AvatarUploadProps = {
  value?: File
  onChange: (file: File | undefined) => void
  error?: string
}

export function AvatarUpload({ value, onChange, error }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const preview = useMemo(
    () => (value ? URL.createObjectURL(value) : null),
    [value],
  )

  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0])
  }

  function handleRemove() {
    onChange(undefined)
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
            className="absolute -inset-e-1 -top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700"
          >
            <X size={12} aria-hidden="true" />
          </button>
        )}
      </div>

      <div>
        <p className="text-caption font-medium text-neutral-800">
          Profil fotoğrafı
        </p>
        {error ? (
          <p role="alert" className="text-danger mt-0.5 text-[12.5px]">
            {error}
          </p>
        ) : (
          <p className="mt-0.5 text-[12.5px] text-neutral-500">
            İsteğe bağlı · JPG, PNG veya WebP · en fazla 1 MB
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
