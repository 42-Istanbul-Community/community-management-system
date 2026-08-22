import { useParams } from 'react-router'

import { Container } from '@/components/ui'
import { useDocumentTitle } from '@/hooks'
import { clubs } from '@/mocks'

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
      </Container>
    )
  }

  return (
    <Container className="py-14">
      <h1 className="font-display text-h2 font-semibold tracking-tight">
        {club.name}
      </h1>
    </Container>
  )
}
