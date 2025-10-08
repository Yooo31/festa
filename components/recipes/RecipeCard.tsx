import { RecipeListItem } from '@/lib/types/recipe';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface RecipeCardProps {
  recipe: RecipeListItem;
  variant?: 'simple' | 'extended';
}

export function RecipeCard({ recipe, variant = 'simple' }: RecipeCardProps) {
  return (
    <Card
      className={`hover:shadow-md transition-all ${variant === 'extended' ? 'flex flex-col md:flex-row' : ''}`}
    >
      <CardHeader className="flex-1">
        <CardTitle className="text-lg font-semibold">{recipe.title}</CardTitle>
        <CardDescription className="line-clamp-3">{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm flex-1">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{recipe.difficulty}</Badge>
          <Badge variant="outline">{recipe.duration}</Badge>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="default" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground text-xs mt-2">Auteur : {recipe.author}</p>
      </CardContent>
    </Card>
  );
}
