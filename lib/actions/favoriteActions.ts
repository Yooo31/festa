'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function checkIsFavorite(userId: string, recipeId: string): Promise<boolean> {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_recipeId: { userId, recipeId },
    },
  });
  return !!favorite;
}

export async function toggleFavoriteAction(
  recipeId: string,
): Promise<{ success: boolean; isFavorite: boolean }> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return { success: false, isFavorite: false };
  }

  const userId = session.user.id;

  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId: userId,
          recipeId: recipeId,
        },
      },
    });

    let newStatus: boolean;

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      newStatus = false;
    } else {
      await prisma.favorite.create({
        data: {
          userId: userId,
          recipeId: recipeId,
        },
      });
      newStatus = true;
    }

    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath(`/account/favorites`);

    return { success: true, isFavorite: newStatus };
  } catch (error) {
    console.error('Erreur Server Action (toggleFavorite):', error);
    return { success: false, isFavorite: false };
  }
}
