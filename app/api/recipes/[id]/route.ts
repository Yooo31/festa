import { recipeToDetailedItem } from '@/lib/adapters/recipeAdapter';
import { prisma } from '@/lib/prisma';
import { recipeSchema } from '@/lib/validations/recipe';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const recipeId = params.id;
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
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
      return NextResponse.json({ error: 'Recette introuvable' }, { status: 404 });
    }

    const formattedRecipe = recipeToDetailedItem(recipe);

    if (recipe.isPublic) {
      return NextResponse.json(formattedRecipe);
    }

    if (!currentUserId || recipe.authorId !== currentUserId) {
      return NextResponse.json({ error: 'Recette privée' }, { status: 403 });
    }

    return NextResponse.json(formattedRecipe);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      include: { ingredients: true, steps: true, tags: true },
    });
    if (!recipe) return NextResponse.json({ error: 'Recette introuvable' }, { status: 404 });
    if (recipe.authorId !== session.user.id)
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const body = await req.json();
    const parsed = recipeSchema.partial().safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

    const { title, description, isPublic, difficultyId, durationId, ingredients, steps, tags } =
      parsed.data;

    const updated = await prisma.recipe.update({
      where: { id: params.id },
      data: {
        title,
        description,
        isPublic,
        difficultyId,
        durationId,
        ...(ingredients
          ? {
              ingredients: {
                deleteMany: {},
                create: ingredients.map((ing) => ({ name: ing.name, quantity: ing.quantity })),
              },
            }
          : {}),
        ...(steps
          ? {
              steps: {
                deleteMany: {},
                create: steps.map((s) => ({ order: s.order, content: s.content })),
              },
            }
          : {}),
        ...(tags
          ? {
              tags: {
                deleteMany: {},
                create: tags.map((tagId) => ({ tag: { connect: { id: tagId } } })),
              },
            }
          : {}),
      },
      include: {
        ingredients: true,
        steps: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const recipe = await prisma.recipe.findUnique({ where: { id: params.id } });
    if (!recipe) return NextResponse.json({ error: 'Recette introuvable' }, { status: 404 });
    if (recipe.authorId !== session.user.id)
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    await prisma.recipe.delete({ where: { id: params.id } });

    return NextResponse.json({ message: 'Recette supprimée avec succès' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
