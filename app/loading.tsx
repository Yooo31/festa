import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex flex-col items-center justify-center flex-grow p-4">
        <Link href="/" className="select-none">
          <h1 className="text-8xl font-extrabold tracking-tight animate-pulse">FESTA</h1>
        </Link>

        <p className="text-xl text-muted-foreground mt-4 mb-2">Chargement en cours...</p>

        <Progress className="w-2/3 my-6" />
      </main>
    </div>
  );
}
