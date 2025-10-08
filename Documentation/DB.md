# 📘 Prisma — Guide d’utilisation avec Supabase

## 🧱 1. Connexion à la base de données

1. Crée un projet sur Supabase.
2. Copie ton connection string dans `.env` :

```env
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true"
```

_(DIRECT_URL est optionnel mais utile pour accélérer les migrations et le pooling.)_

---

## ⚙️ 2. Initialiser Prisma

Exécute la commande suivante :

```bash
npx prisma init
```

Cela crée :

- un dossier `prisma/`
- un fichier `schema.prisma`
- un fichier `.env`

---

## 🧩 3. Définir un modèle

Exemple simple :

```prisma
model Category {
  id    String  @id @default(cuid())
  name  String  @unique
  recipes Recipe[]
}
```

---

## 🚀 4. Créer une migration

Chaque fois que tu modifies ton `schema.prisma`, crée une migration :

```bash
npx prisma migrate dev --name init
```

Cela :

- crée un dossier `prisma/migrations/`
- applique les changements sur ta base Supabase
- met à jour le client Prisma

---

## 🧰 5. Générer le client

Après chaque migration ou changement de schéma, exécute :

```bash
npx prisma generate
```

Tu peux ensuite utiliser Prisma dans ton code :

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany({
    include: { ingredients: true },
  });
  console.log(recipes);
}

main();
```

---

## 🧩 6. Modifier ou créer une table existante

1. Modifie ton modèle dans `schema.prisma` (ajoute un champ, une relation, etc.).
2. Crée une nouvelle migration :

```bash
npx prisma migrate dev --name add-user-name
```

3. Regénère le client :

```bash
npx prisma generate
```

---

## 🧭 7. Visualiser la base

Lance le studio Prisma :

```bash
npx prisma studio
```

Cela ouvre une interface graphique sur [http://localhost:5555](http://localhost:5555).

Tu peux y ajouter, modifier et supprimer des données directement.

---

## 🔄 8. (Optionnel) Déployer les migrations sur la prod

Quand tu passeras en production, exécute :

```bash
npx prisma migrate deploy
```

---

## 📋 9. Quelques bonnes pratiques

- Ne jamais éditer les fichiers dans `prisma/migrations` à la main.
- Toujours commit ton dossier `prisma/` (il contient l’historique des migrations).
- Garde une cohérence entre tes noms de relations et tes modèles.
- Utilise les `enums` pour les valeurs fixes (ex : niveaux de difficulté).

## 🧭 10. Workflow complet d’exemple — Ajouter les commentaires sur les recettes

### Étape 1 — Ajouter le modèle

Ajoute ce modèle dans ton `schema.prisma` :

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())

  authorId  String
  author    User     @relation(fields: [authorId], references: [id])

  recipeId  String
  recipe    Recipe   @relation(fields: [recipeId], references: [id])
}
```

---

### Étape 2 — Créer la migration

Exécute la commande suivante :

```bash
npx prisma migrate dev --name add-comments
```

Cela va :

- créer la table `Comment` sur Supabase,
- mettre à jour le client Prisma.

---

### Étape 3 — Utiliser dans ton code

Voici un exemple d’utilisation dans ton code :

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer un commentaire
  const comment = await prisma.comment.create({
    data: {
      content: 'Super recette, je l’ai testée hier soir !',
      authorId: 'user_id_existant',
      recipeId: 'recipe_id_existant',
    },
  });

  console.log('Commentaire créé :', comment);

  // Lister les commentaires d’une recette
  const recipeWithComments = await prisma.recipe.findUnique({
    where: { id: 'recipe_id_existant' },
    include: { comments: { include: { author: true } } },
  });

  console.log('Commentaires de la recette :', recipeWithComments?.comments);
}

main();
```

---

### Étape 4 — Visualiser dans Prisma Studio

Lance Prisma Studio :

```bash
npx prisma studio
```

Tu verras les nouvelles tables (`Comment`, `User`, `Recipe`) et leurs relations.

---

## 🔄 11. Déploiement des migrations en production

Lorsque tu déploies ton backend, applique toutes les migrations sur la base de production (sans recréer de nouvelles) :

```bash
npx prisma migrate deploy
```

---

## 📋 12. Bonnes pratiques

- ✅ Toujours nommer clairement les migrations (ex. : `add-user-bio`, `add-comments`, etc.).
- ✅ Commit ton dossier `prisma/` (il contient l’historique complet).
- ✅ Ne modifie jamais les fichiers dans `/migrations` à la main.
- ✅ Lance `npx prisma validate` pour vérifier ton schéma avant de migrer.
- ✅ Si tu veux repartir de zéro :

  ```bash
  npx prisma migrate reset
  ```
