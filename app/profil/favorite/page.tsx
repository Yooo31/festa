import { Navigation } from '@/components/common/navigation';
import { RecipeCardCompact } from '@/components/recipes/RecipeCardCompact';
import { mockRecipes } from '@/lib/mock-data';

export default function FavoritesPage() {
  const favoriteRecipes = mockRecipes.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Mes favoris</h1>
            <p className="text-muted-foreground mt-2">
              {favoriteRecipes.length} recette{favoriteRecipes.length > 1 ? 's' : ''} sauvegardée
              {favoriteRecipes.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteRecipes.map((recipe) => (
              <RecipeCardCompact key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
