import { useRef, useState } from 'react'

import { Camera, X } from 'lucide-react'

export function AvatarUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
  }

  function handleRemove() {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="hover:border-primary-600 hover:bg-primary-50 flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-neutral-300 bg-neutral-50 transition-colors"
          aria-label="Profil fotoğrafı seç"
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
        </p>
        <p className="mt-0.5 text-[12.5px] text-neutral-500">
          İsteğe bağlı · JPG veya PNG, en fazla 2 MB
        </p>
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
