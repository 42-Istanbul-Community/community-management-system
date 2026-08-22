import { useParams } from 'react-router'

import { Container } from '@/components/ui'
import { useDocumentTitle } from '@/hooks'

export default function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  useDocumentTitle(slug ?? 'Kulüp')
  return (
    <Container className="py-14">
      <h1 className="font-display text-h2 font-semibold tracking-tight">
        {slug}
      </h1>
    </Container>
  )
}
