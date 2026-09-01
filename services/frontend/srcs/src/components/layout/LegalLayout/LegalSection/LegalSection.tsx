import type { LegalSectionProps } from './LegalSection.types'

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="font-display text-h3 font-semibold">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-[16px] leading-[1.75] text-neutral-700">
        {children}
      </div>
    </section>
  )
}
