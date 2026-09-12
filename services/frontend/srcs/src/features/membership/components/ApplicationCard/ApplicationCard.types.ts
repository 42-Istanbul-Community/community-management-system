import type { MembershipRequest } from '@/features/membership/api'

export type ApplicationCardProps = {
  request: MembershipRequest
  applicantName: string
  applicantPicture?: string | null
  onDecide: (id: string, status: 'approved' | 'rejected') => void
  isBusy?: boolean
}
