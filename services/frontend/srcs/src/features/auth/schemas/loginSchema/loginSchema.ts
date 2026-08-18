import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'E-posta gerekli.')
    .email('Geçerli bir e-posta adresi girin.'),

  password: z.string().min(1, 'Şifre gerekli'),
})

export type LoginValues = z.infer<typeof loginSchema>
