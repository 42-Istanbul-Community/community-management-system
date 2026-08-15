import type { ProgressBarProps } from './ProgressBar.types'

export function ProgressBar({
  value,
  max,
  label,
  className,
}: ProgressBarProps) {
  const percentage =
    max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-1.5 overflow-hidden rounded-full bg-neutral-100"
      >
        <span
          className="bg-primary-600 block h-full rounded-full transition-[width] duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {label && <p className="mt-1.75 text-[12px] text-neutral-500">{label}</p>}
    </div>
  )
}
