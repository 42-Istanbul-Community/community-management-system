import { buttonStyles } from './Button.styles'
import type { ButtonProps } from './Button.types'

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props} />
  )
}
