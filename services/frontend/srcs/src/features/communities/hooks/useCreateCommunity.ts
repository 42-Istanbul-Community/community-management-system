import { createCommunity } from '@/features/communities/api'
import { useMutation } from '@tanstack/react-query'

export function useCreateCommunity() {
  return useMutation({ mutationFn: createCommunity })
}
