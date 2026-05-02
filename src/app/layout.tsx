import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { OfferProvider } from '@/contexts/offer-context';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { MaintenanceModal } from '@/components/maintenance-modal';

export const metadata: Metadata = {
  title: 'Studio App',
  description: 'Guia Rápido e Montador de Ofertas para operadores Claro.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AuthProvider>
            <OfferProvider>
              <MaintenanceModal />
              {children}
              <Toaster />
            </OfferProvider>
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
