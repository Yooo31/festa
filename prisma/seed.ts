/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from 'bcryptjs';
import { PrismaClient } from '../lib/generated/prisma/index.js';

const prisma = new PrismaClient();

const users = [
  {
    email: 'chef.alex@test.com',
    username: 'alex_le_chef',
    firstName: 'Alexandre',
    lastName: 'Dubois',
    password: 'password123',
  },
  {
    email: 'baker.sophie@test.com',
    username: 'sophie_patisse',
    firstName: 'Sophie',
    lastName: 'Martin',
    password: 'password123',
  },
  {
    email: 'tester.mark@test.com',
    username: 'mark_tester',
    firstName: 'Marc',
    lastName: 'Tremblay',
    password: 'password123',
  },
];

const difficulties = ['Facile', 'Moyen', 'Difficile'];
const durations = ['Moins de 30 min', '30 min - 1h', 'Plus de 1h'];
const tags = [
  'Végétarien',
  'Sucré',
  'Salé',
  'Rapide',
  'Italien',
  'Asiatique',
  'Petit Déjeuner',
  'Dessert',
];

const recipeData = [
  {
    title: 'Pâtes Carbonara Authentiques',
    description: "La recette originale romaine, sans crème, s'il vous plaît !",
    isPublic: true,
    tags: ['Italien', 'Salé', 'Rapide'],
    ingredients: [
      { name: 'Spaghetti', quantity: '400g' },
      { name: 'Guanciale ou Pancetta', quantity: '150g' },
      { name: "Jaunes d'œufs", quantity: '4' },
      { name: 'Pecorino Romano AOP', quantity: '100g' },
    ],
    steps: [
      { order: 1, content: 'Couper le guanciale en dés et le faire revenir à feu doux.' },
      { order: 2, content: 'Mélanger les jaunes d’œufs et le Pecorino dans un bol.' },
      { order: 3, content: 'Faire cuire les pâtes al dente. Réserver l’eau de cuisson.' },
      {
        order: 4,
        content:
          "Hors du feu, mélanger les pâtes, les œufs/fromage et le guanciale. Ajouter l'eau de cuisson pour la crémosité.",
      },
    ],
    imageUrls: ['image1.jpg'],
  },
  {
    title: 'Tarte aux Fraises Express',
    description: "Un dessert d'été léger et rapide à préparer.",
    isPublic: true,
    tags: ['Sucré', 'Rapide', 'Dessert'],
    ingredients: [
      { name: 'Pâte sablée', quantity: '1' },
      { name: 'Crème pâtissière', quantity: '500g' },
      { name: 'Fraises fraîches', quantity: '500g' },
    ],
    steps: [
      { order: 1, content: 'Cuire la pâte sablée à blanc.' },
      { order: 2, content: 'Étaler la crème pâtissière refroidie sur le fond de tarte.' },
      { order: 3, content: 'Disposer les fraises coupées sur la crème.' },
    ],
    imageUrls: ['image2.jpg'],
  },
  {
    title: 'Curry Végétarien Thaï',
    description: 'Un curry vert riche et parfumé, parfait pour un dîner sain.',
    isPublic: true,
    tags: ['Végétarien', 'Asiatique', 'Moyen'],
    ingredients: [
      { name: 'Pâte de curry vert', quantity: '2 cuillères à soupe' },
      { name: 'Lait de coco', quantity: '400ml' },
      { name: 'Légumes variés', quantity: '500g' },
      { name: 'Riz', quantity: '200g' },
    ],
    steps: [
      { order: 1, content: "Faire revenir la pâte de curry dans un peu d'huile." },
      { order: 2, content: 'Ajouter le lait de coco et les légumes. Laisser mijoter.' },
      { order: 3, content: 'Servir avec du riz.' },
    ],
    imageUrls: ['image3.jpg'],
  },
  {
    title: "Soupe à l'Oignon Gratinée (Privée)",
    description: 'La meilleure soupe pour les soirées froides, mais je la garde secrète !',
    isPublic: false,
    tags: ['Salé', 'Difficile'],
    ingredients: [
      { name: 'Oignons', quantity: '1kg' },
      { name: 'Bouillon de bœuf', quantity: '1.5L' },
      { name: 'Baguette rassie', quantity: '1' },
      { name: 'Gruyère râpé', quantity: '100g' },
    ],
    steps: [
      { order: 1, content: 'Faire caraméliser les oignons lentement (30 min).' },
      { order: 2, content: 'Ajouter le bouillon et laisser mijoter.' },
      { order: 3, content: 'Verser dans des bols, recouvrir de pain et de fromage. Griller.' },
    ],
    imageUrls: ['image4.jpg'],
  },
];

