import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Metadata } from 'next';

import { RecipeForm } from '@/components/recipes/form/RecipeForm';
import type { Meta, RecipeForForm } from '@/lib/types/recipe';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function getMetaData(): Promise<Meta> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/meta`);
  if (!res.ok) {
    throw new Error('Échec du chargement des métadonnées');
  }
  return res.json();
}

async function getRecipeForEdit(recipeId: string): Promise<RecipeForForm | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/recipes/${recipeId}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    if (response.status === 403) {
      redirect('/403');
    }
    throw new Error(`Erreur lors de la récupération de la recette: ${response.statusText}`);
  }

  return response.json() as Promise<RecipeForForm>;
}

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const recipeId = params.id;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/recipes/${recipeId}/edit`);
  }

  const [recipe, meta] = await Promise.all([getRecipeForEdit(recipeId), getMetaData()]);

  if (!recipe) {
    notFound();
  }

  if (recipe.authorId !== session.user.id) {
    redirect('/403');
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <RecipeForm meta={meta} initialData={recipe} />
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const recipe = await getRecipeForEdit(params.id);

  if (!recipe) {
    return {
      title: 'Recette introuvable',
    };
  }

  return {
    title: `Modifier : ${recipe.title}`,
    description: `Modifier votre recette "${recipe.title}" sur FESTA.`,
  };
}
