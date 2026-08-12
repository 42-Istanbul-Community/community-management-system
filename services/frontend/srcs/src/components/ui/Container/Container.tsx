import { cn } from '../../../lib/cn'
import type { ContainerProps } from './Container.types'

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-300 px-8', className)}>
      {children}
    </div>
  )
}
