import type {
  Difficulty,
  Duration,
  Ingredient,
  Recipe as PrismaRecipe,
  RecipeTag,
  Step,
  Tag,
  User,
} from '@/lib/generated/prisma';

import type { RecipeForForm, RecipeListItem } from '@/lib/types/recipe';

export interface RecipeWithRelations extends PrismaRecipe {
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
    description: recipe.description ?? '',
    duration: recipe.duration.name,
    difficulty: recipe.difficulty.name,
    author: authorName,
    isPublic: recipe.isPublic,
    ingredients: recipe.ingredients.map((ing) => ({
      ...ing,
      quantity: ing.quantity ?? '',
    })),
    steps: recipe.steps,
    tags: tags,
    images: images,
    authorId: recipe.authorId,
  };
}

export function recipeToFormItem(recipe: RecipeWithAllRelations): RecipeForForm {
  const tagsIds = recipe.tags.map((tagRel) => tagRel.tag.id);
  const imagesUrls = recipe.images.map((img) => img.url);

  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description ?? '',
    difficultyId: recipe.difficulty.id,
    durationId: recipe.duration.id,
    ingredients: recipe.ingredients.map((i) => ({
      name: i.name,
      quantity: i.quantity || undefined,
    })),
    steps: recipe.steps,
    tags: tagsIds,
    images: imagesUrls,
    isPublic: recipe.isPublic,
    authorId: recipe.authorId,
  };
}
