import { prisma } from '@/lib/prisma';
import { recipeSchema } from '@/lib/validations/recipe';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user');
    const pubParam = url.searchParams.get('public');

    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const where: {
      authorId?: string;
      isPublic?: boolean;
    } = {};

    if (userId) {
      where.authorId = userId;

      if (pubParam === 'all') {
        if (!currentUserId || currentUserId !== userId) {
          return NextResponse.json([], { status: 200 });
        }
      } else if (pubParam === 'false') {
        if (!currentUserId || currentUserId !== userId) {
          return NextResponse.json([], { status: 200 });
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
      include: { author: { select: { username: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = recipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { title, description, isPublic, difficultyId, durationId, ingredients, steps, tags } =
      parsed.data;

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
      },
      include: {
        ingredients: true,
        steps: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
