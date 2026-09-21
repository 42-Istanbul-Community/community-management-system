import { passwordSchema } from './passwordSchema'
import { z } from 'zod'

export const MAX_AVATAR_SIZE = 1 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Ad en az 2 karakter olmalıdır.')
      .max(64, 'Ad en fazla 64 karakter olabilir.'),

    email: z
      .string()
      .trim()
      .min(1, 'E-Posta gerekli.')
      .email('Geçerli bir e-posta adresi giriniz.')
      .max(255, 'E-posta en fazla 255 karakter olabilir.'),

    password: passwordSchema,
    passwordConfirm: z.string().min(1, 'Şifre tekrarı gerekli.'),

    picture: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || file.size <= MAX_AVATAR_SIZE,
        "Dosya boyutu 1 MB'ı aşamaz",
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Yalnızca JPG, PNG veya WebP yükleyebilirsiniz.',
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Şifreler eşleşmiyor.',
    path: ['passwordConfirm'],
  })

export type RegisterValues = z.infer<typeof registerSchema>
