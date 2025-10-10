'use client';

import { Share2, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';

interface ShareButtonProps {
  recipeTitle: string;
  recipeUrl: string;
}

export function ShareButton({ recipeTitle, recipeUrl }: ShareButtonProps) {
  const encodedUrl = encodeURIComponent(recipeUrl);
  const encodedTitle = encodeURIComponent(`Découvrez la recette : ${recipeTitle}`);

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(recipeUrl).then(() => {
      toast.success("L'URL de la recette a été copiée dans votre presse-papiers !");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" variant="outline" aria-label="Partager la recette">
          <Share2 className="h-5 w-5 mr-2" />
          Partager
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem
          onClick={() =>
            openShareWindow(
              `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            )
          }
          className="cursor-pointer"
        >
          <Twitter className="h-4 w-4 mr-2 text-sky-500" />
          Partager sur X
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)
          }
          className="cursor-pointer"
        >
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Partager sur Facebook
        </DropdownMenuItem>

        <div className="border-t my-1 mx-2" />

        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <LinkIcon className="h-4 w-4 mr-2" />
          Copier le lien
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
