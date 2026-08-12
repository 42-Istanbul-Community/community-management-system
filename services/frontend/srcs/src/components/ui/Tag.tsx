import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'

type TagProps = {
  children: ReactNode
  className?: string
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        'bg-neutral-100 px-2.5 py-1 text-[12.5px] leading-[1.4] font-medium text-neutral-700',
        className,
      )}
    >
      {children}
    </span>
  )
}
