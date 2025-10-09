import Link from 'next/link';
import Image from 'next/image';
import { Clock, Star, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@/lib/types/recipe';

interface RecipeCardDetailedProps {
  recipe: Recipe;
}

export function RecipeCardDetailed({ recipe }: RecipeCardDetailedProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <Link href={`/recipes/${recipe.id}`} className="relative aspect-[4/3] md:aspect-auto">
          <Image
            src={recipe.image || '/placeholder.svg'}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Link href={`/recipes/${recipe.id}`}>
                <h3 className="font-semibold text-2xl hover:text-accent transition-colors text-balance">
                  {recipe.title}
                </h3>
              </Link>
              <p className="text-muted-foreground text-pretty">{recipe.description}</p>
            </div>

            <Button size="icon" variant="ghost" className="shrink-0">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Ajouter aux favoris</span>
            </Button>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium">{recipe.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.time}</span>
            </div>
            <Badge variant="secondary">{recipe.difficulty}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            par <span className="font-medium text-foreground">{recipe.author}</span>
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
