'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import { useToast } from '@/components/ui/ToastProvider';
import { PetAvatar } from '@/components/pet/PetAvatar';
import { StatMeter, XPBar, CircularStat } from '@/components/pet/StatMeter';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DailyTasks } from '@/components/dashboard/DailyTasks';
import { CareHistory } from '@/components/dashboard/CareHistory';
import { xpForLevel } from '@/stores/usePetStore';
import Link from 'next/link';

export default function DashboardPage() {
  const pet = usePetStore((s) => s.pet);
  const loading = usePetStore((s) => s.loading);
  const appUser = useAuthStore((s) => s.appUser);
  const theme = useTheme();
  const { coins, streak } = useGameStore();

  if (!appUser) return null;

  if (!pet && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 80, marginBottom: 24 }}>🥚</motion.div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Your universe is empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Adopt your first pet to begin the adventure!</p>
        <Link href="/onboarding" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
          ✨ Adopt a Pet
        </Link>
      </div>
    );
  }

  if (loading || !pet) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card animate-shimmer" style={{ height: 100, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  const xpMax = xpForLevel(pet.level);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome back, {appUser.displayName}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 2 }}>
            {pet.name} is waiting for you
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="badge badge-primary">🔥 {streak} day streak</div>
          <div className="badge badge-outline">🪙 {coins} coins</div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>

        {/* Left: Pet Card */}
        <motion.div
          className="glass-card"
          style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Pet Avatar */}
          <PetAvatar pet={pet} size={110} />

          {/* Pet Info */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{pet.name}</h2>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
              <span className="badge badge-primary">{pet.evolutionStage}</span>
              <span className="badge badge-outline">{pet.personality}</span>
            </div>

            {/* XP Bar */}
            <XPBar xp={pet.xp} level={pet.level} maxXP={xpMax} />
          </div>

          {/* Circular Stats Row */}
          <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'space-around' }}>
            <CircularStat value={pet.mood} label="Mood" emoji="😊" size={72} />
            <CircularStat value={pet.health} label="Health" emoji="❤️" size={72} />
            <CircularStat value={pet.happiness} label="Happy" emoji="⭐" size={72} />
          </div>
        </motion.div>

        {/* Right: Stats + Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Stats Card */}
          <motion.div
            className="glass-card"
            style={{ padding: 24 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--text-secondary)' }}>
              📊 Vital Stats
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <StatMeter label="Hunger" value={pet.hunger} emoji="🍖" />
              <StatMeter label="Energy" value={pet.energy} emoji="⚡" />
              <StatMeter label="Sleep" value={pet.sleep} emoji="💤" />
              <StatMeter label="Cleanliness" value={pet.health} emoji="🛁" />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <QuickActions pet={pet} userId={appUser.uid} />
          </motion.div>
        </div>
      </div>

      {/* Bottom Row: Tasks + Care History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <DailyTasks pet={pet} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <CareHistory petId={pet.id} />
        </motion.div>
      </div>
    </div>
  );
}
