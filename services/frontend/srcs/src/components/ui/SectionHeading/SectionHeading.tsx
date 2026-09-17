import type { SectionHeadingProps } from './SectionHeading.types'
import { cn } from '@/lib'

export function SectionHeading({
  eyebrow,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mx-auto max-w-160 text-center', className)}>
      {eyebrow && (
        <div className="mb-4 flex items-center justify-center gap-3">
          <span aria-hidden="true" className="bg-primary-300 h-px w-8" />
          <span className="text-caption text-primary-700 font-medium tracking-[0.14em] uppercase">
            {eyebrow}
          </span>
          <span aria-hidden="true" className="bg-primary-300 h-px w-8" />
        </div>
      )}

      <h2 className="font-display text-[42px] leading-[1.12] font-semibold tracking-tight">
        {title}
      </h2>

      <div
        aria-hidden="true"
        className="mt-5 flex items-center justify-center gap-1.5"
      >
        <span className="bg-primary-200 h-0.75 w-1.5 rounded-full" />
        <span className="bg-primary-300 h-0.75 w-3 rounded-full" />
        <span className="bg-primary-600 h-0.75 w-10 rounded-full" />
        <span className="bg-primary-300 h-0.75 w-3 rounded-full" />
        <span className="bg-primary-200 h-0.75 w-1.5 rounded-full" />
      </div>
    </div>
  )
}
