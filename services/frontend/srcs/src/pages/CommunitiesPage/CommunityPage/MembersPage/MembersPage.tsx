import { useMemo, useState } from 'react'

import type { BadgeTone } from '@/components/ui'
import { Avatar, Badge, EmptyState, SearchInput } from '@/components/ui'
import { getInitials } from '@/lib'
import type { Member } from '@/mocks'
import { members } from '@/mocks'
import { Users } from 'lucide-react'

const roleLabels: Record<Member['role'], string> = {
  admin: 'Yönetici',
  moderator: 'Moderatör',
  member: 'Üye',
}

const roleTones: Record<Member['role'], BadgeTone> = {
  admin: 'accent',
  moderator: 'info',
  member: 'neutral',
}

const roleOrder: Record<Member['role'], number> = {
  admin: 0,
  moderator: 1,
  member: 2,
}

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default function MembersPage() {
  const [query, setQuery] = useState('')

  const communityMembers = useMemo(
    () =>
      [...members].sort((a, b) => {
        if (a.role !== b.role) return roleOrder[a.role] - roleOrder[b.role]
        return a.name.localeCompare(b.name, 'tr')
      }),
    [],
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr')
    if (!normalized) return communityMembers
    return communityMembers.filter((member) =>
      member.name.toLocaleLowerCase('tr').includes(normalized),
    )
  }, [communityMembers, query])

  if (communityMembers.length === 0) {
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
        <p className="text-caption text-neutral-500">
          {communityMembers.length} üye
        </p>
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
          {filtered.map((member) => (
            <li key={member.id} className="flex items-center gap-3 px-4 py-3.5">
              <Avatar
                initials={getInitials(member.name)}
                size="sm"
                className="h-10 w-10 text-[13px]"
              />

              <div className="min-w-0 flex-1">
                <p className="text-body font-medium text-neutral-900">
                  {member.name}
                </p>
                <p className="text-caption text-neutral-500">
                  {dateFormatter.format(new Date(member.joinedAt))} tarihinde
                  katıldı
                </p>
              </div>

              <Badge tone={roleTones[member.role]}>
                {roleLabels[member.role]}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
