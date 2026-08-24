import type { AvatarProps, AvatarSize } from './Avatar.types'
import { cn } from '@/lib/cn/cn'

const sizes: Record<AvatarSize, string> = {
  sm: 'h-11 w-11 rounded-[14px] text-[15px]',
  md: 'h-15 w-15 rounded-[18px] text-[17px]',
  lg: 'h-20 w-20 rounded-[22px] text-[20px]',
}

export function Avatar({ initials, size = 'sm', className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center',
        'bg-primary-100 font-display text-primary-700 font-bold',
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  )
}
