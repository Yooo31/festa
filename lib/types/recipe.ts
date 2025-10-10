// --- Types de base pour les entités ---
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Step {
  content: string;
  id?: string;
  order: number;
  recipeId?: string;
}

// --- Types pour l'affichage ---

export interface Recipe {
  id: string;
  title: string;
  description: string;
  images: string[];
  // rating: number;
  duration: string;
  difficulty: string;
  tags: string[];
  author: string;
  ingredients: Ingredient[];
  steps: Step[];
  isPublic: boolean;
  authorId?: string;
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

export interface RecipeWithStatus extends Recipe {
  isAuthenticated: boolean;
  initialIsFavorite: boolean;
}

// --- Types spécifiques aux métadonnées et aux formulaires ---

export interface MetaItem {
  id: string;
  name: string;
}

export interface Meta {
  difficulties: MetaItem[];
  durations: MetaItem[];
  tags: MetaItem[];
}

// --- Type utilisé pour pré-remplir le formulaire d'édition. ---

export interface RecipeForForm {
  id: string;
  title: string;
  description: string;
  difficultyId: string;
  durationId: string;
  ingredients: { name: string; quantity?: string }[];
  steps: { content: string; order: number }[];
  tags: string[];
  images: string[];
  isPublic: boolean;
  authorId: string;
}

// --- Type utilisé pour l'état des filtres côté client ---
export interface FilterState {
  duration: string;
  difficulty: string;
  tags: string[];
}
