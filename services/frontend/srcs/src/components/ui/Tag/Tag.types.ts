import type { ReactNode } from 'react'

export type TagProps = {
  children: ReactNode
  className?: string
  isActive?: boolean
  onClick?: () => void
}
