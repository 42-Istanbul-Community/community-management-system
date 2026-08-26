import { NavLink } from 'react-router'

import type { CommunityTabsProps } from './CommunityTabs.types'
import { cn } from '@/lib'
import { paths } from '@/routes/paths'

export function CommunityTabs({ slug }: CommunityTabsProps) {
  const tabs = [
    { to: paths.communityAnnouncements(slug), label: 'Duyurular' },
    { to: paths.communityEvents(slug), label: 'Etkinlikler' },
    { to: paths.communityMembers(slug), label: 'Üyeler' },
  ]

  return (
    <nav
      aria-label="Kulüp bölümleri"
      className="flex gap-1 border-b border-neutral-200"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              'text-body -mb-px border-b-2 px-4 py-3 font-medium transition-colors',
              isActive
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-neutral-600 hover:text-neutral-900',
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
