import { hash, pick } from './hash'
import type { Announcement } from '@/features/communities/api'

const titles = [
  'Bu haftaki atölye Perşembe 18.00’de',
  'Yeni dönem başvuruları açıldı',
  'Ekipman listesi güncellendi',
  'Aylık değerlendirme toplantısı',
  'Yeni üyeler için tanışma etkinliği',
  'Çalışma alanı kullanım kuralları',
]

const bodies = [
  'Bu hafta stüdyoda buluşuyoruz. Kendi malzemenizi getirebilirsiniz, temel ekipman kulüp tarafından sağlanacak.\n\nGeçen hafta katılamayanlar için kısa bir tekrar yapacağız. Erken gelip hazırlık yapmak isteyenler için salon yarım saat önce açılıyor.',
  'Başvurular ay sonuna kadar açık kalacak. Kontenjan sınırlı olduğu için erken başvurmanızı öneririz.\n\nSorularınızı toplantı saatlerinde iletebilirsiniz.',
  'Ortak kullanım ekipmanlarının listesi güncellendi. Ödünç alma süresi bir hafta ile sınırlı.\n\nTeslim ederken kısa bir kontrol formu doldurmanız gerekiyor.',
]

const authors = [
  'Elif Kaya',
  'Mert Aydın',
  'Zeynep Demir',
  'Burak Çelik',
  'Selin Koç',
]

export function generateAnnouncements(
  communityId: string,
  communitySlug: string,
  count = 5,
): Announcement[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = hash(`${communityId}:announcement:${index}`)
    const daysAgo = seed % 90

    return {
      id: `${communityId}-a${index}`,
      communitySlug,
      title: pick(titles, seed),
      content: pick(bodies, seed >>> 8),
      authorName: pick(authors, seed >>> 16),
      pinned: index === 0,
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      attachments: [],
    }
  })
}
