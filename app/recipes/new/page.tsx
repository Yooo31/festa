import { CreateRecipeForm } from '@/components/recipes/CreateRecipeForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Créer une nouvelle recette',
  description: 'Partagez votre propre recette de cuisine avec la communauté FESTA.',
};

async function getMetaData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/meta`);
  if (!res.ok) return { difficulties: [], durations: [], tags: [] };
  return res.json();
}

export default async function CreateRecipePage() {
  const meta = await getMetaData();

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <CreateRecipeForm meta={meta} />
      </section>
    </div>
  );
}
