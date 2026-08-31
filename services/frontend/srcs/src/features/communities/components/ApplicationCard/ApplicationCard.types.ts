import type { Application, ApplicationStatus } from '@/features/communities/api'

export type ApplicationCardProps = {
  application: Application
  onDecide: (id: string, status: ApplicationStatus) => void
}
