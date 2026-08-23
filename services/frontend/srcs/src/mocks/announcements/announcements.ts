import type { Announcement } from './announcements.types'

export const announcements: Announcement[] = [
  {
    id: 'f1',
    communitySlug: 'fotografcilik',
    title: 'Bu haftaki atölye Perşembe 18.00’de',
    content:
      'Karanlık oda seansı stüdyoda yapılacak. Kendi negatiflerinizi getirebilirsiniz, kimyasallar kulüp tarafından karşılanıyor.',
    authorName: 'Elif Kaya',
    pinned: true,
    createdAt: '2026-08-18T15:00:00Z',
  },
  {
    id: 'f2',
    communitySlug: 'fotografcilik',
    title: 'Yeni ekipman dolabı kullanıma açıldı',
    content:
      'Stüdyonun girişindeki dolapta üç tripod ve iki reflektör bulunuyor. Kullanım için moderatörlerden birine haber vermeniz yeterli.',
    authorName: 'Mert Aydın',
    pinned: false,
    createdAt: '2026-08-14T09:30:00Z',
  },
  {
    id: 'f3',
    communitySlug: 'fotografcilik',
    title: 'Dönem sonu sergisi için başvurular açıldı',
    content:
      'Sergilemek istediğiniz üç fotoğrafı ay sonuna kadar iletebilirsiniz. Seçim kulüp içi oylama ile yapılacak.',
    authorName: 'Elif Kaya',
    pinned: false,
    createdAt: '2026-08-05T12:00:00Z',
  },
  {
    id: 'f4',
    communitySlug: 'fotografcilik',
    title: 'Temmuz ayı gezisi fotoğrafları arşive eklendi',
    content:
      'Kaş gezisinde çekilen fotoğraflar ortak arşive yüklendi. Kendi kadrajınızı bulamazsanız bize yazın.',
    authorName: 'Mert Aydın',
    pinned: false,
    createdAt: '2026-07-28T17:45:00Z',
  },
]
