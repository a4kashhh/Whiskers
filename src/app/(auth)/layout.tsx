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
        {/* Full-Screen Landscape Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden'
        }}>
          {/* Sky & Stars */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, #030712 0%, #0F172A 70%, #1E293B 100%)',
            zIndex: 0
          }}>
            <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', opacity: 0.6 }}>
              <defs>
                <pattern id="stars" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1.5" fill="#FFF" opacity="0.8" />
                  <circle cx="80" cy="90" r="1" fill="#FFF" opacity="0.4" />
                  <circle cx="150" cy="40" r="2" fill="#FFFBEB" opacity="0.9" />
                  <circle cx="50" cy="150" r="1" fill="#FFF" opacity="0.5" />
                  <circle cx="180" cy="120" r="1.5" fill="#E2E8F0" opacity="0.7" />
                  <circle cx="110" cy="180" r="1" fill="#FFF" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#stars)" />
            </svg>
          </div>
          
          {/* Moon & Glow */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '20%',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #FFFBEB 0%, #FDE68A 100%)',
            boxShadow: `0 0 100px #FDE68A60, 0 0 200px ${theme.primaryColor}40`,
            zIndex: 1
          }}>
            {/* Craters */}
            <div style={{ position: 'absolute', top: '20%', left: '40%', width: 30, height: 20, borderRadius: '50%', background: '#00000015' }} />
            <div style={{ position: 'absolute', top: '50%', left: '20%', width: 20, height: 15, borderRadius: '50%', background: '#00000015' }} />
            <div style={{ position: 'absolute', top: '60%', left: '60%', width: 40, height: 25, borderRadius: '50%', background: '#00000015' }} />
          </div>

          {/* Background Mountains (Slow Parallax) */}
          <svg viewBox="0 0 1000 1000" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 2 }}>
            <motion.g animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }}>
              {[0, 1000].map(offsetX => (
                <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
                  <path d="M0,600 Q150,400 300,550 T700,450 T1000,600 L1000,1000 L0,1000 Z" fill="#0B1120" />
                  <path d="M0,650 Q200,500 400,650 T800,550 T1000,650 L1000,1000 L0,1000 Z" fill="#0F172A" />
                </g>
              ))}
            </motion.g>
          </svg>

          {/* Midground Trees & Fog (Medium Parallax) */}
          <svg viewBox="0 0 1000 1000" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 3 }}>
            <motion.g animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 35, ease: "linear" }}>
              {[0, 1000].map(offsetX => (
                <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
                  {/* Rolling Midground Hills */}
                  <path d="M0,750 Q250,700 500,750 T1000,720 L1000,1000 L0,1000 Z" fill="#152033" />
                  
                  {/* Distant Forest silhouettes */}
                  <g fill="#0F1524" opacity="0.8">
                    <polygon points="100,750 120,650 140,750" />
                    <polygon points="130,750 150,680 170,750" />
                    <polygon points="250,730 270,640 290,730" />
                    <polygon points="280,740 310,610 340,740" />
                    <polygon points="600,760 620,660 640,760" />
                    <polygon points="800,740 830,620 860,740" />
                  </g>
                </g>
              ))}
            </motion.g>
          </svg>

          {/* Foreground (Fast Parallax, Highway & Nature Combined) */}
          <svg viewBox="0 0 1000 1000" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 4 }}>
            <defs>
              {/* Grass Pattern */}
              <pattern id="grass" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <rect width="60" height="60" fill="#152618" />
                <path d="M10,60 Q12,50 15,60 Z" fill={theme.primaryColor} opacity="0.3" />
                <path d="M30,60 Q34,45 38,60 Z" fill={theme.secondaryColor} opacity="0.2" />
                <path d="M50,60 Q48,55 45,60 Z" fill={theme.primaryColor} opacity="0.4" />
              </pattern>
              
              <linearGradient id="lightBeam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="asphaltGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A1F2B" />
                <stop offset="100%" stopColor="#0B0D14" />
              </linearGradient>
            </defs>

            <motion.g animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }}>
              {[0, 1000].map(offsetX => (
                <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
                  
                  {/* Massive Grassy Rolling Hills */}
                  <path d="M0,780 Q250,680 500,760 T1000,720 L1000,900 L0,900 Z" fill="url(#grass)" />
                  
                  {/* Detailed Tree 1 (Planted firmly on grass) */}
                  <g transform="translate(150, 580)">
                    <path d="M25,0 L50,60 L40,60 L60,110 L35,110 L50,160 L0,160 L15,110 L-10,110 L10,60 L0,60 Z" fill="#192A1D" />
                    <path d="M25,0 L50,60 L40,60 L60,110 L35,110 L50,160 L25,160 L25,0 Z" fill={theme.primaryColor} opacity="0.25" />
                    <rect x="20" y="150" width="10" height="50" fill="#241812" />
                  </g>

                  {/* Detailed Tree 2 (Planted firmly on grass) */}
                  <g transform="translate(420, 630) scale(0.8)">
                    <path d="M25,0 L50,60 L40,60 L60,110 L35,110 L50,160 L0,160 L15,110 L-10,110 L10,60 L0,60 Z" fill="#142117" />
                    <path d="M25,0 L50,60 L40,60 L60,110 L35,110 L50,160 L25,160 L25,0 Z" fill={theme.secondaryColor} opacity="0.2" />
                    <rect x="20" y="150" width="10" height="50" fill="#1E140F" />
                  </g>

                  {/* Bush */}
                  <path d="M280,750 Q300,710 320,750 Q340,720 360,750 Q380,730 400,750 Z" fill="#101D13" />

                  {/* The Asphalt Highway in front of the grass */}
                  <rect x="0" y="890" width="1000" height="110" fill="url(#asphaltGrad)" />
                  
                  {/* Road Edge Lines */}
                  <line x1="0" y1="900" x2="1000" y2="900" stroke="#334155" strokeWidth="4" opacity="0.6" />
                  <line x1="0" y1="990" x2="1000" y2="990" stroke="#334155" strokeWidth="4" opacity="0.6" />

                  {/* White Dashed Center Lines */}
                  <line x1="0" y1="945" x2="1000" y2="945" stroke="#F8FAFC" strokeWidth="10" strokeDasharray="80, 120" />
                  
                  {/* Streetlight 1 */}
                  <g transform="translate(150, 600)">
                    <rect x="0" y="0" width="10" height="290" fill="#05070A" />
                    <path d="M0,20 Q50,-10 100,10 L100,20 Q50,0 10,30 Z" fill="#05070A" />
                    <rect x="80" y="5" width="25" height="12" rx="4" fill="#1E293B" />
                    <ellipse cx="92" cy="17" rx="10" ry="5" fill="#FEF08A" />
                    <polygon points="80,17 105,17 180,290 -30,290" fill="url(#lightBeam)" opacity="0.6" />
                    <ellipse cx="75" cy="345" rx="120" ry="25" fill="#FEF08A" opacity="0.15" />
                  </g>

                  {/* Streetlight 2 */}
                  <g transform="translate(650, 600)">
                    <rect x="0" y="0" width="10" height="290" fill="#05070A" />
                    <path d="M0,20 Q50,-10 100,10 L100,20 Q50,0 10,30 Z" fill="#05070A" />
                    <rect x="80" y="5" width="25" height="12" rx="4" fill="#1E293B" />
                    <ellipse cx="92" cy="17" rx="10" ry="5" fill="#FEF08A" />
                    <polygon points="80,17 105,17 180,290 -30,290" fill="url(#lightBeam)" opacity="0.6" />
                    <ellipse cx="75" cy="345" rx="120" ry="25" fill="#FEF08A" opacity="0.15" />
                  </g>

                </g>
              ))}
            </motion.g>
          </svg>

          {/* Running Pet Character 1 (Cat) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
            transition={{ 
              opacity: { duration: 0.8 },
              x: { type: "spring", stiffness: 100, damping: 15 },
              y: { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ 
              position: 'absolute',
              bottom: '5%',
              left: '20%',
              zIndex: 10, 
              filter: `drop-shadow(0 15px 25px #000000) drop-shadow(0 0 40px ${theme.glowColor})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '320px',
              height: '320px'
            }}
          >
            <PetSprite
              src={getPetSpritesheet('cat')}
              state="running-right"
              scale={1.5}
              label={theme.name}
            />
          </motion.div>

          {/* Running Pet Character 2 (Dog) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
            transition={{ 
              opacity: { duration: 0.8 },
              x: { type: "spring", stiffness: 100, damping: 15, delay: 0.15 },
              y: { duration: 0.38, repeat: Infinity, ease: "easeInOut", delay: 0.1 } // slightly offset bounce for variety
            }}
            style={{ 
              position: 'absolute',
              bottom: '5%',
              left: '5%',
              zIndex: 9, 
              filter: `drop-shadow(0 15px 25px #000000) drop-shadow(0 0 40px ${theme.glowColor})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '320px',
              height: '320px'
            }}
          >
            <PetSprite
              src={getPetSpritesheet('dog')}
              state="running-right"
              scale={1.4}
              label="Dog"
            />
          </motion.div>
        </div>

        {/* Floating Form Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          minWidth: '400px',
          padding: '40px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20
        }}>
          <div style={{ width: '100%', maxWidth: '440px' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
