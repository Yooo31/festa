import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Metadata, ResolvingMetadata } from 'next';

import { RecipeForm } from '@/components/recipes/form/RecipeForm';
import { authOptions } from '@/lib/auth';

import { getMetaData } from '@/lib/actions/meta';
import { getRecipeForm } from '@/lib/actions/getRecipes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const result = await getRecipeForm(id);

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

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: recipeId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/recipes/${recipeId}/edit`);
  }

  const [recipeResult, metaResult] = await Promise.all([getRecipeForm(recipeId), getMetaData()]);

  if ('error' in recipeResult) {
    if (recipeResult.error === 'Recette introuvable') notFound();
    if (['Non autorisé', 'Accès refusé'].includes(recipeResult.error)) redirect('/403');
    throw new Error(recipeResult.error);
  }

  if ('error' in metaResult) throw new Error(metaResult.error);

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <RecipeForm meta={metaResult} initialData={recipeResult} />
      </section>
    </div>
  );
}
