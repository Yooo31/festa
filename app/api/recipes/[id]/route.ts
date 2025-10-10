import { recipeToDetailedItem, recipeToFormItem } from '@/lib/adapters/recipeAdapter';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { recipeAPISchema } from '@/lib/validations/recipe';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  try {
    const session = await getServerSession(authOptions);

    const currentUserId = session?.user?.id;

    const recipe = await prisma.recipe.findUnique({
      where: { id: id },
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

    const isAuthor = recipe.authorId === currentUserId;

    if (isAuthor) {
      const formRecipe = recipeToFormItem(recipe);
      return NextResponse.json(formRecipe);
    }

    if (!recipe.isPublic) {
      return NextResponse.json({ error: 'Recette privée' }, { status: 403 });
    }

    const formattedRecipe = recipeToDetailedItem(recipe);
    return NextResponse.json(formattedRecipe);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const recipe = await prisma.recipe.findUnique({
      where: { id: id },
      include: { ingredients: true, steps: true, tags: true },
    });
    if (!recipe) return NextResponse.json({ error: 'Recette introuvable' }, { status: 404 });
    if (recipe.authorId !== session.user.id)
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const body = await req.json();
    const parsed = recipeAPISchema.partial().safeParse(body);

    if (!parsed.success) {
      console.error('Zod Validation Error:', z.treeifyError(parsed.error));
      return NextResponse.json({ error: z.treeifyError(parsed.error) }, { status: 400 });
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

    const imageUpdateData = images
      ? {
          images: {
            deleteMany: {},
            create: images.map((url) => ({ url: url })),
          },
        }
      : {};

    const updated = await prisma.recipe.update({
      where: { id: id },
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
        ...imageUpdateData,
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

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const recipe = await prisma.recipe.findUnique({ where: { id: id } });
    if (!recipe) return NextResponse.json({ error: 'Recette introuvable' }, { status: 404 });
    if (recipe.authorId !== session.user.id)
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    await prisma.recipe.delete({ where: { id: id } });

    return NextResponse.json({ message: 'Recette supprimée avec succès' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
