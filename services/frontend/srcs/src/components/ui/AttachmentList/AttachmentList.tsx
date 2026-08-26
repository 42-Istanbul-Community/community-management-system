import type { AttachmentListProps } from './AttachmentList.types'
import { formatFileSize } from '@/lib'
import { Download, FileText } from 'lucide-react'

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) return null

  const images = attachments.filter((item) => item.kind === 'image')
  const files = attachments.filter((item) => item.kind === 'file')

  return (
    <section aria-labelledby="attachments-heading" className="mt-8">
      <h2
        id="attachments-heading"
        className="text-caption font-semibold text-neutral-800"
      >
        Ekler
      </h2>

      {images.length > 0 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {images.map((image) => (
            <a
              key={image.id}
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:border-primary-600 block overflow-hidden rounded-lg border border-neutral-200 transition-colors"
            >
              <img
                src={image.url}
                alt={image.name}
                loading="lazy"
                className="aspect-4/3 w-full object-cover"
              />
            </a>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file) => (
            <li key={file.id}>
              <a
                href={file.url}
                download
                className="hover:border-primary-600 group transition-colors flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-3.5 py-3"
              >
                <FileText
                  size={18}
                  className="shrink-0 text-neutral-500"
                  aria-hidden="true"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-body truncate font-medium text-neutral-900">
                    {file.name}
                  </p>
                  <p className="text-[12px] text-neutral-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <Download
                  size={16}
                  className="group-hover:text-primary-700 shrink-0 text-neutral-400 transition-colors"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
