import { useParams } from 'react-router'

import { AnnouncementsTab } from './AnnouncementsTab'
import { CommunityHeader } from './CommunityHeader'
import { EventsTab } from './EventsTab'
import { MembersTab } from './MembersTab'
import { Container, Tabs } from '@/components/ui'
import { useDocumentTitle } from '@/hooks'
import { announcements, clubs, events } from '@/mocks'

export default function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const club = clubs.find((item) => item.slug === slug)

  useDocumentTitle(club?.name ?? 'Kulüp bulunamadı')

  if (!club) {
    return (
      <Container className="py-14">
        <h1 className="font-display text-h2 font-semibold tracking-tight">
          Kulüp bulunamadı
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Aradığınız kulüp kaldırılmış olabilir.
        </p>
      </Container>
    )
  }

  const clubAnnouncements = announcements.filter(
    (item) => item.communitySlug === club.slug,
  )
  const clubEvents = events.filter((item) => item.communitySlug === club.slug)

  return (
    <div className="pb-20">
      <CommunityHeader club={club} />

      <Container className="mt-8">
        <p className="text-body-lg max-w-160 text-neutral-700">
          {club.description}
        </p>

        <div className="mt-10">
          <Tabs
            ariaLabel="Kulüp bölümleri"
            items={[
              {
                value: 'announcements',
                label: 'Duyurular',
                content: <AnnouncementsTab announcements={clubAnnouncements} />,
              },
              {
                value: 'events',
                label: 'Etkinlikler',
                content: <EventsTab events={clubEvents} />,
              },
              {
                value: 'members',
                label: 'Üyeler',
                content: <MembersTab />,
              },
            ]}
          />
        </div>
      </Container>
    </div>
  )
}
