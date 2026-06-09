'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { ParticleCanvas } from '@/components/theme/ParticleCanvas';
import { usePetStore } from '@/stores/usePetStore';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, appUser, loading, initialized } = useAuthStore();
  const pet = usePetStore((s) => s.pet);

  useEffect(() => {
    if (initialized && !loading) {
      if (!user) {
        const nextUrl = window.location.pathname + window.location.search;
        router.push(`/login?redirect=${encodeURIComponent(nextUrl)}`);
      } else if (appUser && !appUser.activePetId) {
        const search = window.location.search;
        router.push(`/onboarding${search}`);
      }
    }
  }, [user, appUser, loading, initialized, router]);

  if (loading || !initialized) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: 48 }}
        >
          🐾
        </motion.div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading your universe...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Background particles */}
      {pet && <ParticleCanvas species={pet.species} count={10} />}

      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div
        className="main-content"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          marginLeft: 260,
        }}
      >
        <TopBar />
        <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
