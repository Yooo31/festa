# NextAuth Documentation

## 1️⃣ Dépendances

Tu as besoin de :

```bash
pnpm add next-auth @next-auth/prisma-adapter bcryptjs
```

## 2️⃣ Variables d’environnement

Dans `.env` :

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<clé aléatoire, ex: openssl rand -base64 32>
```

## 3️⃣ API NextAuth

Fichier : `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrUsername: { label: 'Email ou Username', type: 'text' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: credentials.emailOrUsername }, { username: credentials.emailOrUsername }],
          },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return { id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## 4️⃣ Login côté client

Fichier : `app/(auth)/login/page.tsx`

Utilise `signIn("credentials", { redirect: false })`.

Ajoute un toast pour succès / erreur et une redirection automatique vers `/`.

## 5️⃣ Logout

Fichier : `app/logout/page.tsx`

```tsx
'use client';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function LogoutPage() {
  useEffect(() => signOut({ callbackUrl: '/' }), []);
  return null;
}
```

## 6️⃣ Middleware pour protéger les pages

Fichier : `middleware.ts`

```typescript
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: ['/((?!_next|favicon.ico|login|register).*)'],
};
```

- Si l'utilisateur n'est pas connecté → redirection automatique vers `/login`.
- Protège toutes les pages sauf `/login`, `/register`, `_next` et `favicon`.

## 7️⃣ Points importants / tips

- `NEXTAUTH_SECRET` est obligatoire pour les JWT, les sessions sécurisées et le déploiement en production.
- Tu peux ajouter un middleware personnalisé pour charger la session et injecter `session.user.id` dans toutes tes pages.
- Pour le frontend, `useSession` de NextAuth permet de récupérer facilement l’utilisateur connecté :

```typescript
import { useSession } from 'next-auth/react';

const { data: session } = useSession();
console.log(session?.user?.id);
```

- Les sessions sont automatiquement invalidées à la déconnexion (`signOut`).
