'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur Globale (500) :', error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-9xl font-extrabold text-red-600 mb-4">500</h1>
        <h2 className="text-3xl font-semibold tracking-tight mb-4">
          Oups! Quelque chose s&apos;est mal passé.
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Une erreur inattendue est survenue côté serveur ou lors du rendu.
        </p>
        <div className="space-x-4">
          <Button onClick={() => reset()} className="px-6 py-3 font-medium">
            Réessayer
          </Button>
          <Button asChild variant="outline" className="px-6 py-3 font-medium">
            <Link href="/">Accueil</Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
