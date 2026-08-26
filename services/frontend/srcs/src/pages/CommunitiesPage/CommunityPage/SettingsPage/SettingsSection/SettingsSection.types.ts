import type { ReactNode } from 'react'

export type SettingsSectionProps = {
  title: string
  description?: string
  tone?: 'default' | 'danger'
  children: ReactNode
}
