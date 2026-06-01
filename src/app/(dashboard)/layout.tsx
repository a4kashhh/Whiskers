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
  const { user, loading, initialized } = useAuthStore();
  const pet = usePetStore((s) => s.pet);

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.push('/login');
    }
    if (initialized && !loading && user && !pet) {
      // Check if user needs to onboard
    }
  }, [user, loading, initialized, pet, router]);

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background particles */}
      {pet && <ParticleCanvas species={pet.species} count={12} />}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          marginLeft: 280,
        }}
        className="main-content"
      >
        <TopBar />
        <main
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
