import { PrismaClient } from '@/lib/generated/prisma';
import { registerSchema } from '@/lib/validations/auth';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Données invalides', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { firstName, lastName, username, email, password } = parsed.data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email ou nom d'utilisateur déjà utilisé" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { firstName, lastName, username, email, passwordHash },
    });

    return NextResponse.json({ message: 'Utilisateur créé avec succès' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
