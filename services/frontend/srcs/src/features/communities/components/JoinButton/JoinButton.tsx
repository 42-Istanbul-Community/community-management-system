// import { Link } from 'react-router'
// import type { JoinButtonProps } from './JoinButton.types'
// import { Button, buttonStyles } from '@/components/ui'
// import {
//   useJoinCommunity,
//   useLeaveCommunity,
//   useMyCommunities,
// } from '@/features/communities/hooks'
// import { paths } from '@/routes/paths'
// import { useAuthStore } from '@/stores'
// export function JoinButton({ communityId, access }: JoinButtonProps) {
//   const token = useAuthStore((state) => state.token)
//   const { data: myCommunities } = useMyCommunities()
//   const join = useJoinCommunity()
//   const leave = useLeaveCommunity()
//   const isMember = myCommunities?.some((item) => item.id === communityId)
//   if (!token) {
//     return (
//       <Link
//         to={paths.login}
//         className={buttonStyles({ className: 'w-full sm:w-auto' })}
//       >
//         Katılmak için giriş yapın
//       </Link>
//     )
//   }
//   if (isMember) {
//     return (
//       <Button
//         variant="secondary"
//         className="w-full sm:w-auto"
//         disabled={leave.isPending}
//         onClick={() => leave.mutate(communityId)}
//       >
//         {leave.isPending ? 'Ayrılıyor…' : 'Ayrıl'}
//       </Button>
//     )
//   }
//   if (access === 'closed') {
//     return (
//       <Button disabled className="w-full sm:w-auto">
//         Katılıma kapalı
//       </Button>
//     )
//   }
//   if (join.isSuccess && access === 'restricted') {
//     return (
//       <Button disabled className="w-full sm:w-auto">
//         Başvurunuz alındı
//       </Button>
//     )
//   }
//   return (
//     <Button
//       className="w-full sm:w-auto"
//       disabled={join.isPending}
//       onClick={() => join.mutate({ communityId })}
//     >
//       {join.isPending
//         ? 'Gönderiliyor…'
//         : access === 'open'
//           ? 'Katıl'
//           : 'Başvur'}
//     </Button>
//   )
// }
import { Link } from 'react-router'

import type { JoinButtonProps } from './JoinButton.types'
import { Button, buttonStyles } from '@/components/ui'
import {
  useJoinCommunity,
  useLeaveCommunity,
  useMyCommunities,
  useMyRequests,
} from '@/features/communities/hooks'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'

export function JoinButton({ communityId, access }: JoinButtonProps) {
  const token = useAuthStore((state) => state.token)
  const { data: myCommunities } = useMyCommunities()
  const { data: myRequests } = useMyRequests()

  const join = useJoinCommunity()
  const leave = useLeaveCommunity()

  const isMember = myCommunities?.some((item) => item.id === communityId)

  const hasPendingRequest = myRequests?.some(
    (request) =>
      request.community_id === communityId && request.status === 'pending',
  )

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

  if (isMember) {
    return (
      <Button
        variant="secondary"
        className="w-full sm:w-auto"
        disabled={leave.isPending}
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
