# 📚 Documentation API – Recipes

## Base URL

`/api/recipes`

### Collection: `/api/recipes`

| Méthode | Description               | Auth requise | Query params                                                             | Réponse                                                    |
| ------- | ------------------------- | ------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------- |
| GET     | Récupère les recettes     | Non          | `user` (optionnel, `userId`), `public` (optionnel : `"all"` / `"false"`) | Liste des recettes filtrées selon les règles de visibilité |
| POST    | Crée une nouvelle recette | ✅ Oui       | –                                                                        | Recette créée                                              |

#### 🔹 GET – Filtrage

- **Sans query params** : toutes les recettes publiques
- `?user={id}` : recettes publiques de cet utilisateur
- `?user={id}&public=all` : toutes les recettes de l’utilisateur connecté (propre compte uniquement)
- `?user={id}&public=false` : recettes privées de l’utilisateur connecté (propre compte uniquement)

#### 🔹 POST – Création

**Corps JSON attendu :**

```json
{
  "title": "Nom de la recette",
  "description": "Description optionnelle",
  "difficultyId": "id_difficulty",
  "durationId": "id_duration",
  "ingredients": [{ "name": "Ingrédient", "quantity": "100g" }],
  "steps": [{ "order": 1, "content": "Faire cuire" }],
  "tags": ["id_tag1", "id_tag2"],
  "isPublic": true
}
```

- `authorId` est automatiquement assigné depuis la session.
- Validation **Zod** appliquée.
- **Réponse** : `201` + objet recette.

---

### Ressource: `/api/recipes/[id]`

| Méthode | Description                     | Auth requise | Réponse                                       |
| ------- | ------------------------------- | ------------ | --------------------------------------------- |
| GET     | Récupère une recette spécifique | Non          | Recette publique ou privée si auteur connecté |
| PATCH   | Met à jour une recette          | ✅ Oui       | Recette mise à jour (seul auteur)             |
| DELETE  | Supprime une recette            | ✅ Oui       | Message de confirmation (seul auteur)         |

#### 🔹 GET – Accès

- **Recette publique** → accessible par tous.
- **Recette privée** → uniquement l’auteur connecté.
- **Non auteur ou non connecté** → `403`.

#### 🔹 PATCH / DELETE – Sécurité

- Vérification de session.
- Vérification que `session.user.id === recipe.authorId`.
- Validation **Zod** pour `PATCH`.

---

### 🔹 Codes de statut

| Code | Signification                                        |
| ---- | ---------------------------------------------------- |
| 200  | Succès                                               |
| 201  | Création réussie                                     |
| 400  | Données invalides (**Zod**)                          |
| 401  | Non connecté / non autorisé                          |
| 403  | Accès refusé / recette privée d’un autre utilisateur |
| 404  | Recette introuvable                                  |
| 500  | Erreur serveur                                       |
