'use client';

import { useState, useEffect } from 'react';
import { RecipeListItem } from '@/lib/types/recipe';
import { RecipeCard } from './RecipeCard';
import { Button } from '@/components/ui/button';
import { GridIcon, RowsIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { FolderCode } from 'lucide-react';

export function RecipeList() {
  const [recipes, setRecipes] = useState<RecipeListItem[] | null>(null);
  const [view, setView] = useState<'simple' | 'extended'>('simple');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('/api/recipes');
        if (!res.ok) throw new Error('Erreur API');
        setRecipes(await res.json());
      } catch (err) {
        console.error(err);
        setRecipes([]);
      }
    };

    fetchRecipes();
  }, []);

  if (recipes === null) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderCode />
          </EmptyMedia>
          <EmptyTitle>Aucune recette publiée</EmptyTitle>
          <EmptyDescription>
            Il n&apos;y a encore aucune recette publique pour le moment.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Créer une recette</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button
            size="icon"
            variant={view === 'simple' ? 'default' : 'outline'}
            onClick={() => setView('simple')}
          >
            <GridIcon size={18} />
          </Button>
          <Button
            size="icon"
            variant={view === 'extended' ? 'default' : 'outline'}
            onClick={() => setView('extended')}
          >
            <RowsIcon size={18} />
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          view === 'simple' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
        }`}
      >
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} variant={view} />
        ))}
      </div>
    </div>
  );
}
