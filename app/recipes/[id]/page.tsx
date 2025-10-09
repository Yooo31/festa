import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Star, Heart, ChefHat } from 'lucide-react';

import type { Recipe, Step } from '@/lib/types/recipe';
import { Metadata } from 'next';

async function getRecipe(recipeId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/recipes/${recipeId}`);

  if (!response.ok) {
    if (response.status === 404 || response.status === 403) {
      return null;
    }
    throw new Error(`Erreur lors de la récupération de la recette: ${response.statusText}`);
  }

  return response.json();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    return {
      title: 'Recette Introuvable',
      description: "Désolé, la recette que vous recherchez n'a pas été trouvée.",
    };
  }

  return {
    title: recipe.title,
    description:
      recipe.description || `Découvrez la délicieuse recette de ${recipe.title} sur FESTA.`,
    openGraph: {
      images: recipe.images?.length > 0 ? [`/uploads/${recipe.images[0]}`] : undefined,
    },
  };
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipeId = params.id;

  const recipe: Recipe & { steps: Step[] } = await getRecipe(recipeId);

  if (!recipe) {
    notFound();
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
              <Button size="lg" className="shrink-0">
                <Heart className="h-5 w-5 mr-2" />
                Favoris
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="font-semibold text-lg">{recipe.rating}</span>
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
