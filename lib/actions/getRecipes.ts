'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { recipeToDetailedItem, recipeToFormItem } from '@/lib/adapters/recipeAdapter';
import { prisma } from '@/lib/prisma';
import { Recipe, RecipeForForm } from '@/lib/types/recipe';
import { getServerSession } from 'next-auth';

type UserRecipesResult = {
  all: Recipe[];
  public: Recipe[];
  private: Recipe[];
};

/**
 * Récupère les listes de recettes (toutes, publiques, privées) pour la page de compte utilisateur.
 * @param targetUserId L'ID de l'utilisateur dont on veut voir les recettes.
 * @returns Un objet contenant les trois listes de recettes formatées.
 */
export async function getAllUserRecipes(
  targetUserId: string,
): Promise<UserRecipesResult | { error: string }> {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  console.log('getAllUserRecipes called for userId:', session);

  if (targetUserId !== currentUserId) {
    return { error: 'Accès non autorisé aux données de compte.' };
  }

  try {
    const allRecipes = await prisma.recipe.findMany({
      where: {
        authorId: targetUserId,
      },
      include: {
        difficulty: true,
        duration: true,
        tags: { include: { tag: true } },
        ingredients: true,
        steps: true,
        images: true,
        author: { select: { username: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const allFormatted: Recipe[] = allRecipes.map(recipeToDetailedItem);

    const publicFormatted = allFormatted.filter((recipe) => recipe.isPublic);
    const privateFormatted = allFormatted.filter((recipe) => !recipe.isPublic);

    return {
      all: allFormatted,
      public: publicFormatted,
      private: privateFormatted,
    };
  } catch (error) {
    console.error('Erreur Server Action getUserRecipesForAccountPage:', error);
    return { error: 'Erreur serveur interne lors de la récupération des recettes.' };
  }
}

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
