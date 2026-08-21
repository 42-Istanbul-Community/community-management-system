import type { AlertProps, AlertTone } from './Alert.types'
import { cn } from '@/lib'

const tones: Record<AlertTone, string> = {
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
}

export function Alert({ children, tone = 'danger', className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'text-caption rounded-md px-3.5 py-3',
        tones[tone],
        className,
      )}
    >
      {children}
    </div>
  )
}
