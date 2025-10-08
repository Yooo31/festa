'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      emailOrUsername,
      password,
    });

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success('Connecté !');
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Se connecter</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Email ou Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
        />
        <Input
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  );
}
