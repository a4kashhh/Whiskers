'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Heart, Lightning, Cookie, Smiley,
  Star, Trophy, ChatCircle, GameController,
  Coins, Fire, ArrowRight,
} from '@phosphor-icons/react';
import { usePetStore, xpForLevel } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import { PetAvatar } from '@/components/pet/PetAvatar';
import { StatMeter } from '@/components/pet/StatMeter';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DailyTasks } from '@/components/dashboard/DailyTasks';
import { CareHistory } from '@/components/dashboard/CareHistory';

const FADE = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay: d, ease: [0.16, 1, 0.3, 1] },
});

const STATS = [
  { key: 'health',    label: 'Health',    icon: Heart,    color: '#e11d48', bg: 'rgba(225,29,72,0.08)'   },
  { key: 'happiness', label: 'Happiness', icon: Smiley,   color: '#ea580c', bg: 'rgba(234,88,12,0.08)'   },
  { key: 'energy',    label: 'Energy',    icon: Lightning, color: '#d97706', bg: 'rgba(217,119,6,0.08)'  },
  { key: 'hunger',    label: 'Hunger',    icon: Cookie,   color: '#16a34a', bg: 'rgba(22,163,74,0.08)'   },
] as const;

function StatCard({ label, value, Icon, color, bg }: {
  label: string; value: number; Icon: React.ElementType; color: string; bg: string;
}) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1.5px solid var(--border-light)',
      borderRadius: 18, padding: '18px 16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <Icon size={22} weight="duotone" color={color} />
        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 10 }}>
        {value}<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>/100</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          style={{ height: '100%', borderRadius: 100, background: color }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const pet     = usePetStore((s) => s.pet);
  const loading = usePetStore((s) => s.loading);
  const appUser = useAuthStore((s) => s.appUser);
  const theme   = useTheme();
  const { coins, streak } = useGameStore();
  const accent  = theme.primaryColor ?? '#9B6B5A';

  if (!appUser) return null;

  if (!pet && !loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20, textAlign: 'center' }}>
        <motion.div animate={{ y: [0,-12,0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 100, height: 100, borderRadius: 28, background: 'var(--bg-card)',
            border: '2px solid var(--border-light)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <Star size={48} weight="duotone" color={accent} />
        </motion.div>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>Your universe is empty!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>Adopt your first companion to begin</p>
          <Link href="/onboarding" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Get Started <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !pet) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-shimmer" style={{ height: 110, borderRadius: 18, background: 'var(--bg-card)' }} />
        ))}
      </div>
    );
  }

  const xpMax = xpForLevel(pet.level);
  const xpPct = Math.min(100, (pet.xp / xpMax) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Hero banner ─────────────────────────────────── */}
      <motion.div {...FADE(0)} style={{
        background: `linear-gradient(135deg, ${accent}15, ${accent}06)`,
        border: `1.5px solid ${accent}22`,
        borderRadius: 24, padding: '22px 24px',
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        {/* Pet avatar */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ flexShrink: 0 }}
        >
          <PetAvatar pet={pet} size={96} interactive={false} />
        </motion.div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
              {pet.name}
            </h2>
            <span style={{ background: accent, color: 'white', borderRadius: 100, padding: '2px 10px', fontSize: 12, fontWeight: 800 }}>
              Lv.{pet.level}
            </span>
            <span style={{ background: 'rgba(155,107,90,0.1)', color: accent, borderRadius: 100, padding: '2px 10px',
              fontSize: 12, fontWeight: 700, textTransform: 'capitalize', border: `1px solid ${accent}20` }}>
              {pet.personality}
            </span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 16 }}>
            {pet.mood > 70 ? 'Feeling amazing today!' : pet.mood > 40 ? 'Doing pretty good!' : 'Needs a little love'}
          </div>
          {/* XP bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Experience</span>
              <span style={{ fontSize: 12, color: accent, fontWeight: 800 }}>{pet.xp} / {xpMax} XP</span>
            </div>
            <div className="progress-track" style={{ height: 8 }}>
              <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }} />
            </div>
          </div>
        </div>

        {/* Coins + streak */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(202,138,4,0.25)',
            borderRadius: 16, padding: '14px 16px', textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)', minWidth: 70 }}>
            <Coins size={22} weight="duotone" color="#ca8a04" style={{ display: 'block', margin: '0 auto 6px' }} />
            <div style={{ fontSize: 18, fontWeight: 900, color: '#ca8a04' }}>{coins}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Coins</div>
          </div>
          {streak > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(220,38,38,0.2)',
              borderRadius: 16, padding: '14px 16px', textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)', minWidth: 70 }}>
              <Fire size={22} weight="duotone" color="#dc2626" style={{ display: 'block', margin: '0 auto 6px' }} />
              <div style={{ fontSize: 18, fontWeight: 900, color: '#dc2626' }}>{streak}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Streak</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── 4 stat cards ─────────────────────────────────── */}
      <motion.div {...FADE(0.07)} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {STATS.map(({ key, label, icon: Icon, color, bg }) => (
          <StatCard key={key} label={label} value={(pet as Record<string, number>)[key] ?? 0}
            Icon={Icon as React.ElementType} color={color} bg={bg} />
        ))}
      </motion.div>

      {/* ── 2-col layout ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '272px 1fr', gap: 16, alignItems: 'start' }}>

        {/* Left: live stats panel */}
        <motion.div {...FADE(0.1)} style={{
          background: 'var(--bg-card)', border: '1.5px solid var(--border-light)',
          borderRadius: 22, padding: '20px 18px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Heart size={16} weight="duotone" color={accent} />
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Live Stats</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <StatMeter label="Hunger"    value={pet.hunger}    emoji="🍖" />
            <StatMeter label="Energy"    value={pet.energy}    emoji="⚡" />
            <StatMeter label="Health"    value={pet.health}    emoji="❤️" />
            <StatMeter label="Happiness" value={pet.happiness} emoji="😊" />
            <StatMeter label="Mood"      value={pet.mood}      emoji="🌈" />
          </div>
        </motion.div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <motion.div {...FADE(0.13)}>
            <QuickActions pet={pet} userId={appUser.uid} />
          </motion.div>

          <motion.div {...FADE(0.17)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <DailyTasks pet={pet} />
            <CareHistory petId={pet.id} />
          </motion.div>

          {/* Quick nav */}
          <motion.div {...FADE(0.2)} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { href: '/feed', label: 'Feed',  Icon: Cookie,         desc: 'Nourish your pet', color: '#ea580c', bg: 'rgba(234,88,12,0.07)',  border: 'rgba(234,88,12,0.18)' },
              { href: '/play', label: 'Play',  Icon: GameController, desc: 'Play minigames',   color: '#7c3aed', bg: 'rgba(124,58,237,0.07)', border: 'rgba(124,58,237,0.16)' },
              { href: '/chat', label: 'Chat',  Icon: ChatCircle,     desc: 'Talk with AI',     color: accent,   bg: `${accent}0d`,            border: `${accent}22` },
            ].map(({ href, label, Icon, desc, color, bg, border }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                  style={{ background: 'var(--bg-card)', border: `1.5px solid ${border}`,
                    borderRadius: 18, padding: '18px 16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Icon size={24} weight="duotone" color={color} />
                    <ArrowRight size={14} color="var(--text-muted)" />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{desc}</div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
