import type { Event } from './events.types'

export const events: Event[] = [
  {
    id: 'e1',
    communitySlug: 'fotografcilik',
    title: 'Gece yürüyüşü: Karaköy',
    description: 'Uzun pozlama denemeleri için sahil hattında yürüyüş.',
    startAt: '2026-09-14T18:00:00Z',
    capacity: 25,
    participantCount: 18,
  },
  {
    id: 'e2',
    communitySlug: 'fotografcilik',
    title: 'Portre atölyesi',
    description:
      'Stüdyo ışığıyla portre çekimi. Model kulüp tarafından sağlanıyor.',
    startAt: '2026-09-21T15:00:00Z',
    capacity: 12,
    participantCount: 12,
  },
  {
    id: 'e3',
    communitySlug: 'fotografcilik',
    title: 'Açık mikrofon: fotoğraf okuma',
    description: 'Getirdiğiniz bir kareyi anlatın, birlikte konuşalım.',
    startAt: '2026-10-02T17:30:00Z',
    capacity: null,
    participantCount: 9,
  },
]
