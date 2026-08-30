import { hash, pick } from './hash'
import type { CommunityEvent } from '@/features/communities/api'

const titles = [
  'Şehir yürüyüşü',
  'Atölye çalışması',
  'Aylık buluşma',
  'Tanışma etkinliği',
  'Sunum ve tartışma gecesi',
  'Hafta sonu kampı',
]

const descriptions = [
  'Birlikte vakit geçireceğimiz açık bir etkinlik. Herkes davetli, deneyim şartı yok.',
  'Uygulamalı bir çalışma olacak. Malzemeler kulüp tarafından sağlanıyor, yerinizi ayırtmanız yeterli.',
  'Ayın gündemini konuşup önümüzdeki dönemi planlayacağız. Katılım serbest.',
]

const locations = [
  'Kampüs A Blok, 2. kat',
  'Merkez Kütüphane çalışma salonu',
  'Öğrenci Merkezi toplantı odası',
  null,
]

export function generateEvents(
  communityId: string,
  communitySlug: string,
  count = 5,
): CommunityEvent[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = hash(`${communityId}:event:${index}`)
    const daysAhead = (seed % 40) - 5
    const startAt = new Date(Date.now() + daysAhead * 86400000)
    const endAt = new Date(startAt.getTime() + 3 * 3600000)

    const capacity = 20 + (seed % 60)
    const participantCount = seed % (capacity + 1)

    return {
      id: `${communityId}-e${index}`,
      communitySlug,
      title: pick(titles, seed),
      description: pick(descriptions, seed >>> 8),
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      location: pick(locations, seed >>> 12),
      capacity,
      participantCount,
      attachments: [],
    }
  })
}
