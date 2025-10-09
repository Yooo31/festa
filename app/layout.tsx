import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import './globals.css';

import { getServerSession } from 'next-auth';
import AuthProvider from '@/app/provider/AuthProvider';
import { Navigation } from '@/components/common/Navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | FESTA Recettes',
    default: 'FESTA - Découvrez des recettes délicieuses',
  },
  description: 'Partagez et découvrez les meilleures recettes de cuisine.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <AuthProvider session={session}>
          <Navigation />

          <main className="flex-grow">{children}</main>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
