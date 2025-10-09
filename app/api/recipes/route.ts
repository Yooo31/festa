import { formatResponse } from '@/lib/adapters';
import { recipeToListItem } from '@/lib/adapters/recipeAdapter';
import { prisma } from '@/lib/prisma';
import { recipeSchema } from '@/lib/validations/recipe';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user');
    const pubParam = url.searchParams.get('public');

    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const where: { authorId?: string; isPublic?: boolean } = {};

    if (userId) {
      where.authorId = userId;

      if (pubParam === 'all') {
        if (!currentUserId || currentUserId !== userId) {
          return formatResponse([], 200);
        }
      } else if (pubParam === 'false') {
        if (!currentUserId || currentUserId !== userId) {
          return formatResponse([], 200);
        }
        where.isPublic = false;
      } else {
        where.isPublic = true;
      }
    } else {
      where.isPublic = true;
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        difficulty: true,
        duration: true,
        tags: { include: { tag: true } },
        images: true,
        author: { select: { username: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = recipes.map(recipeToListItem);

    return formatResponse(formatted, 200);
  } catch (error) {
    console.error(error);
    return formatResponse({ error: 'Erreur serveur' }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return formatResponse({ error: 'Non autorisé' }, 401);
    }

    const body = await req.json();
    const parsed = recipeSchema.safeParse(body);

    if (!parsed.success) {
      return formatResponse({ error: parsed.error.format() }, 400);
    }

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
    } = parsed.data;

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        isPublic,
        difficultyId,
        durationId,
        authorId: session.user.id,
        ingredients: {
          create: ingredients.map((ing) => ({ name: ing.name, quantity: ing.quantity })),
        },
        steps: {
          create: steps.map((s) => ({ order: s.order, content: s.content })),
        },
        tags: tags
          ? {
              create: tags.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
        images: images
          ? {
              create: images.map((img) => ({ url: img.url })),
            }
          : undefined,
      },
      include: {
        difficulty: true,
        duration: true,
        tags: { include: { tag: true } },
        author: { select: { username: true, firstName: true, lastName: true } },
        images: true,
      },
    });

    return formatResponse(recipeToListItem(recipe), 201);
  } catch (error) {
    console.error(error);
    return formatResponse({ error: 'Erreur serveur' }, 500);
  }
}
