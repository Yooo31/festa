'use client';

import { useState } from 'react';
import { RecipeFilters, type FilterState } from './RecipeFilter';
import { ViewToggle } from './ViewToggle';
import { RecipeCardCompact } from './RecipeCardCompact';
import { RecipeCardDetailed } from './RecipeCardDetailled';
import type { RecipeWithStatus } from '@/lib/types/recipe';

type MetaItem = { id: string; name: string };
type Meta = {
  difficulties: MetaItem[];
  durations: MetaItem[];
  tags: MetaItem[];
};

interface RecipeListContainerProps {
  initialRecipes: RecipeWithStatus[];
  meta: Meta;
}

export function RecipeListContainer({ initialRecipes, meta }: RecipeListContainerProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    duration: 'all',
    difficulty: 'all',
    tags: [],
  });

  const filteredRecipes = initialRecipes.filter((recipe) => {
    if (filters.difficulty !== 'all' && recipe.difficulty.toLowerCase() !== filters.difficulty) {
      return false;
    }

    if (filters.duration !== 'all' && recipe.duration !== filters.duration) {
      return false;
    }

    if (filters.tags.length > 0) {
      if (!filters.tags.some((tag) => recipe.tags.includes(tag))) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-end">
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      <RecipeFilters
        onFilterChange={setFilters}
        difficulties={meta.difficulties}
        durations={meta.durations}
        tags={meta.tags}
      />

      <div className="space-y-4">
        <p className="text-muted-foreground">
          {filteredRecipes.length} recette{filteredRecipes.length !== 1 ? 's' : ''} trouvée
          {filteredRecipes.length !== 1 ? 's' : ''}
        </p>

        {filteredRecipes.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCardCompact key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCardDetailed key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )
        ) : (
          <p className="text-center text-muted-foreground py-10">
            Aucune recette ne correspond à vos critères.
          </p>
        )}
      </div>
    </>
  );
}
