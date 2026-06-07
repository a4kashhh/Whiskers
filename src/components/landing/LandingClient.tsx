'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkle, ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { PET_THEMES } from '@/lib/theme-engine/themes';
import { ParticleCanvas } from '@/components/theme/ParticleCanvas';
import type { PetSpecies } from '@/types';

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
      minHeight: '100vh', 
      position: 'relative',
      background: '#050505',
      color: '#F7FAFC',
      overflow: 'hidden'
    }}>
      
      {/* Background Particles */}
      <ParticleCanvas species={animal} count={25} />

      {/* Navbar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '30px 60px',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: 28 }}
          >
            🐾
          </motion.span>
          <span style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-0.5px' }}>Whiskers</span>
        </div>
        
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href="/login" style={{
            background: 'transparent',
            color: '#A0AEC0',
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
            <Sparkle size={16} weight="fill" />
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
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
          justifyContent: 'center'
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

          {/* Floating Pet Emoji */}
          <motion.div
            key={animal}
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -20, 0] }}
            transition={{ 
              opacity: { duration: 0.5 },
              scale: { type: "spring", stiffness: 200, damping: 15 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ 
              position: 'relative', 
              zIndex: 10, 
              fontSize: 220,
              filter: `drop-shadow(0 0 40px ${theme.glowColor})`
            }}
          >
            {theme.emoji}
          </motion.div>
        </div>

        {/* Right Form Section */}
        <div style={{
          flex: 1.1,
          padding: '40px 80px 40px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 10
        }}>
          
          <motion.h1 
            key={`h1-${animal}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ fontSize: 64, fontWeight: 900, marginBottom: 20, letterSpacing: '-1.5px', lineHeight: 1.1 }}
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
            style={{ color: '#A0AEC0', fontSize: 18, lineHeight: 1.6, marginBottom: 40, maxWidth: 520 }}
          >
            Adopt an AI-powered virtual companion that learns, evolves, and transforms your entire world. Experience dynamic themes, daily tasks, and a living universe.
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: '#F7FAFC' }}
          >
            choose your companion
          </motion.h3>

          {/* Pet Selector Group */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48, maxWidth: 500 }}
          >
            {SPECIES_LIST.map(type => {
              const petTheme = PET_THEMES[type];
              const isSelected = animal === type;
              return (
                <label key={type} style={{ display: 'block', cursor: 'pointer' }}>
                  <div style={{
                    padding: '16px',
                    borderRadius: 16,
                    background: isSelected ? `${petTheme.primaryColor}15` : '#121212',
                    border: `2px solid ${isSelected ? petTheme.primaryColor : '#2D3748'}`,
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12,
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? `0 0 20px ${petTheme.glowColor}` : 'none'
                  }}>
                    <span style={{ fontSize: 24 }}>{petTheme.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: isSelected ? '#F7FAFC' : '#A0AEC0', textTransform: 'capitalize' }}>
                      {type}
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

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: 20 }}
          >
            <Link href="/signup" style={{ 
              background: theme.primaryColor,
              color: '#050505',
              border: 'none',
              borderRadius: 100,
              padding: '16px 36px', 
              fontSize: 16,
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: `0 0 30px ${theme.glowColor}`,
              transition: 'all 0.3s'
            }}>
              Adopt Now <ArrowRight size={18} weight="bold" />
            </Link>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
