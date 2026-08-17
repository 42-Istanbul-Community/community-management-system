import type { FormFieldProps } from './FormField.types'
import { Label } from '@/components/ui/Label'

export function FormField({
  id,
  label,
  error,
  hint,
  isOptional,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const describedBy = [error && errorId, hint && hintId]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} isOptional={isOptional}>
        {label}
      </Label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy || undefined,
      })}
      {hint && !error && (
        <p id={hintId} className="text-[12.5px] text-neutral-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-danger text-[12.5px]">
          {error}
        </p>
      )}
    </div>
  )
}
