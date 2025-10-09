'use client';

import { LayoutGrid, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant={view === 'grid' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className="gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Grille
      </Button>
      <Button
        variant={view === 'list' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="gap-2"
      >
        <LayoutList className="h-4 w-4" />
        Liste
      </Button>
    </div>
  );
}
