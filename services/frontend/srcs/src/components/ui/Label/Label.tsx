import type { LabelProps } from './Label.types'
import { cn } from '@/lib/cn'

export function Label({
  children,
  isOptional,
  className,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn('text-caption font-medium text-neutral-900', className)}
      {...props}
    >
      {children}
      {isOptional && (
        <span className="ms-1.5 font-normal text-neutral-500">
          (isteğe bağlı)
        </span>
      )}
    </label>
  )
}
