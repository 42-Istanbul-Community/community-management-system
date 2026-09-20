import { Link } from 'react-router'

import type { JoinButtonProps } from './JoinButton.types'
import { Alert, Button, buttonStyles } from '@/components/ui'
import {
  useJoinCommunity,
  useLeaveCommunity,
  useMyCommunities,
  useMyJoinRequests,
  useMyRole,
} from '@/features/membership/hooks'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'

export function JoinButton({
  communityId,
  communitySlug,
  access,
}: JoinButtonProps) {
  const token = useAuthStore((state) => state.token)
  const { data: myCommunities, isLoading: isCommunitiesLoading } =
    useMyCommunities()
  const { data: myRequests, isLoading: isRequestsLoading } = useMyJoinRequests()
  const { data: myRole, isLoading: isRoleLoading } = useMyRole(communityId)

  const join = useJoinCommunity(communitySlug)
  const leave = useLeaveCommunity(communitySlug)
  const error = join.error ?? leave.error

  const isMember = myCommunities?.some((item) => item.id === communityId)

  const hasPendingRequest = myRequests?.some(
    (request) =>
      request.community_id === communityId && request.status === 'pending',
  )

  function renderButton() {
    if (!token) {
      return (
        <Link
          to={paths.login}
          className={buttonStyles({ className: 'w-full sm:w-auto' })}
        >
          Katılmak için giriş yapın
        </Link>
      )
    }

    if (isCommunitiesLoading || isRequestsLoading) {
      return (
        <Button key="loading" disabled className="w-full sm:w-auto">
          Yükleniyor…
        </Button>
      )
    }

    if (isMember) {
      const isAdmin = myRole === 'admin'

      return (
        <Button
          variant="secondary"
          className="w-full sm:w-auto"
          disabled={leave.isPending || isAdmin || isRoleLoading}
          title={isAdmin ? 'Kulüp yöneticisi kulüpten ayrılamaz' : undefined}
          onClick={() => leave.mutate(communityId)}
        >
          {leave.isPending ? 'Ayrılıyor…' : 'Ayrıl'}
        </Button>
      )
    }

    if (hasPendingRequest || (join.isSuccess && access === 'restricted')) {
      return (
        <Button disabled className="w-full sm:w-auto">
          Başvurunuz bekliyor
        </Button>
      )
    }

    if (access === 'closed') {
      return (
        <Button disabled className="w-full sm:w-auto">
          Katılıma kapalı
        </Button>
      )
    }

    return (
      <Button
        className="w-full sm:w-auto"
        disabled={join.isPending}
        onClick={() => join.mutate({ communityId })}
      >
        {join.isPending
          ? 'Gönderiliyor…'
          : access === 'open'
            ? 'Katıl'
            : 'Başvur'}
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {renderButton()}
      {error && <Alert tone="danger">{error.message}</Alert>}
    </div>
  )
}
