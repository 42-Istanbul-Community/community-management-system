import { deleteAnnouncement } from '@/features/content/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * DELETE /content/announcements/:id
 * Removes an announcement and refreshes the community's list.
 */
export function useDeleteAnnouncement(communityId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', communityId] })
    },
  })
}
