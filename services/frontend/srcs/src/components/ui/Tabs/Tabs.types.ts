import type { ReactNode } from 'react'

export type TabItem = {
  value: string
  label: string
  content: ReactNode
}

export type TabsProps = {
  items: TabItem[]
  defaultValue?: string
  ariaLabel: string
}
