export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  time: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  tags: string[];
  author: string;
  ingredients: Ingredient[];
  steps: string[];
  isPublic: boolean;
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
