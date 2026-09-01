export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export type Application = {
  id: string
  applicantName: string
  message: string | null
  status: ApplicationStatus
  createdAt: string
}
