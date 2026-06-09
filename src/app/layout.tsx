import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/lib/theme-engine/ThemeProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col">
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
