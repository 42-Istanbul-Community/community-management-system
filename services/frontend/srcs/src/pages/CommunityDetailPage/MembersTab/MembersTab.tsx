import { EmptyState } from '@/components/ui'
import { Users } from 'lucide-react'

export function MembersTab() {
  return (
    <EmptyState
      icon={<Users size={22} aria-hidden="true" />}
      title="Üye listesi yakında"
      description="Üyeler ve rolleri burada listelenecek."
    />
  )
}
