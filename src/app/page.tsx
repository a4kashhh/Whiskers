import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import LandingClient from '@/components/landing/LandingClient';

export const metadata: Metadata = {
  title: 'PetVerse — Your Personal Pet Universe',
  description: 'Adopt a virtual pet and manage every aspect of their digital life in a stunning AI-powered universe.',
};

export default function HomePage() {
  return <LandingClient />;
}
