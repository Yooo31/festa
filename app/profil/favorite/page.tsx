import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

import { RecipeCardCompact } from '@/components/recipes/RecipeCardCompact';
import { Metadata } from 'next';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Recipe } from '@/lib/types/recipe';

export const metadata: Metadata = {
  title: 'Mes Favoris',
  description: 'Liste de toutes les recettes que vous avez sauvegardées.',
};

async function fetchFavoriteRecipes() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/login');
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: userId },
    include: {
      recipe: {
        select: {
          id: true,
          title: true,
          description: true,

          difficulty: { select: { name: true } },
          duration: { select: { name: true } },
          author: { select: { username: true } },

          images: { select: { url: true } },

          tags: {
            select: { tag: { select: { name: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return favorites.map(
    (fav) =>
      ({
        id: fav.recipe.id,
        title: fav.recipe.title,
        description: fav.recipe.description,
        // rating: fav.recipe.rating ?? 0,

        difficulty: fav.recipe.difficulty.name,
        duration: fav.recipe.duration.name,
        author: fav.recipe.author.username,

        images: fav.recipe.images.map((img) => img.url),

        tags: fav.recipe.tags.map((rt) => rt.tag.name),

        ingredients: [],
        steps: [],
        isPublic: false,
      }) as Recipe,
  );
}

export default async function FavoritesPage() {
  const favoriteRecipes: Recipe[] = await fetchFavoriteRecipes();
  const count = favoriteRecipes.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Mes favoris</h1>
        <p className="text-muted-foreground mt-2">
          {count} recette{count > 1 ? 's' : ''} sauvegardée
          {count > 1 ? 's' : ''}
        </p>
      </div>

      {count > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteRecipes.map((recipe) => (
            <RecipeCardCompact key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg bg-card text-muted-foreground">
          <Heart className="h-10 w-10 mx-auto mb-4" />
          <p className="text-lg">Vous n&apos;avez encore ajouté aucune recette à vos favoris.</p>
          <p className="mt-2 text-sm">Parcourez nos recettes pour trouver l&apos;inspiration !</p>
          <Link href="/" passHref>
            <Button variant="link" className="mt-4">
              Découvrir les recettes
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
