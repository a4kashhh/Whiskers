'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PET_THEMES } from '@/lib/theme-engine/themes';
import { ParticleCanvas } from '@/components/theme/ParticleCanvas';
import { PetSprite } from '@/components/pet-sprite';
import { getPets } from '@/lib/pets';
import { Logo } from '@/components/ui/Logo';
import type { PetSpecies } from '@/types';

// Map Whiskers species to the closest Petdex sprite slugs
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

const SPECIES_LIST: PetSpecies[] = ['cat', 'dog', 'panda', 'fox', 'dragon', 'bunny'];

export default function LandingClient() {
  const [animal, setAnimal] = useState<PetSpecies>('cat');
  const theme = PET_THEMES[animal];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      position: 'relative',
      background: '#050505',
      color: '#F7FAFC',
      overflow: 'hidden'
    }}>
      
      {/* Full-Screen Hi-Tech City Parallax */}
      <svg 
        viewBox="0 0 1000 1000" 
        width="100%" 
        height="100%" 
        preserveAspectRatio="xMidYMid slice" 
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      >
        <defs>
          <linearGradient id="cyberSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050510" />
            <stop offset="40%" stopColor="#0a0a1a" />
            <stop offset="100%" stopColor={theme.primaryColor} stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="neonGlow" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor={theme.accentColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <rect width="1000" height="1000" fill="url(#cyberSky)" />
        <rect width="1000" height="1000" fill="url(#neonGlow)" />

        {/* Far Background (Distant Megastructures) */}
        <motion.g animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }}>
          {[0, 1000].map(offsetX => (
            <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
              {/* Monolithic shapes */}
              <rect x="50" y="300" width="120" height="700" fill="#0b0b14" />
              <rect x="250" y="450" width="80" height="550" fill="#0d0d18" />
              <rect x="400" y="200" width="150" height="800" fill="#080811" />
              <rect x="650" y="350" width="100" height="650" fill="#0b0b14" />
              <rect x="850" y="500" width="90" height="500" fill="#0d0d18" />
              
              {/* Neon outlines on far buildings */}
              <rect x="50" y="300" width="2" height="700" fill={theme.primaryColor} opacity="0.3" />
              <rect x="400" y="200" width="2" height="800" fill={theme.accentColor} opacity="0.2" />
            </g>
          ))}
        </motion.g>

        {/* Midground (Dense City Blocks with Brighter Lights) */}
        <motion.g animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
          {[0, 1000].map(offsetX => (
            <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
              <rect x="100" y="400" width="200" height="600" fill="#121220" />
              {Array.from({length: 12}).map((_, i) => (
                <rect key={`w1-${i}`} x={120 + (i%4)*40} y={450 + Math.floor(i/4)*60} width="25" height="35" fill={theme.glowColor} opacity={i % 3 === 0 ? 0.2 : 0.9} />
              ))}

              <rect x="450" y="500" width="250" height="500" fill="#151525" />
              {Array.from({length: 15}).map((_, i) => (
                <rect key={`w2-${i}`} x={470 + (i%5)*45} y={540 + Math.floor(i/5)*50} width="30" height="20" fill={theme.primaryColor} opacity={i % 2 === 0 ? 0.9 : 0.4} />
              ))}

              <rect x="800" y="350" width="150" height="650" fill="#10101c" />
              {Array.from({length: 8}).map((_, i) => (
                <rect key={`w3-${i}`} x={820 + (i%3)*40} y={400 + Math.floor(i/3)*80} width="20" height="50" fill={theme.accentColor} opacity={i % 4 === 1 ? 1 : 0.2} />
              ))}
            </g>
          ))}
        </motion.g>

        {/* Foreground (High-speed bridge pillars/cables) */}
        <motion.g animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
          {[0, 1000].map(offsetX => (
            <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
              <rect x="200" y="0" width="40" height="1000" fill="#020202" />
              <rect x="700" y="0" width="60" height="1000" fill="#020202" />
              <line x1="240" y1="0" x2="700" y2="1000" stroke="#050505" strokeWidth="10" />
              <line x1="240" y1="1000" x2="700" y2="0" stroke="#050505" strokeWidth="10" />
            </g>
          ))}
        </motion.g>
      </svg>

      {/* Floating Logo */}
      <div className="absolute top-4 left-4 md:top-[30px] md:left-[60px] z-50">
        <Logo size={42} />
      </div>

      {/* Floating Buttons */}
      <div className="absolute top-4 right-4 md:top-[30px] md:right-[60px] flex gap-2 md:gap-4 z-50">
        <Link href="/login" style={{
          background: 'rgba(5, 5, 5, 0.4)',
          color: '#A0AEC0',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid #2D3748',
          borderRadius: 100,
          padding: '10px 24px',
          fontWeight: 700,
          fontSize: 14,
          textDecoration: 'none',
          transition: 'all 0.2s'
        }}>Sign In</Link>
        <Link href="/signup" style={{
          background: theme.primaryColor,
          color: '#050505',
          border: 'none',
          borderRadius: 100,
          padding: '10px 24px',
          fontWeight: 800,
          fontSize: 14,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: `0 0 20px ${theme.glowColor}`,
          transition: 'all 0.3s'
        }}>
          <Sparkle size={16} fill="currentColor" />
          Get Started
        </Link>
      </div>

      {/* Main Content */}
      <main style={{
        display: 'flex',
        flex: 1,
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Left Visual Section (Subway Interior 3D Engine) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          overflow: 'hidden'
        }}>
          {(() => {
            const fov = 1200;
            const cx = 900; // Vanishing point X (pushed to the right)
            const cy = 400; // Vanishing point Y
            const w = 1000;
            const h = 1000;

            const project = (x: number, y: number, z: number) => {
              const scale = fov / (fov + z);
              return { x: cx + (x - cx) * scale, y: cy + (y - cy) * scale, scale };
            };

            const poly = (points: [number, number, number][]) => 
              points.map(p => {
                const proj = project(...p);
                return `${proj.x},${proj.y}`;
              }).join(' ');

            return (
              <>
                <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}>
                  <defs>
                    <mask id="window-mask">
                      {/* Left Wall base mask (white = visible) */}
                      <polygon points={poly([[0,0,0], [0,h,0], [0,h,3000], [0,0,3000]])} fill="white" />
                      {/* Massive Windows (black = transparent) */}
                      <polygon points={poly([[0,100,100], [0,550,100], [0,550,850], [0,100,850]])} fill="black" />
                      <polygon points={poly([[0,100,950], [0,550,950], [0,550,1700], [0,100,1700]])} fill="black" />
                      <polygon points={poly([[0,100,1800], [0,550,1800], [0,550,2550], [0,100,2550]])} fill="black" />
                      <polygon points={poly([[0,100,2650], [0,550,2650], [0,550,3000], [0,100,3000]])} fill="black" />
                      <polygon points={poly([[0,100,20], [0,600,20], [0,600,80], [0,100,80]])} fill="black" /> {/* Door Window */}
                    </mask>
                  </defs>

                  {/* Ceiling */}
                  <polygon points={poly([[0,0,0], [w,0,0], [w,0,3000], [0,0,3000]])} fill="#1e293b" />
                  {/* Slats on ceiling */}
                  {[0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800].map(z => (
                    <polygon key={`slat-${z}`} points={poly([[0,0,z], [w,0,z], [w,0,z+50], [0,0,z+50]])} fill="#0f172a" />
                  ))}

                  {/* Floor */}
                  <polygon points={poly([[0,h,0], [w,h,0], [w,h,3000], [0,h,3000]])} fill="#09090b" />
                  {/* Floor lines */}
                  <polygon points={poly([[300,h,0], [350,h,0], [350,h,3000], [300,h,3000]])} fill="#1e293b" opacity="0.5" />
                  <polygon points={poly([[600,h,0], [650,h,0], [650,h,3000], [600,h,3000]])} fill="#1e293b" opacity="0.5" />

                  {/* Right Wall (illuminated by sun) */}
                  <polygon points={poly([[w,0,0], [w,h,0], [w,h,3000], [w,0,3000]])} fill="#334155" />

                  {/* Back Wall */}
                  <polygon points={poly([[0,0,3000], [w,0,3000], [w,h,3000], [0,h,3000]])} fill="#1e293b" />
                  {/* Back Door */}
                  <polygon points={poly([[w/2-150,150,3000], [w/2+150,150,3000], [w/2+150,h,3000], [w/2-150,h,3000]])} fill="#334155" stroke="#0f172a" strokeWidth="4" />
                  <polygon points={poly([[w/2-80,250,3000], [w/2+80,250,3000], [w/2+80,600,3000], [w/2-80,600,3000]])} fill="#020617" />

                  {/* Left Wall with Masked Windows */}
                  <polygon points={poly([[0,0,0], [0,h,0], [0,h,3000], [0,0,3000]])} fill="#1e293b" mask="url(#window-mask)" />
                  
                  {/* Left Wall Door Outlines */}
                  <polygon points={poly([[0,150,0], [0,h,0], [0,h,170], [0,150,170]])} fill="none" stroke="#0f172a" strokeWidth="8" />

                  {/* Rubber Window Seals (drawn around the masked holes) */}
                  {[100, 950, 1800, 2650].map(z => (
                    <g key={`win-${z}`}>
                      <polygon points={poly([[0,100,z], [0,550,z], [0,550,z+750], [0,100,z+750]])} fill="none" stroke="#0f172a" strokeWidth="15" strokeLinejoin="round" />
                      <polygon points={poly([[0,100,z], [0,550,z], [0,550,z+750], [0,100,z+750]])} fill="none" stroke="#020617" strokeWidth="5" strokeLinejoin="round" />
                    </g>
                  ))}

                  {/* 3D Bench (Long Seat) */}
                  {/* Top Cushion */}
                  <polygon points={poly([[0,650,200], [200,650,200], [200,650,3000], [0,650,3000]])} fill="#334155" stroke="#475569" strokeWidth="2" />
                  {/* Front Cushion Face */}
                  <polygon points={poly([[200,650,200], [200,720,200], [200,720,3000], [200,650,3000]])} fill="#1e293b" />
                  {/* Base Front Face */}
                  <polygon points={poly([[180,720,200], [180,h,200], [180,h,3000], [180,720,3000]])} fill="#0f172a" />
                  {/* Side Face (closest) */}
                  <polygon points={poly([[0,650,200], [200,650,200], [200,720,200], [180,720,200], [180,h,200], [0,h,200]])} fill="#0f172a" />
                  
                  {/* Base Ventilation Grills */}
                  {[250, 950, 1650, 2350].map(z => (
                    <polygon key={`grill-${z}`} points={poly([[180,800,z], [180,900,z], [180,900,z+500], [180,800,z+500]])} fill="#020617" />
                  ))}

                  {/* Luggage Rack */}
                  <polygon points={poly([[0,150,0], [150,150,0], [150,150,3000], [0,150,3000]])} fill="none" stroke="#334155" strokeWidth="4" />
                  <polygon points={poly([[150,150,0], [150,165,0], [150,165,3000], [150,150,3000]])} fill="#1e293b" />

                  {/* Ceiling Grab Rails */}
                  <polygon points={poly([[250,50,0], [260,50,0], [260,50,3000], [250,50,3000]])} fill="#475569" />
                  
                  {/* Vertical Poles */}
                  {[100, 950, 1800, 2650].map(z => (
                    <polygon key={`pole-${z}`} points={poly([[180,50,z], [195,50,z], [195,650,z], [180,650,z]])} fill="#475569" />
                  ))}
                  
                  {/* Hanging Handles (Triangles) */}
                  {[300, 500, 700, 1000, 1200, 1400, 1700, 1900, 2100].map(z => (
                    <g key={`handle-${z}`}>
                      <polygon points={poly([[255,50,z], [265,50,z], [265,250,z], [255,250,z]])} fill="#334155" />
                      <polygon points={poly([[260,250,z], [290,320,z], [230,320,z]])} fill="none" stroke="#475569" strokeWidth="6" strokeLinejoin="round" />
                    </g>
                  ))}
                  {/* Pet seamlessly synced with SVG scaling */}
                  {(() => {
                    const zDepth = 950; // Align exactly with the 2nd vertical pole
                    const proj = project(150, 650, zDepth);
                    
                    const width = 400;
                    const height = 400;

                    return (
                      <foreignObject 
                        x={proj.x - width/2} 
                        y={proj.y - height} 
                        width={width} 
                        height={height} 
                        style={{ overflow: 'visible' }}
                      >
                        <motion.div
                          key={animal}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            transform: `scale(${proj.scale * 1.5})`,
                            transformOrigin: 'bottom center',
                            filter: `drop-shadow(0 0 25px ${theme.glowColor}) drop-shadow(0 10px 10px rgba(0,0,0,0.8))`
                          }}
                        >
                          <PetSprite
                            src={getPetSpritesheet(animal)}
                            cycleStates={false}
                            state="waving"
                            scale={1}
                          />
                        </motion.div>
                      </foreignObject>
                    );
                  })()}
                </svg>
              </>
            );
          })()}
        </div>

        {/* Right Form Section (Floating Overlay) */}
        <div className="absolute bottom-0 left-0 right-0 md:left-auto md:right-[60px] md:bottom-[40px] w-full md:max-w-[380px] p-6 md:p-[30px] flex flex-col justify-center z-40 bg-black/80 md:bg-black/65 backdrop-blur-xl border-t md:border border-white/5 rounded-t-[32px] md:rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
             style={{ WebkitBackdropFilter: 'blur(20px)' }}>
          
          <motion.h1 
            key={`h1-${animal}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ fontSize: 48, fontWeight: 900, marginBottom: 16, letterSpacing: '-1.5px', lineHeight: 1.1 }}
          >
            Your Pet.<br/>
            <span style={{ 
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Your Universe.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ color: '#A0AEC0', fontSize: 15, lineHeight: 1.6, marginBottom: 30, maxWidth: 380 }}
          >
            Adopt an AI-powered virtual companion that learns, evolves, and transforms your entire world. Experience dynamic themes, daily tasks, and a living universe.
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#F7FAFC' }}
          >
            Choose your companion
          </motion.h3>

          {/* Pet Selector Group */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 30 }}
          >
            {SPECIES_LIST.map(type => {
              const petTheme = PET_THEMES[type];
              const isSelected = animal === type;
              return (
                <label key={type} style={{ display: 'block', cursor: 'pointer' }}>
                  <div style={{
                    padding: '12px 8px',
                    borderRadius: 16,
                    background: isSelected ? `${petTheme.primaryColor}15` : '#121212',
                    border: `2px solid ${isSelected ? petTheme.primaryColor : '#2D3748'}`,
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    gap: 8,
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? `0 0 20px ${petTheme.glowColor}` : 'none'
                  }}>
                    <div style={{ 
                      width: '60px', height: '60px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <PetSprite
                        src={getPetSpritesheet(type)}
                        cycleStates={isSelected}
                        cycleIntervalMs={1500}
                        scale={0.3}
                        label={petTheme.name}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#F7FAFC' : '#A0AEC0', textAlign: 'center' }}>
                      {petTheme.name}
                    </span>
                  </div>
                  <input 
                    type="radio" 
                    name="animal" 
                    value={type} 
                    checked={isSelected} 
                    onChange={(e) => setAnimal(e.target.value as PetSpecies)} 
                    style={{ display: 'none' }} 
                  />
                </label>
              );
            })}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'absolute',
        bottom: 20,
        width: '100%',
        textAlign: 'center',
        zIndex: 20,
        color: '#A0AEC0',
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.5px',
        opacity: 0.6
      }}>
        copyright @a4kashhh
      </footer>
    </div>
  );
}
