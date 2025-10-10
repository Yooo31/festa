'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { recipeToDetailedItem, recipeToFormItem } from '@/lib/adapters/recipeAdapter';
import { prisma } from '@/lib/prisma';
import { Recipe, RecipeForForm } from '@/lib/types/recipe';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

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

export async function createRecipe(
  data: RecipeForForm,
): Promise<{ success: true; recipeId: string } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Non autorisé' };
  }
  const userId = session.user.id;

  try {
    const {
      title,
      description,
      isPublic,
      difficultyId,
      durationId,
      ingredients,
      steps,
      tags,
      images,
    } = data;

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        description,
        isPublic,
        difficultyId,
        durationId,
        authorId: userId,
        ingredients: {
          create: ingredients.map((ing) => ({ name: ing.name, quantity: ing.quantity })),
        },
        steps: {
          create: steps.map((s) => ({ order: s.order, content: s.content })),
        },
        tags:
          tags && tags.length > 0
            ? { create: tags.map((tagId) => ({ tag: { connect: { id: tagId } } })) }
            : undefined,
        images:
          images && images.length > 0 ? { create: images.map((url) => ({ url: url })) } : undefined,
      },
    });

    revalidatePath('/');
    revalidatePath('/profil');

    return { success: true, recipeId: newRecipe.id };
  } catch (error) {
    console.error('Erreur Server Action createRecipe:', error);
    return { error: 'Erreur serveur interne.' };
  }
}

export async function updateRecipe(
  id: string,
  data: Partial<RecipeForForm>,
): Promise<{ success: true; recipeId: string } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Non autorisé' };
  }
  const userId = session.user.id;

  try {
    const existingRecipe = await prisma.recipe.findUnique({ where: { id } });

    if (!existingRecipe) return { error: 'Recette introuvable' };
    if (existingRecipe.authorId !== userId) return { error: 'Non autorisé' };

    const {
      title,
      description,
      isPublic,
      difficultyId,
      durationId,
      ingredients,
      steps,
      tags,
      images,
    } = data;

    const updateData: {
      title?: string;
      description?: string;
      isPublic?: boolean;
      difficultyId?: string;
      durationId?: string;
      ingredients?: {
        deleteMany: object;
        create: { name: string; quantity: string | null }[];
      };
      steps?: {
        deleteMany: object;
        create: { order: number; content: string }[];
      };
      tags?: {
        deleteMany: object;
        create: { tag: { connect: { id: string } } }[];
      };
      images?: {
        deleteMany: object;
        create: { url: string }[];
      };
    } = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (difficultyId !== undefined) updateData.difficultyId = difficultyId;
    if (durationId !== undefined) updateData.durationId = durationId;

    if (ingredients) {
      updateData.ingredients = {
        deleteMany: {},
        create: ingredients.map((ing) => ({
          name: ing.name,
          quantity: ing.quantity || null,
        })),
      };
    }

    if (steps) {
      updateData.steps = {
        deleteMany: {},
        create: steps.map((s) => ({ order: s.order, content: s.content })),
      };
    }

    if (tags) {
      updateData.tags = {
        deleteMany: {},
        create: tags.map((tagId) => ({ tag: { connect: { id: tagId } } })),
      };
    }

    if (images) {
      updateData.images = {
        deleteMany: {},
        create: images.map((url) => ({ url: url })),
      };
    }

    await prisma.recipe.update({
      where: { id },
      data: updateData,
    });

    revalidatePath(`/recipes/${id}`);
    revalidatePath('/profil');

    return { success: true, recipeId: id };
  } catch (error) {
    console.error('Erreur Server Action updateRecipe:', error);
    return { error: 'Erreur serveur interne.' };
  }
}
