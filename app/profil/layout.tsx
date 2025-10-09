import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, Heart, Plus, BookOpen, Lock, Globe } from 'lucide-react';

export const metadata = {
  title: 'Mon Compte',
  description: 'Gérez votre profil, vos recettes et vos favoris.',
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  const navLinks = [
    { name: 'Favoris', href: '/profil/favorite', icon: Heart },
    { name: 'Créer une recette', href: '/recipes/new', icon: Plus, isExternal: true },
    { name: 'Dernières recettes', href: '/profil#latest', icon: BookOpen },
    { name: 'Recettes publiques', href: '/profil#public', icon: Globe },
    { name: 'Recettes privées', href: '/profil#private', icon: Lock },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 shrink-0">
          <Card className="shadow-lg">
            <CardContent className="p-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Button
                    key={link.name}
                    variant="ghost"
                    className="w-full justify-start text-base"
                    asChild
                  >
                    <Link href={link.href}>
                      <Icon className="h-4 w-4 mr-3" />
                      {link.name}
                    </Link>
                  </Button>
                );
              })}

              <div className="pt-2 border-t mt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base text-red-600 hover:text-red-700"
                  asChild
                >
                  <Link href="/logout">
                    <LogOut className="h-4 w-4 mr-3" />
                    Déconnexion
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
