import { inputStyles } from './Input.styles'
import type { InputProps } from './Input.types'

export function Input({ hasError, className, ...props }: InputProps) {
  return <input className={inputStyles(hasError, className)} {...props} />
}
