import type { Application, ApplicationStatus } from '@/mocks'

export type ApplicationCardProps = {
  application: Application
  onDecide: (id: string, status: ApplicationStatus) => void
}
