'use server';

import { prisma } from '@/lib/prisma';
import { Meta } from '@/lib/types/recipe';

export async function getMetaData(): Promise<Meta | { error: string }> {
  try {
    const [difficulties, durations, tags] = await Promise.all([
      prisma.difficulty.findMany({ select: { id: true, name: true } }),
      prisma.duration.findMany({ select: { id: true, name: true } }),
      prisma.tag.findMany({ select: { id: true, name: true } }),
    ]);

    return {
      difficulties,
      durations,
      tags,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
    return { error: 'Échec du chargement des métadonnées' };
  }
}
