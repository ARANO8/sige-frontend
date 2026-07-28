import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, Hanken_Grotesk } from 'next/font/google';
import { AuthProvider } from '@/src/contexts/AuthContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-body-inter',
  subsets: ['latin'],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: '--font-headline-hanken',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SIGE ERP - Sistema de Gestión Empresarial',
  description: 'Sistema ERP SaaS Multi-tenant para Manufactura',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${hankenGrotesk.variable}`}
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
