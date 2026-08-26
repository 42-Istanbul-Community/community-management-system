import { useOutletContext } from 'react-router'

import type { Club } from '@/mocks'

export type CommunityOutletContext = {
  club: Club
}

export function useCommunityContext() {
  return useOutletContext<CommunityOutletContext>()
}
