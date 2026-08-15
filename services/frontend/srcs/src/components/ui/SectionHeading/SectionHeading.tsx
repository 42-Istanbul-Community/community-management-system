import type { SectionHeadingProps } from './SectionHeading.types'
import { cn } from '@/lib/cn'

export function SectionHeading({ eyebrow, title, className }: SectionHeadingProps) {
  return (
    <div className={cn('mx-auto max-w-160 text-center', className)}>
      {eyebrow && (
        <div className="mb-4 flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-primary-300" />
          <span className="text-caption font-medium uppercase tracking-[0.14em] text-primary-700">
            {eyebrow}
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-primary-300" />
        </div>
      )}

      <h2 className="font-display text-[42px] font-semibold leading-[1.12] tracking-tight">
        {title}
      </h2>

      <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-1.5">
        <span className="h-0.75 w-1.5 rounded-full bg-primary-200" />
        <span className="h-0.75 w-3 rounded-full bg-primary-300" />
        <span className="h-0.75 w-10 rounded-full bg-primary-600" />
        <span className="h-0.75 w-3 rounded-full bg-primary-300" />
        <span className="h-0.75 w-1.5 rounded-full bg-primary-200" />
      </div>
    </div>
  )
}