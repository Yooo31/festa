import { RecipeListContainer } from '@/components/recipes/RecipeListContainer';
import type { Meta, Recipe, RecipeWithStatus } from '@/lib/types/recipe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { checkIsFavorite } from '@/lib/actions/favoriteActions';
import { getAllPublicRecipes } from '@/lib/actions/getRecipes';
import { getMetaData } from '@/lib/actions/meta';

export default async function Home() {
  const [recipesResult, metaResult] = await Promise.all([getAllPublicRecipes(), getMetaData()]);

  if ('error' in recipesResult || 'error' in metaResult) {
    const recipeError = 'error' in recipesResult ? recipesResult.error : null;
    const metaError = 'error' in metaResult ? metaResult.error : null;
    const errorMessage = recipeError || metaError;
    console.error('Erreur de chargement des données:', errorMessage);

    return (
      <div className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-8 space-y-8">
          <p className="text-center text-red-500">
            Impossible de charger les données de la page d&apos;accueil : {errorMessage}
          </p>
        </section>
      </div>
    );
  }

  const recipes: Recipe[] = recipesResult;
  const meta: Meta = metaResult;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const isAuthenticated = !!userId;

  let recipesWithStatus: RecipeWithStatus[];

  if (isAuthenticated) {
    recipesWithStatus = await Promise.all(
      recipes.map(async (recipe) => ({
        ...recipe,
        isAuthenticated: true,
        initialIsFavorite: await checkIsFavorite(userId!, recipe.id),
      })),
    );
  } else {
    recipesWithStatus = recipes.map((recipe) => ({
      ...recipe,
      isAuthenticated: false,
      initialIsFavorite: false,
    }));
  }

  if (recipes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-8 space-y-8">
          <p className="text-center">Aucune recette n&apos;est encore disponible.</p>
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

        <RecipeListContainer initialRecipes={recipesWithStatus} meta={meta} />
      </section>
    </div>
  );
}
