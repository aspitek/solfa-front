import { z } from 'zod'

export const createPartitionSchema = z.object({
    title: z.string().min(5, 'le titre doit faire au moins 5 caracteres'),
    composer: z.string().min(5, 'le compositeur doit faire au moins 5 caracteres'),
    genre: z.string({message: 'Genre inconnu'}),
    category: z.string({message: 'Catégorie inconnue'}),
    release_date: z.date({message: 'Daste Invalide'}).optional(),
})
