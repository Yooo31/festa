# Perspectives d'Amélioration et ToDo

Ce document liste les évolutions envisagées pour rendre l'application Festa plus riche, scalable, maintenable et agréable à utiliser, tant pour les utilisateurs finaux que pour les développeurs.

---

## Fonctionnalités à développer

- **Pagination sur la liste des recettes**
  - Implémenter un système de pagination côté backend (API) et côté frontend pour améliorer la performance et l’UX lors de la navigation sur de grandes listes de recettes.

- **Système de notation et/ou commentaires sur les recettes**
  - Permettre aux utilisateurs de noter les recettes (ex : 1 à 5 étoiles).
  - Ajouter la possibilité de laisser des commentaires publics sous chaque recette.

- **Profil utilisateur enrichi**
  - Créer une page profil utilisateur affichant ses informations, sa photo, et la liste de ses recettes publiées.
  - Permettre à l’utilisateur de modifier ses informations, dont sa photo de profil.

- **Système d’abonnement entre utilisateurs**
  - Permettre à un utilisateur de s’abonner à d’autres pour suivre leurs nouvelles recettes.
  - Ajouter un flux personnalisé (ex : "Recettes de mes abonnements").

---

## Refactoring & Qualité du code

- **Découpage des composants**
  - Identifier les composants trop volumineux ou peu réutilisables, et les scinder en sous-composants logiques.
  - S’assurer que chaque composant respecte le principe de responsabilité unique.

- **Réorganisation de l’arborescence**
  - Déplacer certains fichiers pour mieux respecter la séparation des domaines (ex : remettre les composants spécifiques à une feature dans un dossier dédié).
  - Adopter une structure scalable, inspirée de l’architecture "feature-based" ou "domain-driven".

- **Ajout de tests**
  - Introduire des tests unitaires sur les fonctions critiques et les composants clés (ex : logique métier, hooks, composants UI complexes).
  - Mettre en place des tests E2E pour les parcours utilisateurs principaux (authentification, ajout de recette, interaction avec une recette, etc).
  - Automatiser les tests dans la CI.

---

## Bugs & Points techniques à régler

- **Uploads de photos en build**
  - Résoudre les problèmes d’upload de photos en environnement build (production).
  - Vérifier la gestion des chemins d’accès, des droits d’écriture/lecture sur le stockage (Supabase ou autre), et le comportement du code côté Server Components/Client Components.
  - Ajouter des logs ou une gestion d’erreur utilisateur claire lors d’un échec d’upload.

---

## Autres pistes d’amélioration

- Ajouter des notifications pour informer l’utilisateur lorsqu’une de ses recettes est commentée ou notée.
- Mettre en place un système de recherche avancée (par ingrédient, type de plat, etc).
- Proposer des suggestions de recettes personnalisées.
- Améliorer l’accessibilité (a11y) et l’expérience mobile.

---

N’hésitez pas à compléter ce ToDo lors de vos contributions, ou à ouvrir des issues pour discuter des priorités et des solutions techniques envisagées.
