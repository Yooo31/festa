'use client';

import { toggleFavoriteAction } from '@/lib/actions/favoriteActions';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface UseFavoriteProps {
  recipeId: string;
  initialIsFavorite: boolean;
  isAuthenticated: boolean;
}

export const useFavorite = ({ recipeId, initialIsFavorite, isAuthenticated }: UseFavoriteProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour gérer vos favoris.');
      return;
    }

    setLoading(true);
    try {
      const { success, isFavorite: newStatus } = await toggleFavoriteAction(recipeId);

      if (success) {
        setIsFavorite(newStatus);
        toast.success(newStatus ? 'Ajouté aux favoris !' : 'Retiré des favoris.');
      } else {
        toast.error('Impossible de mettre à jour le statut.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erreur serveur inattendue.');
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, loading, handleToggle };
};
