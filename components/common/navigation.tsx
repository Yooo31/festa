'use client';

import Link from 'next/link';
import { Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          FESTA
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profil/favorite">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favoris</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profil">
              <User className="h-5 w-5" />
              <span className="sr-only">Mon compte</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
