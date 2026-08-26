export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export type Application = {
  id: string
  communitySlug: string
  applicantName: string
  message: string | null
  status: ApplicationStatus
  createdAt: string
}


