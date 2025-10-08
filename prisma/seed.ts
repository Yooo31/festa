import { PrismaClient } from '../lib/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  const difficulties = ['Très facile', 'Facile', 'Moyen', 'Difficile', 'Expert'];
  const durations = ['<15 min', '15-30 min', '30-60 min', '>1h'];
  const tags = ['Entrée', 'Plat', 'Dessert', 'Végétarien', 'Vegan', 'Rapide'];

  for (const name of difficulties)
    await prisma.difficulty.upsert({ where: { name }, update: {}, create: { name } });

  for (const name of durations)
    await prisma.duration.upsert({ where: { name }, update: {}, create: { name } });

  for (const name of tags)
    await prisma.tag.upsert({ where: { name }, update: {}, create: { name } });

  console.log('🌱 Seed terminé');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
