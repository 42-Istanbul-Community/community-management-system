import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(10, 'Şifre en az 10 karakter olmalıdır.')
  .max(72, 'Şifre en fazla 72 karakter olabilir.')
  .regex(/[a-z]/, 'Şifre en az bir küçük harf içermeli.')
  .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermeli.')
  .regex(/[0-9]/, 'Şifre en az bir rakam içermeli.')
