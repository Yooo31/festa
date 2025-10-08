import { z } from 'zod';

export const recipeSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  difficultyId: z.string().min(1, 'La difficulté est obligatoire.'),
  durationId: z.string().min(1, 'La durée est obligatoire.'),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Le nom de l'ingrédient est requis."),
        quantity: z.string().optional(),
      }),
    )
    .nonempty('Ajoutez au moins un ingrédient.'),
  steps: z
    .array(
      z.object({
        order: z.number().min(1),
        content: z.string().min(1, "Le contenu de l'étape est requis."),
      }),
    )
    .nonempty('Ajoutez au moins une étape.'),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  isPublic: z.boolean().optional().default(false),
});

export type RecipeInput = z.infer<typeof recipeSchema>;
