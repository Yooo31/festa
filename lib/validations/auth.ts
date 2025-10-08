import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string().min(3, "Le nom d'utilisateur doit faire au moins 3 caractères"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide'),
  password: z
    .string()
    .min(10, 'Le mot de passe doit faire au moins 10 caractères')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^a-zA-Z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
