import { Badge, ProgressBar } from '@/components/ui'
import { Pin } from 'lucide-react'

export function HeroPreviewCard() {
  return (
    <div className="relative w-full max-w-105">
      <span
        aria-hidden="true"
        className="bg-primary-100 absolute -inset-e-4 -top-6 h-37.5 w-37.5 rounded-full"
      />
      <span
        aria-hidden="true"
        className="absolute -inset-s-6 -bottom-7 h-24 w-24 rounded-xl bg-neutral-100"
      />

      <div className="relative rounded-[18px] border border-neutral-200 bg-white p-6 shadow-md">
        <div className="mb-5 flex items-center gap-3">
          <span className="bg-primary-100 font-display text-primary-700 flex h-11 w-11 items-center justify-center rounded-[14px] text-[15px] font-bold">
            FK
          </span>
          <div>
            <p className="text-body font-semibold">Fotoğrafçılık Kulübü</p>
            <p className="text-caption text-neutral-500">
              248 üye · 12 etkinlik
            </p>
          </div>
          <Badge tone="success" className="ms-auto">
            Açık
          </Badge>
        </div>

        <div className="mb-3 rounded-xl bg-neutral-50 p-3.5">
          <p className="text-primary-700 mb-1.5 flex items-center gap-0.5 text-[12px] font-medium">
            <Pin className="size-3 shrink-0" aria-hidden="true" />
            Sabitlenmiş duyuru
          </p>
          <p className="text-[14px] leading-[1.55]">
            Bu haftaki atölye Perşembe 18.00'da stüdyoda.
          </p>
        </div>

        <div className="rounded-md border border-neutral-200 p-3.5">
          <div className="mb-3 flex items-center gap-3">
            <div className="bg-primary-100 shrink-0 rounded-md px-2.5 py-1.75 text-center">
              <p className="font-display text-primary-700 text-[19px] leading-none font-bold">
                14
              </p>
              <p className="text-primary-700 text-[10px] font-medium">MAR</p>
            </div>
            <p className="text-[14px] font-medium">Gece yürüyüşü: Karaköy</p>
          </div>

          <ProgressBar
            value={18}
            max={25}
            label="25 kişilik kontenjanın 18'i doldu"
          />
        </div>
      </div>
    </div>
  )
}
