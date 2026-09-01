import type { TagProps } from './Tag.types'
import { cn } from '@/lib'

export function Tag({ children, className, isActive, onClick }: TagProps) {
  const base = cn(
    'inline-flex items-center whitespace-nowrap rounded-full text-tag px-2.5 py-1 font-medium leading-[1.4]',
    className,
  )

  if (!onClick) {
    return (
      <span className={cn(base, 'bg-neutral-100 text-neutral-700')}>
        {children}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        base,
        'cursor-pointer transition-colors',
        isActive
          ? 'bg-primary-600 hover:bg-primary-700 text-white'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
      )}
    >
      {children}
    </button>
  )
}
