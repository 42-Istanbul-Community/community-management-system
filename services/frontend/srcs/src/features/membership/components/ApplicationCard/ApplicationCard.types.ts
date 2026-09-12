import type { ApiJoinRequest } from '@/features/membership/api'

export type ApplicationCardProps = {
  request: ApiJoinRequest
  applicantName: string
  applicantPicture?: string | null
  onDecide: (id: string, status: 'approved' | 'rejected') => void
  isBusy?: boolean
}
