'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Star, Shield, Zap, Heart, MessageCircle } from 'lucide-react';
import { ParticleCanvas } from '@/components/theme/ParticleCanvas';
import type { PetSpecies } from '@/types';
import { PET_THEMES } from '@/lib/theme-engine/themes';

const PET_SHOWCASE: { species: PetSpecies; name: string; tagline: string }[] = [
  { species: 'cat', name: '🐱 Mystic Cat', tagline: 'Neon cosmos explorer' },
  { species: 'dog', name: '🐶 Golden Pup', tagline: 'Energetic life companion' },
  { species: 'panda', name: '🐼 Zen Panda', tagline: 'Serene bamboo wisdom' },
  { species: 'fox', name: '🦊 Autumn Fox', tagline: 'Forest spirit dancer' },
  { species: 'dragon', name: '🐉 Cyber Dragon', tagline: 'Digital realm guardian' },
  { species: 'bunny', name: '🐰 Kawaii Bunny', tagline: 'Pastel universe dreamer' },
];

const FEATURES = [
  { icon: '🎮', title: 'Dynamic Pet Universe', description: 'Your entire app theme transforms based on your pet species — colors, particles, fonts, animations.' },
  { icon: '🤖', title: 'AI Pet Companion', description: 'Powered by Gemini AI, your pet responds emotionally based on their personality and mood.' },
  { icon: '📊', title: 'Gamified Dashboard', description: 'XP, levels, coins, streaks, achievements, and evolution stages keep you engaged every day.' },
  { icon: '📈', title: 'Beautiful Analytics', description: 'Track mood trends, feeding habits, sleep patterns, and happiness with stunning charts.' },
  { icon: '🏆', title: 'Achievement System', description: '30+ achievements, rare cosmetics, mystery rewards, and evolution cutscenes.' },
  { icon: '🌍', title: 'Social Universe', description: 'Share your pet profile, climb leaderboards, and visit other pet universes.' },
];

export default function LandingClient() {
  const [hoveredSpecies, setHoveredSpecies] = useState<PetSpecies>('cat');
  const theme = PET_THEMES[hoveredSpecies];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.bgGradientFrom} 0%, ${theme.bgGradientTo} 100%)`,
        transition: 'background 0.8s ease',
        color: 'white',
        overflowX: 'hidden',
      }}
    >
      <ParticleCanvas species={hoveredSpecies} count={20} />

      {/* Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '16px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: 28 }}
          >
            🐾
          </motion.span>
          <span style={{ fontWeight: 800, fontSize: 20 }}>PetVerse</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', gap: 12 }}
        >
          <Link
            href="/login"
            className="btn-ghost"
            style={{ textDecoration: 'none', fontSize: 14, padding: '9px 20px' }}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="btn-primary"
            style={{ textDecoration: 'none', fontSize: 14, padding: '9px 20px' }}
          >
            <Sparkles size={14} style={{ display: 'inline', marginRight: 6 }} />
            Get Started Free
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 48px 80px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 100,
            padding: '8px 20px',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 32,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Star size={14} style={{ color: '#fbbf24' }} />
          AI-Powered Virtual Pet Universe
          <Star size={14} style={{ color: '#fbbf24' }} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{
            fontSize: 'clamp(48px, 8vw, 88px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          Your Pet.
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              transition: 'all 0.5s ease',
            }}
          >
            Your Universe.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 600,
            lineHeight: 1.6,
            marginBottom: 48,
          }}
        >
          Adopt a virtual pet and watch your entire world transform. AI conversations, gamified care,
          and a living universe that evolves with every interaction.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ display: 'flex', gap: 16 }}
        >
          <Link
            href="/signup"
            className="btn-primary"
            style={{
              textDecoration: 'none',
              fontSize: 16,
              padding: '16px 36px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Sparkles size={18} /> Adopt Your Pet Free
          </Link>
          <Link
            href="/login"
            className="btn-ghost"
            style={{
              textDecoration: 'none',
              fontSize: 16,
              padding: '16px 36px',
            }}
          >
            Sign In
          </Link>
        </motion.div>

        {/* Floating pet emojis */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {['🐾', '✨', '⭐', '💫', '🌟'].map((emoji, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                x: [0, (i % 2 === 0 ? 1 : -1) * 15, 0],
                rotate: [0, (i % 2 === 0 ? 1 : -1) * 15, 0],
              }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
              style={{
                position: 'absolute',
                fontSize: 24 + i * 4,
                opacity: 0.15,
                left: `${10 + i * 20}%`,
                top: `${15 + (i % 3) * 20}%`,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pet Showcase */}
      <section style={{ padding: '80px 48px', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, marginBottom: 16 }}>
            Choose Your Companion
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto' }}>
            Each pet species completely transforms your universe
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {PET_SHOWCASE.map((pet, i) => {
            const petTheme = PET_THEMES[pet.species];
            const isHovered = hoveredSpecies === pet.species;
            return (
              <motion.div
                key={pet.species}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.04, y: -6 }}
                onHoverStart={() => setHoveredSpecies(pet.species)}
                style={{
                  background: isHovered
                    ? `linear-gradient(135deg, ${petTheme.primaryColor}25, ${petTheme.accentColor}15)`
                    : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${isHovered ? petTheme.primaryColor : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 24,
                  padding: '28px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isHovered ? `0 0 32px ${petTheme.glowColor}` : 'none',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <motion.div
                  animate={isHovered ? { y: [0, -12, 0], rotate: [0, 5, -5, 0] } : { y: [0, -4, 0] }}
                  transition={{ duration: isHovered ? 1.5 : 3, repeat: Infinity }}
                  style={{ fontSize: 56, marginBottom: 12 }}
                >
                  {pet.name.split(' ')[0]}
                </motion.div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: isHovered ? petTheme.primaryColor : 'rgba(255,255,255,0.85)' }}>
                  {pet.name.split(' ').slice(1).join(' ')}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{pet.tagline}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 48px', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, marginBottom: 16 }}>
            Everything Your Pet Deserves
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto' }}>
            A complete emotional companion experience built with cutting-edge technology
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 24,
                padding: '28px 24px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{feature.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{feature.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 48px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}15, ${theme.accentColor}08)`,
            border: `1px solid ${theme.primaryColor}30`,
            borderRadius: 32,
            padding: '60px 48px',
            maxWidth: 700,
            margin: '0 auto',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 0 60px ${theme.glowColor}`,
          }}
        >
          <motion.div
            animate={{ y: [0, -16, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: 72, marginBottom: 24 }}
          >
            {PET_THEMES[hoveredSpecies].emoji}
          </motion.div>
          <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16, letterSpacing: '-1px' }}>
            Your universe awaits
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', marginBottom: 40 }}>
            Join thousands of trainers building their pet universe. Free forever, no credit card required.
          </p>
          <Link
            href="/signup"
            className="btn-primary"
            style={{
              textDecoration: 'none',
              fontSize: 18,
              padding: '18px 48px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              borderRadius: 14,
            }}
          >
            <Sparkles size={20} /> Start Your Journey
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 48px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>🐾</span>
          <span style={{ fontWeight: 700 }}>PetVerse</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
          Built with ❤️ using Next.js 15, Firebase & Gemini AI
        </p>
      </footer>
    </div>
  );
}
