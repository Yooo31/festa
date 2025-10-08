import { RecipeList } from '@/components/recipes/RecipeList';

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Recettes publiées</h1>
      <RecipeList />
    </main>
  );
}
