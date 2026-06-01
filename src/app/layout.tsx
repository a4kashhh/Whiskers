import type { Metadata, Viewport } from 'next';
import { Outfit, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/lib/theme-engine/ThemeProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PetVerse — Your Personal Pet Universe',
    template: '%s | PetVerse',
  },
  description:
    'Adopt a virtual pet and manage every aspect of their digital life in your own personalized universe. A premium AI-powered gamified pet companion experience.',
  keywords: ['virtual pet', 'pet simulator', 'AI companion', 'gamified pet', 'tamagotchi'],
  openGraph: {
    title: 'PetVerse — Your Personal Pet Universe',
    description: 'Adopt, raise, and bond with your virtual pet in a stunning animated universe.',
    type: 'website',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PetVerse',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a0533',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
