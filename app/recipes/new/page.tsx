import { Navigation } from '@/components/common/navigation';
import { CreateRecipeForm } from '@/components/recipes/CreateRecipeForm';

async function getMetaData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/meta`);
  if (!res.ok) return { difficulties: [], durations: [], tags: [] };
  return res.json();
}

export default async function CreateRecipePage() {
  const meta = await getMetaData();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CreateRecipeForm meta={meta} />
      </main>
    </div>
  );
}
