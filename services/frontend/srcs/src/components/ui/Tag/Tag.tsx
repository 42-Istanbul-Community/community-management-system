import { cn } from '../../../lib/cn'
import type { TagProps } from './Tag.types'

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full whitespace-nowrap',
        'text-tag bg-neutral-100 px-2.5 py-1 font-medium text-neutral-700',
        className,
      )}
    >
      {children}
    </span>
  )
}
