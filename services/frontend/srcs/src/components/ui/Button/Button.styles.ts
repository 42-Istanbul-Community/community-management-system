import type {
  ButtonSize,
  ButtonStyleOptions,
  ButtonVariant,
} from './Button.types'
import { cn } from '@/lib/cn'

const base = [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap',
  'rounded-md font-medium transition-colors duration-150 ease-out',
  'disabled:cursor-not-allowed',
].join(' ')

const variants: Record<ButtonVariant, string> = {
  primary: [
    'bg-primary-600 text-white hover:bg-primary-700',
    'disabled:bg-neutral-100 disabled:text-neutral-400',
  ].join(' '),
  secondary: [
    'border border-neutral-300 bg-white text-neutral-900',
    'hover:border-neutral-400 hover:bg-neutral-100',
    'disabled:border-neutral-200 disabled:bg-white disabled:text-neutral-400',
  ].join(' '),
  ghost: [
    'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
    'disabled:bg-transparent disabled:text-neutral-400',
  ].join(' '),
  danger: [
    'bg-danger text-white hover:bg-danger-strong',
    'disabled:bg-danger-soft disabled:text-neutral-400',
  ].join(' '),
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
}: ButtonStyleOptions = {}) {
  return cn(base, variants[variant], sizes[size], className)
}
