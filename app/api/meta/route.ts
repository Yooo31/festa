import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const difficulties = await prisma.difficulty.findMany();
  const durations = await prisma.duration.findMany();
  const tags = await prisma.tag.findMany();

  return new Response(JSON.stringify({ difficulties, durations, tags }), { status: 200 });
}
