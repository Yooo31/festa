import type {
  Difficulty,
  Duration,
  Ingredient,
  Recipe,
  RecipeTag,
  Step,
  Tag,
  User,
} from '@/lib/generated/prisma';
import type { RecipeListItem } from '@/lib/types/recipe';

export interface RecipeWithRelations extends Recipe {
  difficulty: Difficulty;
  duration: Duration;
  tags: (RecipeTag & { tag: Tag })[];
  images: { url: string }[];
  author: Pick<User, 'username' | 'firstName' | 'lastName'>;
}

export interface RecipeWithAllRelations extends RecipeWithRelations {
  // rating: number;
  ingredients: Ingredient[];
  steps: Step[];
}

export function recipeToListItem(recipe: RecipeWithRelations): RecipeListItem {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description ?? '',
    difficulty: recipe.difficulty?.name ?? '',
    duration: recipe.duration?.name ?? '',
    tags: recipe.tags.map((t) => t.tag.name),
    images: recipe.images.map((i) => i.url),
    author: recipe.author.username,
  };
}

export function recipeToDetailedItem(recipe: RecipeWithAllRelations) {
  const authorName = recipe.author?.username || recipe.author?.firstName || 'Utilisateur inconnu';

  const tags = recipe.tags.map((tagRel) => tagRel.tag.name);

  const images = recipe.images.map((img) => img.url);

  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    duration: recipe.duration?.name || 'Inconnu',
    difficulty: recipe.difficulty?.name || 'Inconnu',
    // rating: recipe.rating || 0,
    author: authorName,
    isPublic: recipe.isPublic,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    tags: tags,
    images: images,
  };
}
