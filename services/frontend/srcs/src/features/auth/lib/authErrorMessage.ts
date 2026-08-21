import { ApiError } from '@/lib'

const messages: Record<string, string> = {
  'User not found': 'E-posta veya şifre hatalı.',
  'Invalid credentials': 'E-posta veya şifre hatalı.',
  'User already exists': 'Bu e-posta adresi zaten kayıtlı.',
}

export function authErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return (
      messages[error.message] ?? 'İşlem tamamlanamadı, lütfen tekrar deneyin.'
    )
  }
  return 'Sunucuya ulaşılamadı, bağlantınızı kontrol edin.'
}
