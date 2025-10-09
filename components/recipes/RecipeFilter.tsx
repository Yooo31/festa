'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface RecipeFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  time: string;
  difficulty: string;
  tags: string[];
}

const availableTags = [
  'Végétarien',
  'Vegan',
  'Sans gluten',
  'Dessert',
  'Entrée',
  'Plat principal',
  'Rapide',
  'Healthy',
];

export function RecipeFilters({ onFilterChange }: RecipeFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    time: 'all',
    difficulty: 'all',
    tags: [],
  });

  const updateFilters = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilters('tags', [...filters.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateFilters(
      'tags',
      filters.tags.filter((t) => t !== tag),
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">Filtres</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="time">Temps de préparation</Label>
          <Select value={filters.time} onValueChange={(value) => updateFilters('time', value)}>
            <SelectTrigger id="time">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="15">Moins de 15 min</SelectItem>
              <SelectItem value="30">Moins de 30 min</SelectItem>
              <SelectItem value="60">Moins de 1h</SelectItem>
              <SelectItem value="60+">Plus de 1h</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulté</Label>
          <Select
            value={filters.difficulty}
            onValueChange={(value) => updateFilters('difficulty', value)}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="facile">Facile</SelectItem>
              <SelectItem value="moyen">Moyen</SelectItem>
              <SelectItem value="difficile">Difficile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Select onValueChange={addTag}>
            <SelectTrigger id="tags">
              <SelectValue placeholder="Ajouter un tag" />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
