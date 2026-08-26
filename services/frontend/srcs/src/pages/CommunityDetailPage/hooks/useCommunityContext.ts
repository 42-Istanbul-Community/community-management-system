import { useOutletContext } from 'react-router'

import type { CommunityOutletContext } from '../CommunityLayout/CommunityLayout.types'

export function useCommunityContext() {
  return useOutletContext<CommunityOutletContext>()
}
