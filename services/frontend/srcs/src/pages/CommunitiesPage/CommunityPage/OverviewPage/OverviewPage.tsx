import { EmptyState } from '@/components/ui'
import { LayoutGrid } from 'lucide-react'

export default function CommunityOverviewPage() {
  return (
    <EmptyState
      icon={<LayoutGrid size={22} aria-hidden="true" />}
      title="Bir bölüm seçin"
      description="Kulübün duyurularını, etkinliklerini ve üyelerini görmek için yukarıdaki sekmelerden birine tıklayın."
    />
  )
}
