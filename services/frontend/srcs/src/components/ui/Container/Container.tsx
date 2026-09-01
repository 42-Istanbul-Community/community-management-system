import type { ContainerProps } from './Container.types'
import { cn } from '@/lib'

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-300 px-8', className)}>
      {children}
    </div>
  )
}
