import { useOutletContext } from 'react-router'

import type { Community } from '@/features/communities/api'

export type CommunityOutletContext = {
  club: Community
}

export function useCommunityContext() {
  return useOutletContext<CommunityOutletContext>()
}
