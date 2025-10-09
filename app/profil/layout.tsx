import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Mon Compte',
  description: 'Gérez votre profil, vos recettes et vos favoris.',
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/account');
  }

  return <div className="account-layout">{children}</div>;
}
