import type { ButtonHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ' +
  'transition-colors duration-150 ease-out disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 ' +
    'disabled:bg-neutral-100 disabled:text-neutral-400',
  secondary:
    'border border-neutral-300 bg-white text-neutral-900 ' +
    'hover:border-neutral-400 hover:bg-neutral-100 ' +
    'disabled:border-neutral-200 disabled:bg-white disabled:text-neutral-400',
  ghost:
    'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 ' +
    'disabled:bg-transparent disabled:text-neutral-400',
  danger:
    'bg-danger text-white hover:bg-danger-strong ' +
    'disabled:bg-danger-soft disabled:text-neutral-400',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-caption',
  md: 'px-[18px] py-2.5 text-body',
  lg: 'px-[26px] py-3.5 text-base',
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) {
  return cn(base, variants[variant], sizes[size], className)
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props} />
  )
}
