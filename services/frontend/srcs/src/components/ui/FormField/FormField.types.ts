import type { ReactNode } from 'react'

export type FormFieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
  isOptional?: boolean
  children: (fieldProps: {
    id: string
    'aria-invalid': boolean
    'aria-describedby': string | undefined
  }) => ReactNode
}
