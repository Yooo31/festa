'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { recipeFormSchema, type RecipeInput } from '@/lib/validations/recipe';
import type { Meta, RecipeForForm } from '@/lib/types/recipe';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, X } from 'lucide-react';
import { ImageDropzone } from '@/components/common/ImageDropzone';

// Suppression de MetaItem et Meta locaux, importés de /lib/types/recipe

interface RecipeFormProps {
  meta: Meta;
  initialData?: RecipeForForm; // 💡 Rendu optionnel pour la création
}

export function RecipeForm({ meta, initialData }: RecipeFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // 💡 Détermine le mode d'opération
  const isEditing = !!initialData?.id;
  const recipeId = initialData?.id;

  // 💡 Définition des valeurs par défaut
  const defaultValues: RecipeInput = initialData
    ? {
        title: initialData.title,
        description: initialData.description,
        difficultyId: initialData.difficultyId,
        durationId: initialData.durationId,
        ingredients: initialData.ingredients.map((i) => ({
          name: i.name,
          quantity: i.quantity || '',
        })),
        steps: initialData.steps.map((s) => ({ content: s.content, order: s.order })),
        tags: initialData.tags,
        images: [{ file: null }],
        isPublic: initialData.isPublic,
      }
    : {
        title: '',
        description: '',
        difficultyId: '',
        durationId: '',
        ingredients: [{ name: '', quantity: '' }],
        steps: [{ content: '', order: 1 }],
        tags: [],
        images: [{ file: null }],
        isPublic: false,
      };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RecipeInput>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: 'ingredients' });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ control, name: 'steps' });

  const selectedTags = watch('tags', []);

  const onSubmit = async (values: RecipeInput) => {
    setSubmitting(true);
    toast.loading(isEditing ? 'Mise à jour en cours...' : 'Publication en cours...');

    try {
      const { images, ...recipeData } = values;
      const imageFile = images?.[0]?.file;
      let imageUrl = '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const json = await uploadRes.json();
          throw new Error(json.error || 'Échec de l’upload de l’image.');
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.filename;
      }

      const payload = {
        ...recipeData,
        steps: recipeData.steps.map((s, idx) => ({ ...s, order: idx + 1 })),
        images: imageUrl ? [imageUrl] : [],
      };

      const apiEndpoint = isEditing ? `/api/recipes/${recipeId}` : '/api/recipes';
      const httpMethod = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(apiEndpoint, {
        method: httpMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      toast.dismiss();
      if (!res.ok) {
        const json = await res.json();
        throw new Error(
          json.error ||
            `Une erreur est survenue lors de la ${isEditing ? 'mise à jour' : 'création'}`,
        );
      }

      toast.success(
        isEditing ? 'Recette mise à jour avec succès ! 💾' : 'Recette publiée avec succès ! 🎉',
      );
      router.push(isEditing ? `/recipes/${recipeId}` : '/profil');
    } catch (err) {
      toast.dismiss();
      toast.error(err instanceof Error ? err.message : 'Erreur serveur inattendue.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (tagId: string) => {
    const currentTags = selectedTags ?? [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];
    setValue('tags', newTags, { shouldValidate: true, shouldDirty: true });
  };

  const getErrorMessage = (error: FieldError | undefined) => (error?.message as string) ?? '';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          {isEditing ? `Modifier la recette` : 'Créer une recette'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditing
            ? 'Mettez à jour les informations de votre recette'
            : 'Partagez votre recette avec la communauté'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Les informations de base de votre recette</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la recette *</Label>
              <Input id="title" placeholder="Ex: Tarte aux pommes maison" {...register('title')} />
              {errors.title && (
                <p className="text-sm text-red-500">{getErrorMessage(errors.title)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre recette..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{getErrorMessage(errors.description)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-dropzone">Photo de la recette</Label>
              <Controller
                control={control}
                name="images.0.file"
                render={({ field, fieldState: { error } }) => (
                  <ImageDropzone
                    onChange={field.onChange}
                    error={getErrorMessage(error)}
                    // initialPreviewUrl={
                    //   isEditing && initialData?.images?.[0]
                    //     ? `/uploads/${initialData.images[0]}`
                    //     : undefined
                    // }
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationId">Temps de préparation *</Label>
                <Controller
                  control={control}
                  name="durationId"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={submitting}
                    >
                      <SelectTrigger id="durationId">
                        <SelectValue placeholder="Choisir" />
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
                  <p className="text-sm text-red-500">{getErrorMessage(errors.durationId)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficultyId">Difficulté *</Label>
                <Controller
                  control={control}
                  name="difficultyId"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={submitting}
                    >
                      <SelectTrigger id="difficultyId">
                        <SelectValue placeholder="Choisir" />
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
                  <p className="text-sm text-red-500">{getErrorMessage(errors.difficultyId)}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 rounded-md border p-3 min-h-[40px]">
                {meta.tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun tag disponible.</p>
                ) : (
                  meta.tags.map((tag) => {
                    const isSelected = (selectedTags ?? []).includes(tag.id);
                    return (
                      <button
                        type="button"
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        aria-pressed={isSelected}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                      >
                        {tag.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingrédients *</CardTitle>
            <CardDescription>Listez tous les ingrédients nécessaires</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <Input
                  placeholder="Nom de l'ingrédient"
                  {...register(`ingredients.${index}.name`)}
                  className="flex-1"
                />
                <Input
                  placeholder="Quantité"
                  {...register(`ingredients.${index}.quantity`)}
                  className="w-40"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.ingredients && typeof errors.ingredients.message === 'string' && (
              <p className="text-sm text-red-500">{errors.ingredients.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendIngredient({ name: '', quantity: '' })}
              className="w-full bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter un ingrédient
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Étapes de préparation *</CardTitle>
            <CardDescription>Décrivez les étapes une par une</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stepFields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                  {index + 1}
                </span>
                <Textarea
                  placeholder={`Étape ${index + 1}`}
                  {...register(`steps.${index}.content`)}
                  rows={2}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeStep(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.steps && typeof errors.steps.message === 'string' && (
              <p className="text-sm text-red-500">{errors.steps.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendStep({ content: '', order: stepFields.length + 1 })}
              className="w-full bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter une étape
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibilité</CardTitle>
            <CardDescription>Choisissez qui peut voir votre recette</CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="isPublic"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public">Recette publique</Label>
                    <p className="text-sm text-muted-foreground">
                      Visible par tous les utilisateurs
                    </p>
                  </div>
                  <Switch id="public" checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
          <Button type="submit" className="flex-1" disabled={submitting || !isValid}>
            {submitting
              ? isEditing
                ? 'Mise à jour...'
                : 'Publication...'
              : isEditing
                ? 'Sauvegarder les modifications'
                : 'Publier la recette'}
          </Button>
        </div>
      </form>
    </div>
  );
}
