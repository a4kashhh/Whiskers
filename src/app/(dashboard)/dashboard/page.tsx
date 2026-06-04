'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePetStore, xpForLevel } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import { PetAvatar } from '@/components/pet/PetAvatar';
import { StatMeter } from '@/components/pet/StatMeter';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DailyTasks } from '@/components/dashboard/DailyTasks';
import { CareHistory } from '@/components/dashboard/CareHistory';

const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', panda: '🐼', fox: '🦊', dragon: '🐉', bunny: '🐰',
};

function StatRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const dash = (value / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div style={{ position: 'relative', width: 58, height: 58 }}>
        <svg width={58} height={58} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={29} cy={29} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
          <motion.circle
            cx={29} cy={29} r={r} fill="none" stroke={color} strokeWidth={4}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${dash} ${circumference}` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
        }}>
          {value}
        </div>
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function InfoCard({ label, value, emoji, sub }: { label: string; value: string | number; emoji: string; sub?: string }) {
  return (
    <div className="glass-card" style={{ padding: '16px 18px' }}>
      <div style={{ fontSize: 20, marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--color-primary)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function DashboardPage() {
  const pet      = usePetStore((s) => s.pet);
  const loading  = usePetStore((s) => s.loading);
  const appUser  = useAuthStore((s) => s.appUser);
  const theme    = useTheme();
  const { coins, streak } = useGameStore();

  if (!appUser) return null;

  if (!pet && !loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20, textAlign: 'center' }}>
        <motion.div animate={{ y: [0,-12,0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 80 }}>🥚</motion.div>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>Your universe is empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Adopt your first companion to begin the adventure!</p>
          <Link href="/onboarding" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            ✨ Adopt a Pet
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !pet) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card animate-shimmer" style={{ height: 90 }} />
        ))}
      </div>
    );
  }

  const xpMax = xpForLevel(pet.level);
  const xpPct = Math.min(100, (pet.xp / xpMax) * 100);
  const name  = appUser.displayName?.split(' ')[0] || 'Trainer';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <motion.div {...FADE_UP(0)} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {name} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: 4 }}>
            {pet.name} is {pet.mood > 70 ? 'in a great mood today!' : pet.mood > 40 ? 'doing okay — some love helps.' : 'feeling a bit down. Cheer them up!'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)',
            borderRadius: 100, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: '#fbbf24',
          }}>🪙 {coins}</div>
          {streak > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.15)',
              borderRadius: 100, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: '#fb923c',
            }}>🔥 {streak}d streak</div>
          )}
        </div>
      </motion.div>

      {/* ── Stats cards row ──────────────────────────────────────────── */}
      <motion.div {...FADE_UP(0.05)} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <InfoCard emoji="❤️" label="Health" value={pet.health} sub={pet.health > 80 ? 'Excellent' : pet.health > 50 ? 'Good' : 'Needs care'} />
        <InfoCard emoji="😊" label="Happiness" value={pet.happiness} sub={pet.happiness > 80 ? 'Overjoyed' : 'Content'} />
        <InfoCard emoji="⚡" label="Energy" value={pet.energy} sub={pet.energy > 60 ? 'Ready to play' : 'Needs rest'} />
        <InfoCard emoji="🍖" label="Hunger" value={pet.hunger} sub={pet.hunger > 60 ? 'Well fed' : 'Getting hungry'} />
      </motion.div>

      {/* ── Main 2-column layout ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, alignItems: 'start' }}>

        {/* ── Pet card ────────────────────────────────────────────────── */}
        <motion.div {...FADE_UP(0.1)} className="glass-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {/* Glow ring behind avatar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute',
              width: 160, height: 160, borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }} />
            <PetAvatar pet={pet} size={100} />
          </div>

          {/* Name + stage */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>{pet.name}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{pet.evolutionStage}</span>
              <span className="badge badge-outline" style={{ textTransform: 'capitalize' }}>{pet.personality}</span>
            </div>
          </div>

          {/* XP bar */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Level {pet.level}</span>
              <span style={{ color: theme.primaryColor, fontWeight: 600 }}>{pet.xp} / {xpMax} XP</span>
            </div>
            <div className="progress-track" style={{ height: 6 }}>
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>

          {/* Circular stat rings */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', width: '100%' }}>
            <StatRing value={pet.mood}      label="Mood"   color={theme.primaryColor} />
            <StatRing value={pet.sleep}     label="Sleep"  color="#818cf8" />
            <StatRing value={pet.happiness} label="Joy"    color="#f472b6" />
          </div>

          {/* Stat bars */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <StatMeter label="Hunger"  value={pet.hunger}  emoji="🍖" />
            <StatMeter label="Energy"  value={pet.energy}  emoji="⚡" />
            <StatMeter label="Health"  value={pet.health}  emoji="❤️" />
          </div>
        </motion.div>

        {/* ── Right column ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Quick actions */}
          <motion.div {...FADE_UP(0.15)}>
            <QuickActions pet={pet} userId={appUser.uid} />
          </motion.div>

          {/* Daily tasks + care history */}
          <motion.div {...FADE_UP(0.2)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <DailyTasks pet={pet} />
            <CareHistory petId={pet.id} />
          </motion.div>

          {/* Quick nav cards */}
          <motion.div {...FADE_UP(0.25)} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { href: '/feed',  label: 'Feed', emoji: '🍖', desc: 'Nourish your pet', color: '#fb923c' },
              { href: '/play',  label: 'Play', emoji: '🎮', desc: 'Play minigames',    color: '#a78bfa' },
              { href: '/chat',  label: 'Chat', emoji: '💬', desc: 'Talk with AI',      color: theme.primaryColor },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  className="glass-card glass-card-hover"
                  whileHover={{ y: -3 }}
                  style={{ padding: '18px 16px', cursor: 'pointer' }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, marginBottom: 12,
                    background: `${item.color}18`, border: `1px solid ${item.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>
                    {item.emoji}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
