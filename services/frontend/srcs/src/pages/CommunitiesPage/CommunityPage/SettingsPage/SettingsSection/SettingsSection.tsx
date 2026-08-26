import type { SettingsSectionProps } from './SettingsSection.types'
import { cn } from '@/lib'

export function SettingsSection({
  title,
  description,
  tone = 'default',
  children,
}: SettingsSectionProps) {
  const isDanger = tone === 'danger'

  return (
    <section
      className={cn(
        'rounded-lg border bg-white p-6',
        isDanger ? 'border-danger-soft' : 'border-neutral-200',
      )}
    >
      <h2
        className={cn(
          'font-display text-h3 font-semibold',
          isDanger && 'text-danger',
        )}
      >
        {title}
      </h2>

      {description && (
        <p className="text-caption mt-1.5 text-neutral-600">{description}</p>
      )}

      <div className="mt-6">{children}</div>
    </section>
  )
}
