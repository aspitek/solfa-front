import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const registerSchema = z.object({
    email: z.string().email('l\'email doit être valide'),
    username: z.string().min(3, 'le nom d\'utilisateur doit faire au moins 3 caracteres'),
    password: z.string().min(6, 'le mot de passe doit faire au moins 6 caracteres'),
})