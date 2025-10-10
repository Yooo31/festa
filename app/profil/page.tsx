'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BookOpen, Heart, Settings } from 'lucide-react';
import { RecipeCardCompact } from '@/components/recipes/RecipeCardCompact';
import { Skeleton } from '@/components/ui/skeleton';
import type { Recipe } from '@/lib/types/recipe';
import { getAllUserRecipes } from '@/lib/actions/getRecipes';

type UserRecipes = {
  all: Recipe[];
  public: Recipe[];
  private: Recipe[];
};

export default function AccountPage() {
  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  const [recipes, setRecipes] = useState<UserRecipes>({
    all: [],
    public: [],
    private: [],
  });
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const recipeCount = recipes.all.length;
  const favoriteCount = 48;
  const followersCount = 234;

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!userId) {
      return;
    }

    const fetchUserRecipes = async () => {
      setLoadingRecipes(true);
      try {
        const result = await getAllUserRecipes(userId);

        if ('error' in result) {
          throw new Error(result.error);
        }

        setRecipes(result);
      } catch (err) {
        console.error(err);
        setRecipes({ all: [], public: [], private: [] });
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchUserRecipes();
  }, [userId, status]);

  const latestRecipes = recipes.all.slice(0, 4);

  const RecipeSection = ({
    id,
    title,
    description,
    recipeList,
    isLoading,
  }: {
    id: string;
    title: string;
    description: string;
    recipeList: Recipe[];
    isLoading: boolean;
  }) => (
    <Card id={id}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : recipeList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipeList.map((recipe) => (
              <RecipeCardCompact key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-6">
            Aucune recette n&apos;a été trouvée dans cette catégorie.
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Chargement de la session...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Vous devez être connecté pour accéder à cette page de compte.
        </p>
        <Button asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Mon compte</h1>
              <p className="text-muted-foreground mt-2">
                Bonjour {session?.user?.name}, gérez vos recettes et vos favoris.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/recipes/new">
                <Plus className="h-5 w-5 mr-2" />
                Créer une recette
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes recettes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recipeCount}</div>
                <p className="text-xs text-muted-foreground">Recettes totales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoris</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{favoriteCount}</div>
                <p className="text-xs text-muted-foreground">Recettes sauvegardées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Abonnés</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{followersCount}</div>
                <p className="text-xs text-muted-foreground">Utilisateurs qui vous suivent</p>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-6">
            <RecipeSection
              id="latest"
              title="Mes dernières recettes"
              description="Les 4 recettes que vous avez créées le plus récemment."
              recipeList={latestRecipes}
              isLoading={loadingRecipes}
            />
            <RecipeSection
              id="public"
              title="Mes recettes publiques"
              description="Ces recettes sont visibles par tous les utilisateurs."
              recipeList={recipes.public}
              isLoading={loadingRecipes}
            />
            <RecipeSection
              id="private"
              title="Mes recettes privées"
              description="Seul vous pouvez voir et modifier ces recettes."
              recipeList={recipes.private}
              isLoading={loadingRecipes}
            />
          </section>
        </div>
      </section>
    </div>
  );
}
