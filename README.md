# Festa

Festa est une application Next.js moderne qui s'appuie sur un stack technique robuste : NextAuth pour l'authentification, Supabase pour la gestion des données et la persistance, Prisma pour l'ORM, et Shadcn pour l'UI. Le projet met un point d'honneur à la qualité du code, à une structure claire et à l'utilisation de bonnes pratiques comme le Clean Code, Husky pour les hooks Git, une architecture modulaire, et l'exploitation des Server Components.

## Sommaire

- [Architecture & Organisation](#architecture--organisation)
- [Stack Technique](#stack-technique)
- [Clean Code & Qualité](#clean-code--qualité)
- [Démarrage du projet](#démarrage-du-projet)
- [Scripts Utiles](#scripts-utiles)
- [Conventions & Outils](#conventions--outils)

---

## Architecture & Organisation

### Racine

- `app/` : Point d'entrée Next.js nouvelle génération (App Router), routes, layouts, Server Components.
- `components/` : Composants réutilisables (UI, communs, spécifiques par domaine).
- `lib/` : Fichiers utilitaires, hooks, constantes, logic métier, helpers d'accès à Prisma ou Supabase.
- `prisma/` : Schéma de la base de données Prisma, scripts de seed et migrations.
- `.husky/` : Hooks Git pour garantir la qualité du code (lint, format, test avant commit/push).
- `public/` : Fichiers statiques.
- `Documentation/` : Documentation technique et fonctionnelle.

### Détail des dossiers clés

#### `app/`

- `(auth)/` : Pages et routes liées à l'authentification (NextAuth).
- `api/` : Routes API (Serverless functions Next.js).
- `profil/`, `recipes/`, ... : Routes pages et domaines fonctionnels.
- `provider/` : Fournisseurs de contexte (ex : gestion de thème, auth, etc).
- Fichiers clés : `layout.tsx` (layout global), `error.tsx`, `not-found.tsx`, `page.tsx`.

#### `components/`

- `ui/` : Composants UI de base, souvent issus ou inspirés de Shadcn.
- `common/` : Composants transverses (Header, Footer, boutons custom, etc).
- `recipes/` : Composants spécifiques à la gestion des recettes.

#### `lib/`

- `auth.ts` : Logique d’authentification (NextAuth, adapteurs personnalisés pour Supabase).
- `prisma.ts` : Singleton de connexion Prisma.
- `utils.ts` : Fonctions utilitaires diverses.
- `actions/`, `adapters/`, `constants/`, `hooks/`, `types/`, `validations/` : Modules spécialisés pour actions serveur, adapteurs, constantes globales, hooks custom React, types TypeScript, schémas de validation.

#### `prisma/`

- `schema.prisma` : Schéma principal de la base (définitions des models, relations, etc).
- `migrations/` : Historique des migrations Prisma.
- `seed.ts` : Script de remplissage initial de la base de données.

---

## Stack Technique

- **Next.js** : Framework React fullstack moderne (App Router, Server Components, API Routes).
- **TypeScript** : Typage statique, sécurité et robustesse.
- **NextAuth** : Authentification OAuth/JWT, intégrée à Supabase et Prisma pour la gestion du user.
- **Supabase** : Backend as a Service (auth, base de données PostgreSQL, stockage).
- **Prisma** : ORM moderne, typé, migrations et queries typesafe.
- **Shadcn/UI** : Composants UI réutilisables, stylés avec TailwindCSS.
- **TailwindCSS** : Utilitaire CSS pour le style rapide et cohérent.
- **Husky** : Hooks Git pour automatiser le lint, format, et tests avant commit.
- **ESLint & Prettier** : Pour le linting et le formatage automatique du code.

---

## Clean Code & Qualité

- **Séparation stricte des responsabilités** : Domaines, logique métier, data access, et composants UI sont bien compartimentés.
- **Server Components** : Utilisation des Server Components Next.js pour optimiser les performances et la sécurité côté serveur.
- **Typage fort** : Types TypeScript partout, typage des props, du state, et des retours de fonctions.
- **Hooks custom** : Tous les hooks React spécifiques sont dans `lib/hooks/`.
- **Validations centralisées** : Les schémas de validation sont regroupés dans `lib/validations/`.

---

## Démarrage du projet

1. **Cloner le repo**

   ```bash
   git clone https://github.com/Yooo31/festa.git
   cd festa
   ```

2. **Installer les dépendances**

   ```bash
   pnpm install
   ```

3. **Configurer les variables d'environnement**
   - Copier `.env.example` en `.env` et renseigner les variables (notamment pour Supabase, NextAuth, Prisma).

4. **Générer le client Prisma**

   ```bash
   pnpm prisma:generate
   ```

5. **Lancer les migrations et seed**

   ```bash
   pnpm prisma:migrate
   pnpm seed
   ```

6. **Démarrer le projet**
   ```bash
   pnpm dev
   ```
   Accéder à [http://localhost:3000](http://localhost:3000)

---

## Scripts Utiles

- `pnpm dev` : Démarre le serveur Next.js en mode développement.
- `pnpm build` : Build de production.
- `pnpm start` : Démarre le serveur en mode production.
- `pnpm lint` : Lint le projet avec ESLint.
- `pnpm format` : Format le code via Prettier.
- `pnpm prisma:migrate` : Lance les migrations Prisma.
- `pnpm prisma:generate` : Génère le client Prisma.
- `pnpm seed` : Exécute le script de seed Prisma.
- `pnpm test` : Lance les tests (vitest).

---

## Conventions & Outils

- **Husky** s’occupe de lancer des hooks (pre-commit, pre-push) pour garantir la qualité du code.
- **ESLint** et **Prettier** sont configurés pour appliquer les conventions de code (voir `.eslintrc.cjs` et `.prettierrc`).
- **TypeScript** : Configuration stricte dans `tsconfig.json`.
- **Documentation** : La documentation technique supplémentaire se trouve dans le dossier `Documentation/`.

---

## À retenir

- Architecture moderne, découplée, pensée pour la scalabilité.
- Stack full TypeScript avec sécurité et robustesse.
- Authentification NextAuth & Supabase, ORM Prisma, UI Shadcn/Tailwind.
- Clean code, qualité, automatisation via Husky et outils de lint & format.

---

Pour toute question technique ou contribution, consulte la documentation ou ouvre une issue sur le dépôt GitHub.

---

Nb: À cause des seeds, aucune photo n'a pu être ajoutée aux recettes. Il faut les ajouter manuellement via l'interface utilisateur.
