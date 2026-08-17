import type { InputHTMLAttributes } from 'react'

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  onClear?: () => void
}
