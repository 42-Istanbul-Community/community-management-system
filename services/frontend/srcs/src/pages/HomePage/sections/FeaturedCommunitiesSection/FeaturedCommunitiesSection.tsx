import { Link } from 'react-router'

import { CommunityCard, Container, SectionHeading } from '@/components/ui'
import { useCommunities } from '@/features/communities/hooks'
import { paths } from '@/routes/paths/paths'
import { ArrowRight } from 'lucide-react'

export function FeaturedCommunitiesSection() {
  const { data: communities } = useCommunities()
  const featuredCommunities = communities?.slice(0, 6) ?? []

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Keşfet"
          title="Öne çıkan kulüpler"
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCommunities.map((community) => (
            <CommunityCard key={community.slug} {...community} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to={paths.communities.root}
            className="group text-body text-primary-700 hover:text-primary-800 inline-flex items-center gap-2 font-medium transition-colors"
          >
            Tüm kulüpleri keşfet
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Container>
    </section>
  )
}
