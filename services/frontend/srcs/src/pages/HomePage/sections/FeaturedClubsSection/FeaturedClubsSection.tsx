import { Link } from 'react-router'

import { ClubCard, Container, SectionHeading } from '@/components/ui'
import { clubs } from '@/mocks'
import { paths } from '@/routes/paths/paths'
import { ArrowRight } from 'lucide-react'

const featuredClubs = clubs.slice(0, 6)

export function FeaturedClubsSection() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Keşfet"
          title="Öne çıkan kulüpler"
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredClubs.map((club) => (
            <ClubCard key={club.slug} {...club} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to={paths.communities}
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
