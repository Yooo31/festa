import { RecipeForm } from '@/components/recipes/form/RecipeForm';
import { getMetaData } from '@/lib/actions/meta';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Créer une nouvelle recette',
  description: 'Partagez votre propre recette de cuisine avec la communauté FESTA.',
};

export default async function CreateRecipePage() {
  const result = await getMetaData();

  if ('error' in result) {
    throw new Error(result.error);
  }

  const meta = result;

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <RecipeForm meta={meta} />
      </section>
    </div>
  );
}
