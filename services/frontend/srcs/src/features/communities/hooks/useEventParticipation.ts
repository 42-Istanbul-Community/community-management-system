import { joinEvent, leaveEvent } from '@/features/communities/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useEventParticipation(communityId: string | undefined) {
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['events', communityId] })
    queryClient.invalidateQueries({ queryKey: ['event'] })
  }

  const join = useMutation({ mutationFn: joinEvent, onSuccess: invalidate })
  const leave = useMutation({ mutationFn: leaveEvent, onSuccess: invalidate })

  return { join, leave }
}
