'use client';

import { useState } from 'react';
import { Navigation } from '@/components/common/navigation';
import { RecipeFilters, type FilterState } from '@/components/recipes/RecipeFilter';
import { mockRecipes } from '@/lib/mock-data';
import { ViewToggle } from '@/components/recipes/ViewToggle';
import { RecipeCardCompact } from '@/components/recipes/RecipeCardCompact';
import { RecipeCardDetailed } from '@/components/recipes/RecipeCardDetailled';

export default function Home() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    time: 'all',
    difficulty: 'all',
    tags: [],
  });

  const filteredRecipes = mockRecipes.filter((recipe) => {
    // Filter by difficulty
    if (filters.difficulty !== 'all' && recipe.difficulty.toLowerCase() !== filters.difficulty) {
      return false;
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) => recipe.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Découvrez nos recettes</h1>
            <ViewToggle view={view} onViewChange={setView} />
          </div>

          <RecipeFilters onFilterChange={setFilters} />
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} trouvée
            {filteredRecipes.length > 1 ? 's' : ''}
          </p>

          {view === 'grid' ? (
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
          )}
        </div>
      </main>
    </div>
  );
}
