import type { FooterColumnProps } from '../FooterColumn/FooterColumn.types'

export function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-caption mb-4 font-semibold text-white">{title}</h2>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )
}
