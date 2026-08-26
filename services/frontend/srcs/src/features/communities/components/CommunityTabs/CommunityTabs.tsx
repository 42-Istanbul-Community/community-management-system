import { NavLink, useLocation, useNavigate } from 'react-router'

import type { CommunityTabsProps } from './CommunityTabs.types'
import { cn } from '@/lib'
import { paths } from '@/routes/paths'

export function CommunityTabs({ slug }: CommunityTabsProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const currentPath = pathname.replace(/\/+$/, '')

  const tabs = [
    { to: paths.communityAnnouncements(slug), label: 'Duyurular' },
    { to: paths.communityEvents(slug), label: 'Etkinlikler' },
    { to: paths.communityMembers(slug), label: 'Üyeler' },
    { to: paths.communityApplications(slug), label: 'Başvurular' },
  ]

  return (
    <nav
      aria-label="Kulüp bölümleri"
      className="-mx-8 flex scrollbar-none gap-1 overflow-x-auto border-b border-neutral-200 px-8 [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const isActive = currentPath === tab.to

        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            onClick={(event) => {
              if (!isActive) return
              event.preventDefault()
              navigate(paths.community(slug))
            }}
            className={cn(
              'text-body -mb-px shrink-0 border-b-2 px-4 py-3 font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-neutral-600 hover:text-neutral-900',
            )}
          >
            {tab.label}
          </NavLink>
        )
      })}
    </nav>
  )
}
