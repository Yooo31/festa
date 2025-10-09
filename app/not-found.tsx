import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page non trouvée',
  description: 'Partagez votre propre recette de cuisine avec la communauté FESTA.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="flex flex-col items-center justify-center flex-grow p-4 text-center">
        <h1 className="text-9xl font-extrabold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold tracking-tight mb-4">Page Introuvable</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/" passHref>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
            Retourner à l&apos;accueil
          </button>
        </Link>
      </section>
    </div>
  );
}
