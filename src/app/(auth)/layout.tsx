import type { ReactNode } from 'react';
import { ParticleCanvas } from '@/components/theme/ParticleCanvas';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0d0118 0%, #1a0533 50%, #0d0118 100%)',
        padding: '24px',
      }}
    >
      <ParticleCanvas species="cat" count={30} />
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>
        {children}
      </div>
    </div>
  );
}
