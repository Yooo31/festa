import Link from 'next/link';
import { Navigation } from '@/components/common/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BookOpen, Heart, Settings } from 'lucide-react';
import { RecipeCardCompact } from '@/components/recipes/RecipeCardCompact';
import { mockRecipes } from '@/lib/mock-data';

export default function AccountPage() {
  // Simuler les recettes de l'utilisateur
  const userRecipes = mockRecipes.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Mon compte</h1>
              <p className="text-muted-foreground mt-2">Gérez vos recettes et vos favoris</p>
            </div>
            <Button size="lg" asChild>
              <Link href="/recipes/new">
                <Plus className="h-5 w-5 mr-2" />
                Créer une recette
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes recettes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 ce mois-ci</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoris</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">Recettes sauvegardées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Abonnés</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234</div>
                <p className="text-xs text-muted-foreground">+12 cette semaine</p>
              </CardContent>
            </Card>
          </div>

          {/* User Recipes */}
          <Card>
            <CardHeader>
              <CardTitle>Mes dernières recettes</CardTitle>
              <CardDescription>Les recettes que vous avez créées récemment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRecipes.map((recipe) => (
                  <RecipeCardCompact key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
