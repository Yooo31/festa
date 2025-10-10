'use server';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Star, ChefHat } from 'lucide-react';

import type { Recipe } from '@/lib/types/recipe';
import { Metadata } from 'next';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { FavoriteButton } from '@/components/recipes/FavoriteButton';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getRecipe } from '@/lib/actions/getRecipes';
import { DeleteRecipeButton } from '@/components/recipes/DeleteRecipeButton';

async function checkIsFavorite(userId: string, recipeId: string): Promise<boolean> {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_recipeId: { userId, recipeId },
    },
  });
  return !!favorite;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const result = await getRecipe(params.id);

  if ('error' in result) {
    return {
      title: 'Recette Introuvable',
      description: "Désolé, la recette que vous recherchez n'a pas été trouvée.",
    };
  }

  return {
    title: result.title,
    description:
      result.description || `Découvrez la délicieuse recette de ${result.title} sur FESTA.`,
    openGraph: {
      images: result.images?.length > 0 ? [`/uploads/${result.images[0]}`] : undefined,
    },
  };
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipeId = params.id;

  const result = await getRecipe(recipeId);

  if ('error' in result) {
    notFound();
  }

  const recipe: Recipe = result;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const isAuthenticated = !!userId;

  const isAuthor = userId === recipe.authorId;

  let initialIsFavorite = false;
  if (isAuthenticated && userId) {
    initialIsFavorite = await checkIsFavorite(userId, recipeId);
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-balance">{recipe.title}</h1>
                <p className="text-lg text-muted-foreground text-pretty">{recipe.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <FavoriteButton
                  recipeId={recipeId}
                  initialIsFavorite={initialIsFavorite}
                  isAuthenticated={isAuthenticated}
                  variant="normal"
                />
                {isAuthor && (
                  <>
                    <Button asChild variant="secondary" size="lg">
                      <Link href={`/recipes/${recipeId}/edit`}>Modifier</Link>
                    </Button>

                    <DeleteRecipeButton recipeId={recipeId} />
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-accent text-accent" />
                {/* <span className="font-semibold text-lg">{recipe.rating}</span> */}
                <span className="text-muted-foreground">/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{recipe.duration}</span>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <ChefHat className="h-4 w-4 mr-1" />
                {recipe.difficulty}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Recette créée par <span className="font-medium text-foreground">{recipe.author}</span>
            </p>
          </div>

          <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src={`/uploads/${recipe.images[0]}` || '/placeholder.svg'}
              alt={recipe.title}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>

          <div className="grid md:grid-cols-[1fr_2fr] gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Ingrédients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between gap-4">
                      <span>{ingredient.name}</span>
                      <span className="text-muted-foreground font-medium">
                        {ingredient.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Préparation</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.steps
                    .sort((a, b) => a.order - b.order)
                    .map((step) => (
                      <li key={step.order} className="flex gap-4">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                          {step.order}
                        </span>
                        <p className="flex-1 pt-1 text-pretty">{step.content}</p>
                      </li>
                    ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
function fetchRecipeFromAction(id: string) {
  throw new Error('Function not implemented.');
}
