import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/lib/theme-engine/ThemeProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { AnimalBackground } from '@/components/theme/AnimalBackground';
export const metadata: Metadata = {
  title: {
    default: 'Whiskers — Your Personal Pet Universe',
    template: '%s | Whiskers',
  },
  description:
    'Adopt a virtual pet and manage every aspect of their digital life in your own personalized universe.',
  keywords: ['virtual pet', 'pet simulator', 'AI companion', 'gamified pet'],
  openGraph: {
    title: 'Whiskers — Your Personal Pet Universe',
    description: 'Adopt, raise, and bond with your virtual pet in a stunning animated universe.',
    type: 'website',
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Whiskers' },
};

export const viewport: Viewport = {
  themeColor: '#0c0a0e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="app-container">
          <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
        </div>
      </body>
    </html>
  );
}
