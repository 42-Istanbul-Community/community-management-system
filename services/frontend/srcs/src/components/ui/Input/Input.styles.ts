import { cn } from '@/lib/cn'

const base =
  'w-full rounded-md border bg-white px-3.5 py-2.5 text-body text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 '

const states = {
  default: 'border-neutral-300 hover:border-neutral-400',
  error: 'border-danger',
}

export function inputStyles(hasError?: boolean, classname?: string) {
  return cn(base, hasError ? states.error : states.default, classname)
}
