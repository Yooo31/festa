import Link from 'next/link';
import Image from 'next/image';
import { Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/lib/types/recipe';

interface RecipeCardCompactProps {
  recipe: Recipe;
}

export function RecipeCardCompact({ recipe }: RecipeCardCompactProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={`/uploads/${recipe.image}` || '/placeholder.svg'}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 text-balance">{recipe.title}</h3>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span>{recipe.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.time}</span>
            </div>
          </div>

          <Badge variant="secondary" className="text-xs">
            {recipe.difficulty}
          </Badge>

          <p className="text-sm text-muted-foreground">par {recipe.author}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
