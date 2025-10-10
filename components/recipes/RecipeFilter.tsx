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
import type { MetaItem, FilterState } from '@/lib/types/recipe';

interface RecipeFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  difficulties: MetaItem[];
  durations: MetaItem[];
  tags: MetaItem[];
}

export function RecipeFilters({
  onFilterChange,
  difficulties,
  durations,
  tags,
}: RecipeFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    duration: 'all',
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
          <Label htmlFor="duration">Temps de préparation</Label>
          <Select
            value={filters.duration}
            onValueChange={(value) => updateFilters('duration', value)}
          >
            <SelectTrigger id="duration">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {durations.map((d) => (
                <SelectItem key={d.id} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
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
              {difficulties.map((d) => (
                <SelectItem key={d.id} value={d.name.toLowerCase()}>
                  {d.name}
                </SelectItem>
              ))}
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
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.name}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
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
