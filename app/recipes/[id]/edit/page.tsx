import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Metadata } from 'next';

import { RecipeForm } from '@/components/recipes/form/RecipeForm';
import type { Meta, RecipeForForm } from '@/lib/types/recipe';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { getMetaData } from '@/lib/actions/meta';
import { getRecipeForm } from '@/lib/actions/getRecipes';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const result = await getRecipeForm(params.id);

  if ('error' in result) {
    return {
      title: 'Erreur',
      description: result.error,
    };
  }

  return {
    title: `Modifier : ${result.title}`,
    description: `Modifier votre recette "${result.title}" sur FESTA.`,
  };
}

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const recipeId = params.id;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/recipes/${recipeId}/edit`);
  }

  const [recipeResult, metaResult] = await Promise.all([getRecipeForm(recipeId), getMetaData()]);

  if ('error' in recipeResult) {
    if (recipeResult.error === 'Recette introuvable') {
      notFound();
    }
    if (recipeResult.error === 'Non autorisé' || recipeResult.error === 'Accès refusé') {
      redirect('/403');
    }
    throw new Error(recipeResult.error);
  }

  if ('error' in metaResult) {
    throw new Error(metaResult.error);
  }

  const recipe: RecipeForForm = recipeResult;
  const meta: Meta = metaResult;

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <RecipeForm meta={meta} initialData={recipe} />
      </section>
    </div>
  );
}
