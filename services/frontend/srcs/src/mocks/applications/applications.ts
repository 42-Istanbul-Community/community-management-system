import type { Application } from './applications.types'

export const applications: Application[] = [
  {
    id: 'app1',
    communitySlug: 'fotografcilik',
    applicantName: 'Hakan Er',
    message:
      'Uzun süredir analog fotoğrafçılıkla ilgileniyorum, karanlık oda seanslarına katılmak isterim.',
    status: 'pending',
    createdAt: '2026-08-20T09:30:00Z',
  },
  {
    id: 'app2',
    communitySlug: 'fotografcilik',
    applicantName: 'Melis Tan',
    message: null,
    status: 'pending',
    createdAt: '2026-08-21T14:05:00Z',
  },
  {
    id: 'app3',
    communitySlug: 'fotografcilik',
    applicantName: 'Onur Kılıç',
    message: 'Sokak fotoğrafçılığı üzerine birlikte çalışmak isterim.',
    status: 'approved',
    createdAt: '2026-08-12T11:20:00Z',
  },
  {
    id: 'app4',
    communitySlug: 'fotografcilik',
    applicantName: 'Ece Bulut',
    message: 'Yeni başlıyorum ama çok istekliyim.',
    status: 'rejected',
    createdAt: '2026-08-08T18:45:00Z',
  },
  {
    id: 'app5',
    communitySlug: 'algoritma',
    applicantName: 'Yiğit Aslan',
    message: 'ACM-ICPC hazırlığı yapıyorum, takım arıyorum.',
    status: 'pending',
    createdAt: '2026-08-22T08:15:00Z',
  },
]
