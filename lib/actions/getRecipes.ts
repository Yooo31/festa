'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { recipeToDetailedItem, recipeToFormItem } from '@/lib/adapters/recipeAdapter';
import { prisma } from '@/lib/prisma';
import { Recipe, RecipeForForm } from '@/lib/types/recipe';
import { getServerSession } from 'next-auth';

/**
 * Récupère les détails d'une recette pour l'affichage.
 * @param id L'ID de la recette.
 * @returns La recette formatée (Recipe) ou un objet d'erreur.
 */
export async function getRecipe(id: string): Promise<Recipe | { error: string }> {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        author: { select: { username: true, firstName: true, lastName: true } },
        difficulty: true,
        duration: true,
        ingredients: true,
        steps: true,
        tags: { include: { tag: true } },
        images: true,
      },
    });

    if (!recipe) {
      return { error: 'Recette introuvable' };
    }

    const isAuthor = recipe.authorId === currentUserId;

    if (!recipe.isPublic && !isAuthor) {
      return { error: 'Recette privée' };
    }

    return recipeToDetailedItem(recipe);
  } catch (error) {
    console.error('Erreur Server Action getRecipeForDisplay:', error);
    return { error: 'Erreur serveur interne.' };
  }
}

export async function getRecipeForm(id: string): Promise<RecipeForForm | { error: string }> {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: true,
      steps: true,
      tags: { include: { tag: true } },
      images: true,
      difficulty: true,
      duration: true,
      author: { select: { username: true, firstName: true, lastName: true } },
    },
  });

  if (!recipe) return { error: 'Recette introuvable' };
  if (recipe.authorId !== currentUserId) return { error: 'Non autorisé' };

  return recipeToFormItem(recipe);
}
