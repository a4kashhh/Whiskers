'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { PET_THEMES } from '@/lib/theme-engine/themes';
import { ParticleCanvas } from '@/components/theme/ParticleCanvas';
import { PetSprite } from '@/components/pet-sprite';
import { getPets } from '@/lib/pets';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';

const SPECIES_TO_SPRITE: Record<string, string> = {
  cat:    'kebo',
  dog:    'boba',
  panda:  'pixel-panda',
  fox:    'noir-webling',
  dragon: 'cosmo',
  bunny:  'scoop',
};

function getPetSpritesheet(species: string): string {
  const allPets = getPets();
  const slug = SPECIES_TO_SPRITE[species];
  const found = allPets.find((p) => p.slug === slug);
  return found?.spritesheetPath ?? allPets[0]?.spritesheetPath ?? '';
}

function Bubble({ size, x, y, delay = 0, color }: { size: number, x: string, y: string, delay?: number, color: string }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1.5px solid ${color}40`,
        background: `${color}10`,
        boxShadow: `inset -3px -3px 8px ${color}20, 0 0 15px ${color}10`,
        display: 'flex',
      }}
      animate={{
        y: [0, -15, 0],
        x: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '30%',
        height: '30%',
        borderRadius: '50%',
        background: `${color}60`,
        filter: 'blur(2px)'
      }} />
    </motion.div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const theme = PET_THEMES['cat']; // default theme for auth layout

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      position: 'relative',
      background: '#050505',
      color: '#F7FAFC',
      overflow: 'hidden'
    }}>
      
      {/* Background Particles */}
      <ParticleCanvas species="cat" count={25} />

      {/* Navbar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '30px 60px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Logo size={42} />
        </Link>
      </header>

      {/* Main Content Split Layout */}
      <main style={{
        display: 'flex',
        flex: 1,
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Left Visual Section */}
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* Big Dark Blob */}
          <motion.div 
            animate={{
              boxShadow: `0 0 80px ${theme.glowColor}`
            }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              left: '-10%',
              top: '5%',
              width: '120%',
              height: '110%',
              background: '#121212',
              border: `1px solid ${theme.primaryColor}20`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              zIndex: 0
            }} 
          />

          {/* Dynamic Bubbles */}
          <Bubble size={30} x="10%" y="20%" delay={0} color={theme.primaryColor} />
          <Bubble size={45} x="18%" y="45%" delay={1} color={theme.accentColor} />
          <Bubble size={60} x="20%" y="70%" delay={2.5} color={theme.primaryColor} />
          <Bubble size={25} x="12%" y="80%" delay={1.5} color={theme.secondaryColor} />
          <Bubble size={40} x="45%" y="30%" delay={0.5} color={theme.primaryColor} />
          <Bubble size={70} x="40%" y="65%" delay={3} color={theme.accentColor} />
          <Bubble size={35} x="65%" y="50%" delay={2} color={theme.secondaryColor} />
          <Bubble size={25} x="60%" y="75%" delay={0.8} color={theme.primaryColor} />

          {/* Floating Pet Character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -20, 0] }}
            transition={{ 
              opacity: { duration: 0.5 },
              scale: { type: "spring", stiffness: 200, damping: 15 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ 
              position: 'relative', 
              zIndex: 10, 
              filter: `drop-shadow(0 0 40px ${theme.glowColor})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '280px',
              height: '280px'
            }}
          >
            <PetSprite
              src={getPetSpritesheet('cat')}
              cycleStates
              cycleIntervalMs={1200}
              scale={1.2}
              label={theme.name}
            />
          </motion.div>
        </div>

        {/* Right Form Section */}
        <div style={{
          flex: 1.1,
          padding: '40px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          background: 'rgba(5,5,5,0.6)',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ width: '100%', maxWidth: '440px' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
