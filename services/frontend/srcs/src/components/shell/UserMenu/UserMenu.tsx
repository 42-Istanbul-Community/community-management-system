import { useNavigate } from 'react-router'

import { Avatar } from '@/components/ui'
import { useMe } from '@/features/auth/hooks'
import { assetUrl, getInitials } from '@/lib'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOut, User } from 'lucide-react'

export function UserMenu() {
  const navigate = useNavigate()
  const clear = useAuthStore((state) => state.clear)
  const { data: me } = useMe()

  const name = me?.name ?? ''

  function handleLogout() {
    clear()
    navigate(paths.home)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Hesap menüsü"
        className="cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
      >
        <Avatar
          initials={getInitials(name)}
          src={assetUrl(me?.picture)}
          name={name}
          size="sm"
          className="h-10 w-10 rounded-md text-[13px]"
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        sideOffset={6}
        className="z-50 min-w-48 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-md"
      >
        {name && (
          <div className="border-b border-neutral-100 px-3.5 py-2.5">
            <p className="text-caption font-medium text-neutral-900">{name}</p>
          </div>
        )}

        <DropdownMenu.Item
          onSelect={() => navigate(paths.me.root)}
          className="text-caption flex cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-neutral-900 outline-none data-highlighted:bg-neutral-100"
        >
          <User size={14} aria-hidden="true" />
          Profilim
        </DropdownMenu.Item>

        <DropdownMenu.Item
          onSelect={handleLogout}
          className="text-caption text-danger flex cursor-pointer items-center gap-2.5 px-3.5 py-2.5 outline-none data-highlighted:bg-neutral-100"
        >
          <LogOut size={14} aria-hidden="true" />
          Çıkış yap
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
