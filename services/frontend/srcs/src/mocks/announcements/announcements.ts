import type { Announcement } from './announcements.types'

export const announcements: Announcement[] = [
  {
    id: 'a1',
    communitySlug: 'fotografcilik',
    title: 'Bu haftaki atölye Perşembe 18.00’de',
    content:
      'Karanlık oda seansı stüdyoda yapılacak. Kendi negatiflerinizi getirebilirsiniz, kimyasallar kulüp tarafından karşılanıyor.\n\nGeçen hafta katılamayanlar için kısa bir tekrar yapacağız. Banyo süreleri ve sıcaklık ayarları üzerinde duracağız, not almak isteyenler defter getirsin.\n\nStüdyo 17.30’da açılıyor, erken gelip hazırlık yapabilirsiniz.',
    authorName: 'Elif Kaya',
    pinned: true,
    createdAt: '2026-08-18T15:00:00Z',
    attachments: [
      {
        id: 'at1',
        name: 'atolye-programi.pdf',
        url: '#',
        kind: 'file',
        size: 184320,
        mimeType: 'application/pdf',
      },
    ],
  },
  {
    id: 'a2',
    communitySlug: 'fotografcilik',
    title: 'Yeni ekipman dolabı kullanıma açıldı',
    content:
      'Stüdyonun girişindeki dolapta üç tripod ve iki reflektör bulunuyor. Kullanım için moderatörlerden birine haber vermeniz yeterli.\n\nEkipmanı aldığınız gün içinde geri getirmenizi rica ediyoruz.',
    authorName: 'Mert Aydın',
    pinned: false,
    createdAt: '2026-08-14T09:30:00Z',
    attachments: [],
  },
  {
    id: 'a3',
    communitySlug: 'fotografcilik',
    title: 'Dönem sonu sergisi için başvurular açıldı',
    content:
      'Sergilemek istediğiniz üç fotoğrafı ay sonuna kadar iletebilirsiniz. Seçim kulüp içi oylama ile yapılacak.\n\nBaskı boyutları ve çerçeve standartları ekteki dosyada. Geçen yılki sergiden birkaç kare de ekledim, fikir vermesi için.',
    authorName: 'Elif Kaya',
    pinned: false,
    createdAt: '2026-08-05T12:00:00Z',
    attachments: [
      {
        id: 'at2',
        name: 'sergi-kosullari.pdf',
        url: '#',
        kind: 'file',
        size: 96256,
        mimeType: 'application/pdf',
      },
      {
        id: 'at3',
        name: 'gecen-yil-1.jpg',
        url: 'https://placehold.co/800x600/f4cfb8/964022?text=Sergi',
        kind: 'image',
        size: 1245184,
        mimeType: 'image/jpeg',
      },
      {
        id: 'at4',
        name: 'gecen-yil-2.jpg',
        url: 'https://placehold.co/800x600/e7e5e1/46433d?text=Sergi',
        kind: 'image',
        size: 987136,
        mimeType: 'image/jpeg',
      },
    ],
  },
  {
    id: 'a4',
    communitySlug: 'fotografcilik',
    title: 'Temmuz ayı gezisi fotoğrafları arşive eklendi',
    content:
      'Kaş gezisinde çekilen fotoğraflar ortak arşive yüklendi. Kendi kadrajınızı bulamazsanız bize yazın.',
    authorName: 'Mert Aydın',
    pinned: false,
    createdAt: '2026-07-28T17:45:00Z',
    attachments: [
      {
        id: 'at5',
        name: 'kas-gezisi.jpg',
        url: 'https://placehold.co/800x600/ebb08d/652d1e?text=Kas',
        kind: 'image',
        size: 2097152,
        mimeType: 'image/jpeg',
      },
    ],
  },
]
