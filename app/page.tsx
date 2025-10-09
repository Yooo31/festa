import { RecipeListContainer } from '@/components/recipes/RecipeListContainer';
import type { Recipe } from '@/lib/types/recipe';

type MetaItem = { id: string; name: string };
type Meta = {
  difficulties: MetaItem[];
  durations: MetaItem[];
  tags: MetaItem[];
};

const fetchRecipesAndMeta = async (): Promise<{ recipes: Recipe[]; meta: Meta }> => {
  try {
    const [recipesRes, metaRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/recipes`),
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/meta`),
    ]);

    if (!recipesRes.ok || !metaRes.ok) {
      throw new Error('Failed to fetch initial data');
    }

    const recipes: Recipe[] = await recipesRes.json();
    const meta: Meta = await metaRes.json();
    return { recipes, meta };
  } catch (err) {
    console.error(err);
    return { recipes: [], meta: { difficulties: [], durations: [], tags: [] } };
  }
};

export default async function Home() {
  const { recipes, meta } = await fetchRecipesAndMeta();

  if (recipes.length === 0 && meta.difficulties.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-8 space-y-8">
          <p className="text-center text-red-500">
            Impossible de charger les données de la page d&apos;accueil.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Découvrez nos recettes</h1>
        </div>

        <RecipeListContainer initialRecipes={recipes} meta={meta} />
      </section>
    </div>
  );
}
