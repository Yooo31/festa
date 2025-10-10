'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteRecipe } from '@/lib/actions/getRecipes';

export function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm('Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible.')
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteRecipe(recipeId);

      if ('error' in result) {
        throw new Error(result.error);
      }

      toast.success("Recette supprimée ! La recette a été retirée de l'application.");

      router.push('/profil');
    } catch (e) {
      console.error(e);
      toast.error('Une erreur est survenue lors de la suppression de la recette.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="destructive" size="lg" onClick={handleDelete} disabled={isDeleting}>
        <Trash2 className="h-5 w-5 mr-2" />
        {isDeleting ? 'Suppression...' : 'Supprimer'}
      </Button>
    </>
  );
}
