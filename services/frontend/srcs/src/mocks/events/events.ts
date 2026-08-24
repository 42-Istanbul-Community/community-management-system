import type { Event } from './events.types'

export const events: Event[] = [
  {
    id: 'e1',
    communitySlug: 'fotografcilik',
    title: 'Gece yürüyüşü: Karaköy',
    description:
      'Uzun pozlama denemeleri için sahil hattında yürüyüş.\n\nTripod getirmeniz gerekiyor, kulüpte üç tane var ama yeterli olmayabilir. Işık kirliliğinin az olduğu noktalarda duracağız.\n\nYürüyüş yaklaşık üç saat sürecek, rahat ayakkabı önerilir.',
    startAt: '2026-09-14T18:00:00Z',
    endAt: '2026-09-14T21:00:00Z',
    location: 'Karaköy Meydanı, buluşma noktası saat kulesi',
    capacity: 25,
    participantCount: 18,
    attachments: [
      {
        id: 'ev-at1',
        name: 'rota.jpg',
        url: 'https://placehold.co/800x600/f4cfb8/964022?text=Rota',
        kind: 'image',
        size: 645120,
        mimeType: 'image/jpeg',
      },
    ],
  },
  {
    id: 'e2',
    communitySlug: 'fotografcilik',
    title: 'Portre atölyesi',
    description:
      'Stüdyo ışığıyla portre çekimi. Model kulüp tarafından sağlanıyor.\n\nÜç farklı ışık düzeni kuracağız ve herkes sırayla deneyecek.',
    startAt: '2026-09-21T15:00:00Z',
    endAt: '2026-09-21T18:00:00Z',
    location: 'Kampüs stüdyosu, B blok zemin kat',
    capacity: 12,
    participantCount: 12,
    attachments: [],
  },
  {
    id: 'e3',
    communitySlug: 'fotografcilik',
    title: 'Açık mikrofon: fotoğraf okuma',
    description:
      'Getirdiğiniz bir kareyi anlatın, birlikte konuşalım.\n\nHerkes en fazla beş dakika konuşacak. Fotoğrafı basılı getirin ya da USB ile gelin.',
    startAt: '2026-10-02T17:30:00Z',
    endAt: null,
    location: null,
    capacity: null,
    participantCount: 9,
    attachments: [],
  },
]
