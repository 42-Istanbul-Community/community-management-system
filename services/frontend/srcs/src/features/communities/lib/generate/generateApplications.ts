import { hash, pick } from './hash'
import type { Application, ApplicationStatus } from '@/features/communities/api'

const firstNames = [
  'Hakan',
  'Melis',
  'Onur',
  'Ece',
  'Yiğit',
  'Derya',
  'Sinem',
  'Barış',
  'Pelin',
  'Kaan',
]

const lastNames = [
  'Er',
  'Tan',
  'Kılıç',
  'Bulut',
  'Aslan',
  'Şen',
  'Güneş',
  'Yalçın',
  'Uçar',
  'Polat',
]

const messages = [
  'Uzun süredir bu alanla ilgileniyorum, etkinliklere katılmak isterim.',
  'Yeni başlıyorum ama öğrenmeye çok istekliyim.',
  'Geçen dönemki sunumunuzu izledim, ekibe katılmak istiyorum.',
  'Haftalık çalışmalara düzenli katılabilirim.',
  null,
]

const statuses: ApplicationStatus[] = [
  'pending',
  'pending',
  'pending',
  'approved',
  'rejected',
]

export function generateApplications(
  communityId: string,
  count = 6,
): Application[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = hash(`${communityId}:application:${index}`)
    const daysAgo = seed % 30

    return {
      id: `${communityId}-app${index}`,
      applicantName: `${pick(firstNames, seed)} ${pick(lastNames, seed >>> 8)}`,
      message: pick(messages, seed >>> 12),
      status: pick(statuses, seed >>> 16),
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    }
  })
}
