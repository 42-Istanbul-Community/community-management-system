import type { EmptyStateProps } from './EmptyState.types'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      {icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
          {icon}
        </span>
      )}

      <h2 className="font-display text-h3 font-semibold">{title}</h2>

      {description && (
        <p className="text-body mt-2 max-w-100 text-neutral-600">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
