'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorite } from '@/lib/hooks/useFavorite';

interface FavoriteButtonProps {
  recipeId: string;
  initialIsFavorite: boolean;
  isAuthenticated: boolean;
  variant: 'normal' | 'small';
}

export function FavoriteButton({
  recipeId,
  initialIsFavorite,
  isAuthenticated,
  variant,
}: FavoriteButtonProps) {
  const { isFavorite, loading, handleToggle } = useFavorite({
    recipeId,
    initialIsFavorite,
    isAuthenticated,
  });

  return (
    <Button
      size={variant === 'small' ? 'icon' : 'lg'}
      className="shrink-0"
      variant={isFavorite ? 'favorite' : 'outline'}
      onClick={handleToggle}
      disabled={loading || !isAuthenticated}
    >
      <Heart className="h-5 w-5" />
      {variant === 'normal' ? (
        loading ? (
          'Mise à jour...'
        ) : isFavorite ? (
          'Retirer des favoris'
        ) : (
          'Ajouter aux favoris'
        )
      ) : (
        <span className="sr-only">Ajouter aux favoris</span>
      )}
    </Button>
  );
}
