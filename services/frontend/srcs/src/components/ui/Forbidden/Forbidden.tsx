import { EmptyState } from '@/components/ui'
import { Lock } from 'lucide-react'

export function Forbidden() {
  return (
    <EmptyState
      icon={<Lock size={22} aria-hidden="true" />}
      title="Bu bölüme erişiminiz yok"
      description="Bu sayfayı yalnızca kulüp yöneticileri görüntüleyebilir."
    />
  )
}
