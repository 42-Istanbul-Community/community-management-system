import { useOutletContext } from 'react-router'

import type { CommunityOutletContext } from './useCommunityContext.types'

export function useCommunityContext() {
  return useOutletContext<CommunityOutletContext>()
}
