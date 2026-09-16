import { useMemo, useState } from 'react'

import type { BadgeTone } from '@/components/ui'
import { Avatar, Badge, EmptyState, SearchInput } from '@/components/ui'
import { useUsers } from '@/features/auth/hooks'
import type { CommunityMemberRole } from '@/features/communities/api'
import { useCommunityContext } from '@/features/communities/hooks'
import { useCommunityMembers } from '@/features/membership/hooks'
import { assetUrl, getInitials } from '@/lib'
import { useAuthStore } from '@/stores'
import { Users } from 'lucide-react'

const roleLabels: Record<CommunityMemberRole, string> = {
  admin: 'Yönetici',
  moderator: 'Moderatör',
  member: 'Üye',
}

const roleTones: Record<CommunityMemberRole, BadgeTone> = {
  admin: 'accent',
  moderator: 'info',
  member: 'neutral',
}

const roleOrder: Record<CommunityMemberRole, number> = {
  admin: 0,
  moderator: 1,
  member: 2,
}

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function MembersPage() {
  const { community } = useCommunityContext()
  const [query, setQuery] = useState('')

  const viewerId = useAuthStore((state) => state.user?.id)
  const viewerRole = useAuthStore((state) => state.user?.role)

  const { data: members, isPending } = useCommunityMembers(community.id)

  const userIds = useMemo(
    () => members?.map((member) => member.user_id) ?? [],
    [members],
  )

  const { data: users } = useUsers(userIds)
  const isViewerSuperAdmin = viewerRole === 'super_admin'

  const sorted = useMemo(() => {
    if (!members) return []

    const orderOf = (member: (typeof members)[number]) =>
      isViewerSuperAdmin && member.user_id === viewerId
        ? -1
        : roleOrder[member.role]

    return [...members].sort((a, b) => {
      const orderDiff = orderOf(a) - orderOf(b)
      if (orderDiff !== 0) return orderDiff

      const nameA = users?.[a.user_id]?.name ?? ''
      const nameB = users?.[b.user_id]?.name ?? ''
      return nameA.localeCompare(nameB, 'tr')
    })
  }, [members, users, viewerId, isViewerSuperAdmin])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr')
    if (!normalized) return sorted

    return sorted.filter((member) =>
      (users?.[member.user_id]?.name ?? '')
        .toLocaleLowerCase('tr')
        .includes(normalized),
    )
  }, [sorted, users, query])

  if (isPending) {
    return <p className="text-body text-neutral-600">Yükleniyor...</p>
  }

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={<Users size={22} aria-hidden="true" />}
        title="Henüz üye yok"
        description="Kulübe katılan üyeler burada listelenecek."
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-caption text-neutral-500">{sorted.length} üye</p>

        <div className="w-full max-w-72">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            placeholder="Üye ara"
            aria-label="Üye ara"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-body py-6 text-center text-neutral-600">
          “{query}” ile eşleşen üye bulunamadı.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200 bg-white">
          {filtered.map((member) => {
            const user = users?.[member.user_id]
            const name = user?.name ?? 'Üye'

            return (
              <li
                key={member.id}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <Avatar
                  initials={getInitials(name)}
                  src={assetUrl(user?.picture)}
                  name={name}
                  size="sm"
                  className="h-10 w-10 text-[13px]"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-body font-medium text-neutral-900">
                    {name}
                  </p>
                  <p className="text-caption text-neutral-500">
                    {dateFormatter.format(new Date(member.joined_at))} tarihinde
                    katıldı
                  </p>
                </div>

                {isViewerSuperAdmin && member.user_id === viewerId ? (
                  <Badge tone="danger">Süper Admin</Badge>
                ) : (
                  <Badge tone={roleTones[member.role]}>
                    {roleLabels[member.role]}
                  </Badge>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
