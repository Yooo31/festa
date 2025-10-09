'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageDropzoneProps {
  onChange: (file: File | null) => void;
  error: string | undefined;
}

export function ImageDropzone({ onChange, error }: ImageDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onChange(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : error
              ? 'border-destructive bg-destructive/10'
              : 'border-border hover:border-muted-foreground'
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative w-full h-48">
            <img
              src={preview}
              alt="Aperçu de l'image"
              className="object-cover w-full h-full rounded-md"
              onLoad={() => {}}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={handleRemove}
              aria-label="Supprimer l'image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <Image className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="font-medium">
              {isDragActive
                ? 'Relâchez ici'
                : 'Glisser & déposer ou cliquer pour sélectionner une image (PNG, JPG)'}
            </p>
            <p className="text-sm text-muted-foreground">Taille max : 5MB (exemple)</p>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
