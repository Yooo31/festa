export interface Recipe {
  id: string;
  title: string;
  description: string;
  images: string[];
  rating: number;
  duration: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  tags: string[];
  author: string;
  ingredients: Ingredient[];
  steps: Step[];
  isPublic: boolean;
}

export interface Step {
  content: string;
  id: string;
  order: number;
  recipeId: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface RecipeListItem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  tags: string[];
  images: string[];
  author: string;
}
