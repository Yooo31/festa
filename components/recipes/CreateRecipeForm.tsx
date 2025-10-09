'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { recipeSchema, type RecipeInput } from '@/lib/validations/recipe';

// Composants UI
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { XIcon, PlusIcon } from 'lucide-react';

/**
 * CreateRecipeForm
 * Formulaire de création de recette
 */

type MetaItem = { id: string; name: string };
type Meta = {
  difficulties: MetaItem[];
  durations: MetaItem[];
  tags: MetaItem[];
};

const defaultMeta: Meta = {
  difficulties: [],
  durations: [],
  tags: [],
};

export default function CreateRecipeForm() {
  const router = useRouter();

  const [meta, setMeta] = useState<Meta>(defaultMeta);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Initialisation de react-hook-form
  const form = useForm<RecipeInput>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      description: '',
      difficultyId: '',
      durationId: '',
      ingredients: [{ name: '', quantity: '' }],
      steps: [{ content: '', order: 1 }], // order est requis par le schéma mais sera recalculé
      tags: [],
      images: [],
      isPublic: false,
    },
    mode: 'onChange',
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = form;

  // useFieldArray pour les listes dynamiques
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: 'steps',
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'images',
  });

  // Watch pour la sélection des tags afin de forcer le re-render
  // (Sinon, le style `checked` des boutons de tags ne s'actualise pas toujours)
  const selectedTags = watch('tags');

  // Récupération des données meta (difficultés, durées, tags)
  useEffect(() => {
    const fetchMeta = async () => {
      setLoadingMeta(true);
      try {
        const res = await fetch('/api/meta');
        if (!res.ok) throw new Error('Impossible de charger les données de configuration');
        const data = await res.json();
        setMeta({
          difficulties: data.difficulties ?? [],
          durations: data.durations ?? [],
          tags: data.tags ?? [],
        });
      } catch (err) {
        console.error('meta fetch failed, fallback to empty arrays', err);
        setMeta(defaultMeta);
        toast.error('Échec du chargement des options (difficulté, durée, tags).');
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, []); // Exécuté une seule fois au montage

  // Fonction pour basculer la sélection d'un tag
  const toggleTag = (tagId: string) => {
    const currentTags = selectedTags ?? [];
    if (currentTags.includes(tagId)) {
      setValue(
        'tags',
        currentTags.filter((id) => id !== tagId),
        { shouldValidate: true, shouldDirty: true },
      );
    } else {
      setValue('tags', [...currentTags, tagId], { shouldValidate: true, shouldDirty: true });
    }
  };

  // Gestionnaire de soumission
  const onSubmit = async (values: RecipeInput) => {
    setSubmitting(true);
    try {
      // 1. Assurer que les étapes ont le bon ordre (important pour le backend/schéma)
      const stepsWithOrder = values.steps.map((s, idx) => ({ ...s, order: idx + 1 }));

      // 2. Préparer le payload
      const payload: RecipeInput = {
        ...values,
        ingredients: values.ingredients.map((ing) => ({
          name: ing.name,
          quantity: ing.quantity || undefined, // Envoyer undefined si vide pour la cohérence
        })),
        steps: stepsWithOrder,
        tags: values.tags ?? [],
        images: values.images ?? [],
        isPublic: values.isPublic ?? false,
      };

      // 3. Appel API
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        // Gérer les erreurs de validation Zod ou autres erreurs du backend
        if (json?.error && typeof json.error === 'object') {
          toast.error('Données invalides. Vérifie les champs marqués.');
        } else {
          const msg =
            (json?.error && typeof json.error === 'string' && json.error) ||
            'Erreur lors de la création';
          toast.error(msg);
        }
        return;
      }

      // Succès
      toast.success('Recette créée avec succès ! 🎉');
      reset();
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Erreur serveur inattendue.');
    } finally {
      setSubmitting(false);
    }
  };

  // Fonction utilitaire pour l'affichage des erreurs de RHF
  const getErrorMessage = (error: FieldError | undefined) => (error?.message as string) ?? '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Informations Principales */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Informations de base</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Titre de la recette"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-red-500 mt-1">
                {getErrorMessage(errors.title)}
              </p>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-1">
            <Label htmlFor="difficultyId">Difficulté *</Label>
            <Controller
              control={control}
              name="difficultyId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loadingMeta || meta.difficulties.length === 0}
                >
                  <SelectTrigger id="difficultyId" aria-invalid={!!errors.difficultyId}>
                    <SelectValue
                      placeholder={loadingMeta ? 'Chargement...' : 'Choisir une difficulté'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {meta.difficulties.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.difficultyId && (
              <p id="difficultyId-error" className="text-sm text-red-500 mt-1">
                {getErrorMessage(errors.difficultyId)}
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <Label htmlFor="durationId">Durée *</Label>
            <Controller
              control={control}
              name="durationId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loadingMeta || meta.durations.length === 0}
                >
                  <SelectTrigger id="durationId" aria-invalid={!!errors.durationId}>
                    <SelectValue
                      placeholder={loadingMeta ? 'Chargement...' : 'Choisir une durée'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {meta.durations.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.durationId && (
              <p id="durationId-error" className="text-sm text-red-500 mt-1">
                {getErrorMessage(errors.durationId)}
              </p>
            )}
          </div>

          {/* Public switch */}
          <div className="flex items-center gap-4 pt-6 md:pt-1">
            <Label htmlFor="isPublic">Publique</Label>
            <Controller
              control={control}
              name="isPublic"
              render={({ field }) => (
                <Switch
                  id="isPublic"
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(Boolean(v))}
                  aria-checked={!!field.value}
                />
              )}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1 pt-4">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Décrivez la recette en quelques lignes..."
            rows={5}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <p id="description-error" className="text-sm text-red-500 mt-1">
              {getErrorMessage(errors.description)}
            </p>
          )}
        </div>
      </Card>

      {/* Ingrédients */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Ingrédients *</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => appendIngredient({ name: '', quantity: '' })}
            size="sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Ajouter un ingrédient
          </Button>
        </div>

        {ingredientFields.map((field, idx) => (
          <div key={field.id} className="grid grid-cols-6 gap-3 items-start">
            <div className="col-span-3 space-y-1">
              <Input
                {...register(`ingredients.${idx}.name` as const)}
                placeholder="Nom de l'ingrédient (ex: Farine)"
                aria-invalid={!!errors.ingredients?.[idx]?.name}
              />
              {errors.ingredients?.[idx]?.name && (
                <p className="text-xs text-red-500">
                  {getErrorMessage(errors.ingredients?.[idx]?.name as FieldError)}
                </p>
              )}
            </div>
            <div className="col-span-2 space-y-1">
              <Input
                {...register(`ingredients.${idx}.quantity` as const)}
                placeholder="Quantité (ex: 100g)"
              />
            </div>
            <div className="col-span-1 flex justify-end">
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => removeIngredient(idx)}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {/* Message d'erreur pour le tableau entier (ex: si vide) */}
        {typeof errors.ingredients?.message === 'string' && (
          <p className="text-sm text-red-500 mt-2">{errors.ingredients.message}</p>
        )}
      </Card>

      {/* Étapes */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Étapes *</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => appendStep({ content: '', order: stepFields.length + 1 })}
            size="sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Ajouter une étape
          </Button>
        </div>

        {stepFields.map((field, idx) => (
          <div key={field.id} className="grid grid-cols-12 gap-3 items-start">
            <div className="col-span-1 text-sm pt-2 font-semibold flex-shrink-0">{idx + 1}.</div>
            <div className="col-span-10 space-y-1">
              <Textarea
                {...register(`steps.${idx}.content` as const)}
                placeholder={`Détails de l'étape ${idx + 1}...`}
                rows={2}
                aria-invalid={!!errors.steps?.[idx]?.content}
              />
              {errors.steps?.[idx]?.content && (
                <p className="text-xs text-red-500">
                  {getErrorMessage(errors.steps?.[idx]?.content as FieldError)}
                </p>
              )}
            </div>
            <div className="col-span-1 flex justify-end pt-0.5">
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => removeStep(idx)}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {/* Message d'erreur pour le tableau entier (ex: si vide) */}
        {typeof errors.steps?.message === 'string' && (
          <p className="text-sm text-red-500 mt-2">{errors.steps.message}</p>
        )}
      </Card>

      {/* Tags */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-3">Tags (Optionnel)</h3>
        <div className="flex flex-wrap gap-2">
          {loadingMeta ? (
            <div className="text-sm text-muted-foreground">Chargement des tags...</div>
          ) : meta.tags.length === 0 ? (
            <div className="text-sm text-muted-foreground">Aucun tag disponible</div>
          ) : (
            meta.tags.map((t) => {
              const isSelected = selectedTags?.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-input'
                  }`}
                >
                  {t.name}
                </button>
              );
            })
          )}
        </div>
      </Card>

      {/* Images (URLs) */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Images (URLs) - Optionnel</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => appendImage({ url: '' })}
            size="sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Ajouter une image
          </Button>
        </div>

        {imageFields.map((field, idx) => (
          <div key={field.id} className="flex gap-3 items-start">
            <div className="flex-grow space-y-1">
              <Input
                {...register(`images.${idx}.url` as const)}
                placeholder="URL de l'image (https://...)"
                aria-invalid={!!errors.images?.[idx]?.url}
              />
              {errors.images?.[idx]?.url && (
                <p className="text-xs text-red-500">
                  {getErrorMessage(errors.images?.[idx]?.url as FieldError)}
                </p>
              )}
            </div>
            <Button
              variant="destructive"
              size="icon"
              type="button"
              onClick={() => removeImage(idx)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {/* Message d'erreur pour le tableau entier */}
        {typeof errors.images?.message === 'string' && (
          <p className="text-sm text-red-500 mt-2">{errors.images.message}</p>
        )}
      </Card>

      {/* Bouton de soumission */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={submitting || !isValid || loadingMeta}
          className="w-full sm:w-auto"
        >
          {submitting ? 'Création en cours...' : 'Créer la recette'}
        </Button>
      </div>
    </form>
  );
}
