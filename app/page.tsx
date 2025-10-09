'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/common/navigation';
import { RecipeFilters, type FilterState } from '@/components/recipes/RecipeFilter';
import { ViewToggle } from '@/components/recipes/ViewToggle';
import { RecipeCardCompact } from '@/components/recipes/RecipeCardCompact';
import { RecipeCardDetailed } from '@/components/recipes/RecipeCardDetailled';
import { Skeleton } from '@/components/ui/skeleton';
import type { Recipe } from '@/lib/types/recipe';

type MetaItem = { id: string; name: string };
type Meta = {
  difficulties: MetaItem[];
  durations: MetaItem[];
  tags: MetaItem[];
};

export default function Home() {
  // --- États ---
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    duration: 'all',
    difficulty: 'all',
    tags: [],
  });

  // --- Récupération des données ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // On lance les deux appels en parallèle pour plus d'efficacité
        const [recipesRes, metaRes] = await Promise.all([
          fetch('/api/recipes'),
          fetch('/api/meta'),
        ]);

        if (!recipesRes.ok || !metaRes.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        setRecipes(await recipesRes.json());
        setMeta(await metaRes.json());
      } catch (err) {
        console.error(err);
        setRecipes([]); // En cas d'erreur, on affiche une liste vide
        setMeta({ difficulties: [], durations: [], tags: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // --- Logique de filtrage (côté client) ---
  const filteredRecipes = recipes.filter((recipe) => {
    // Difficulté
    if (filters.difficulty !== 'all' && recipe.difficulty.toLowerCase() !== filters.difficulty) {
      return false;
    }
    // Durée (Note: à adapter si la logique est plus complexe)
    if (filters.duration !== 'all' && recipe.duration !== filters.duration) {
      return false;
    }
    // Tags
    if (filters.tags.length > 0) {
      if (!filters.tags.some((tag) => recipe.tags.includes(tag))) {
        return false;
      }
    }
    return true;
  });

  // --- Rendu ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Découvrez nos recettes</h1>
            <ViewToggle view={view} onViewChange={setView} />
          </div>
          {/* On passe les données meta au composant de filtres */}
          {meta && (
            <RecipeFilters
              onFilterChange={setFilters}
              difficulties={meta.difficulties}
              durations={meta.durations}
              tags={meta.tags}
            />
          )}
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {filteredRecipes.length} recette{filteredRecipes.length !== 1 ? 's' : ''} trouvée
            {filteredRecipes.length !== 1 ? 's' : ''}
          </p>
          {/* Logique d'affichage des cartes */}
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
      </main>
    </div>
  );
}