async function seedMetadata() {
  await prisma.difficulty.createMany({
    data: difficulties.map((name) => ({ name })),
    skipDuplicates: true,
  });
  await prisma.duration.createMany({
    data: durations.map((name) => ({ name })),
    skipDuplicates: true,
  });
  await prisma.tag.createMany({
    data: tags.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const allTags = await prisma.tag.findMany();
  const allDifficulties = await prisma.difficulty.findMany();
  const allDurations = await prisma.duration.findMany();

  return { allTags, allDifficulties, allDurations };
}

function generateComplexRecipes(
  authorId: string,
  authorUsername: string,
  allDifficulties: any[],
  allDurations: any[],
  allTags: any[],
) {
  const recipes = [];

  const baseRecipes = [
    ...recipeData,
    {
      title: 'Omelette aux fines herbes',
      description: 'Simple et rapide.',
      isPublic: true,
      tags: ['Rapide', 'Petit Déjeuner'],
      ingredients: [
        { name: 'Œufs', quantity: '3' },
        { name: 'Beurre', quantity: '10g' },
      ],
      steps: [
        { order: 1, content: 'Battre les œufs.' },
        { order: 2, content: 'Cuire à la poêle.' },
      ],
      imageUrls: ['img_oeuf.jpg'],
    },
    {
      title: 'Gâteau au chocolat fondant',
      description: 'Le meilleur gâteau du monde.',
      isPublic: true,
      tags: ['Sucré', 'Dessert', 'Difficile'],
      ingredients: [
        { name: 'Chocolat noir', quantity: '200g' },
        { name: 'Beurre', quantity: '100g' },
      ],
      steps: [{ order: 1, content: 'Faire fondre le chocolat.' }],
      imageUrls: ['img_choc.jpg'],
    },
    {
      title: 'Salade César',
      description: 'Classique et efficace.',
      isPublic: true,
      tags: ['Salé', 'Rapide'],
      ingredients: [
        { name: 'Laitue romaine', quantity: '1' },
        { name: 'Poulet grillé', quantity: '200g' },
      ],
      steps: [
        { order: 1, content: 'Préparer la sauce.' },
        { order: 2, content: 'Mélanger.' },
      ],
      imageUrls: ['img_salade.jpg'],
    },
    {
      title: 'Pizza napolitaine (Private)',
      description: 'Recette familiale secrète.',
      isPublic: false,
      tags: ['Italien', 'Salé'],
      ingredients: [
        { name: 'Pâte à pizza', quantity: '1' },
        { name: 'Tomates', quantity: '4' },
      ],
      steps: [{ order: 1, content: 'Préparer la pâte.' }],
      imageUrls: ['img_pizza.jpg'],
    },
  ];

  for (let i = 0; i < 17; i++) {
    const base = baseRecipes[i % baseRecipes.length];
    const publicStatus = i % 4 !== 0;
    const title = `${base.title} ${i + 1}`;

    const difficulty = allDifficulties[Math.floor(Math.random() * allDifficulties.length)];
    const duration = allDurations[Math.floor(Math.random() * allDurations.length)];

    recipes.push({
      title,
      description: publicStatus ? base.description : 'Recette privée, détails masqués.',
      isPublic: publicStatus,
      authorId: authorId,
      difficultyId: difficulty.id,
      durationId: duration.id,

      ingredients: {
        create: base.ingredients.map((ing) => ({ name: ing.name, quantity: ing.quantity })),
      },
      steps: { create: base.steps },
      images: { create: [{ url: base.imageUrls[0] || 'default.jpg' }] },
      tags: {
        create: base.tags
          .map((tagName) => {
            const tag = allTags.find((t) => t.name === tagName);
            return tag ? { tagId: tag.id } : null;
          })
          .filter((t) => t !== null),
      },
    });
  }

  return recipes;
}

async function main() {
  console.log(`Début du seeding...`);

  await prisma.favorite.deleteMany();
  await prisma.recipeTag.deleteMany();
  await prisma.step.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.image.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
  await prisma.difficulty.deleteMany();
  await prisma.duration.deleteMany();
  await prisma.tag.deleteMany();

  const { allTags, allDifficulties, allDurations } = await seedMetadata();
  console.log('✅ Métadonnées (Tags, Difficultés, Durées) créées.');

  const createdUsers = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash: hashedPassword,
      },
    });
    createdUsers.push(user);
    console.log(`Utilisateur créé: ${user.username}`);
  }

  const allCreatedRecipes = [];
  for (const user of createdUsers) {
    const recipesToCreate = generateComplexRecipes(
      user.id,
      user.username,
      allDifficulties,
      allDurations,
      allTags,
    );

    for (const recipeData of recipesToCreate) {
      const newRecipe = await prisma.recipe.create({
        data: recipeData as any,
        include: { tags: true },
      });
      allCreatedRecipes.push(newRecipe);
    }
    console.log(`Recettes créées pour ${user.username}: ${recipesToCreate.length}`);
  }

  const favoriteRecipes = allCreatedRecipes.filter((r) => r.isPublic).slice(0, 10);
  const mark = createdUsers.find((u) => u.username === 'mark_tester');

  if (mark) {
    await prisma.favorite.createMany({
      data: favoriteRecipes.map((recipe) => ({
        userId: mark.id,
        recipeId: recipe.id,
      })),
      skipDuplicates: true,
    });
    console.log(`✅ ${mark.username} a mis ${favoriteRecipes.length} recettes en favoris.`);
  }

  const recipeToSoftDelete = allCreatedRecipes.find((r) => r.isPublic);
  if (recipeToSoftDelete) {
    await prisma.recipe.update({
      where: { id: recipeToSoftDelete.id },
      data: { deletedAt: new Date() },
    });
    console.log(`✅ Recette ID ${recipeToSoftDelete.id} a été soft-supprimée pour test.`);
  }

  console.log(`\n🎉 Seeding terminé. ${allCreatedRecipes.length} recettes créées.`);
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
