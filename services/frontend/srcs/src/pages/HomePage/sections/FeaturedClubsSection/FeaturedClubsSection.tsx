import { Link } from 'react-router'

import { ClubCard, Container } from '@/components/ui'
import type { ClubCardProps } from '@/components/ui/ClubCard'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { paths } from '@/routes/paths'
import { ArrowRight } from 'lucide-react'

const clubs: ClubCardProps[] = [
  {
    name: 'Fotoğrafçılık Kulübü',
    slug: 'fotografcilik-kulubu',
    initials: 'FK',
    description:
      'Haftalık atölyeler, şehir yürüyüşleri ve karanlık oda seansları.',
    tags: ['sanat', 'açık hava'],
    memberCount: '248',
    access: 'open',
  },
  {
    name: 'Algoritma Topluluğu',
    slug: 'algoritma-toplulugu',
    initials: 'AT',
    description: 'Yarışma hazırlığı, kod okuma seansları ve mentorluk.',
    tags: ['yazılım', 'akademik', 'mentorluk'],
    memberCount: '1.204',
    access: 'restricted',
  },
  {
    name: 'Münazara Kulübü',
    slug: 'munazara-kulubu',
    initials: 'MK',
    description: 'İki haftada bir açık mikrofon ve turnuva hazırlığı.',
    tags: ['tartışma', 'iletişim'],
    memberCount: '86',
    access: 'open',
  },
  {
    name: 'Doğa Yürüyüşü Kolektifi',
    slug: 'doga-yuruyusu-kolektifi',
    initials: 'DY',
    description: 'Hafta sonu rotaları ve kamp organizasyonları.',
    tags: ['açık hava', 'spor'],
    memberCount: '73',
    access: 'open',
  },
  {
    name: 'Sinema Topluluğu',
    slug: 'sinema-toplulugu',
    initials: 'ST',
    description: 'Perşembe gösterimleri ve kısa film çekim atölyesi.',
    tags: ['film', 'kültür'],
    memberCount: '159',
    access: 'restricted',
  },
  {
    name: 'Mezunlar Ağı',
    slug: 'mezunlar-agi',
    initials: 'MA',
    description: 'Kariyer sohbetleri ve staj yönlendirmeleri.',
    tags: ['kariyer', 'ağ'],
    memberCount: '512',
    access: 'closed',
  },
]

export function FeaturedClubsSection() {
  return (
    <section id="discover" className="scroll-mt-4 py-24">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Keşfet"
            title="Öne çıkan kulüpler"
            className="mb-12"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
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
              className="-ml-1 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Container>
    </section>
  )
}
