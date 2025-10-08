'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterSchema } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterSchema) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Erreur inconnue');

      toast.success('Compte créé avec succès !');
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Erreur serveur');
      } else {
        toast.error('Erreur inconnue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Créer un compte</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Prénom" {...register('firstName')} />

        <Input placeholder="Nom" {...register('lastName')} />

        <Input placeholder="Nom d'utilisateur" {...register('username')} />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <Input placeholder="Email" type="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <Input placeholder="Mot de passe" type="password" {...register('password')} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Création...' : 'Créer le compte'}
        </Button>
      </form>

      {message && <p className="text-center text-sm mt-4">{message}</p>}
    </div>
  );
}
