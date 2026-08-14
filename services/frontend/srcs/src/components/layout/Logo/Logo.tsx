import { Link } from 'react-router'

import type { LogoProps } from './Logo.types'
import { cn } from '@/lib/cn'
import { paths } from '@/routes/paths'

export function Logo({ className }: LogoProps) {
  return (
    <Link
      to={paths.home}
      className={cn(
        'font-display shrink-0 text-[24px] font-bold tracking-tight text-neutral-900',
        className,
      )}
    >
      cms<span className="text-primary-600">.</span>
    </Link>
  )
}
