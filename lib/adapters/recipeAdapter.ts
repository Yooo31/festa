import type { Difficulty, Duration, Recipe, RecipeTag, Tag, User } from '@/lib/generated/prisma';
import type { RecipeListItem } from '@/lib/types/recipe';

export interface RecipeWithRelations extends Recipe {
  difficulty: Difficulty;
  duration: Duration;
  tags: (RecipeTag & { tag: Tag })[];
  author: Pick<User, 'username' | 'firstName' | 'lastName'>;
}

export function recipeToListItem(recipe: RecipeWithRelations): RecipeListItem {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description ?? '',
    difficulty: recipe.difficulty?.name ?? '',
    duration: recipe.duration?.name ?? '',
    tags: recipe.tags.map((t) => t.tag.name),
    author: recipe.author?.username ?? 'Anonyme',
  };
}
