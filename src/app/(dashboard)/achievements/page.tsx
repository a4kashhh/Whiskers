'use client';

import { motion } from 'framer-motion';
import { useGameStore, ACHIEVEMENTS_CONFIG } from '@/stores/useGameStore';
import { usePetStore } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';

const RARITY_COLORS = {
  common: { bg: 'rgba(107,114,128,0.15)', border: 'rgba(107,114,128,0.3)', text: '#9ca3af', label: 'Common' },
  rare: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa', label: 'Rare' },
  epic: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', text: '#c084fc', label: 'Epic' },
  legendary: { bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.3)', text: '#fbbf24', label: 'Legendary' },
};

export default function AchievementsPage() {
  const { unlockedAchievements, totalXP, coins, streak } = useGameStore();
  const pet = usePetStore((s) => s.pet);
  const appUser = useAuthStore((s) => s.appUser);

  const totalAchievements = ACHIEVEMENTS_CONFIG.length;
  const unlockedCount = unlockedAchievements.length;
  const completionPct = Math.round((unlockedCount / totalAchievements) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>🏆 Achievements</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Your journey milestones</p>
      </div>

      {/* Overview Card */}
      <div className="glass-card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              {unlockedCount} / {totalAchievements} Unlocked
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{completionPct}% completion</p>
          </div>
          <div style={{ fontSize: 48 }}>{completionPct === 100 ? '👑' : completionPct > 50 ? '🌟' : '⭐'}</div>
        </div>
        <div className="progress-track" style={{ height: 10 }}>
          <motion.div
            className="progress-fill"
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          {[
            { emoji: '⚡', label: 'Total XP', value: totalXP, color: '#fbbf24' },
            { emoji: '🪙', label: 'Coins', value: coins, color: '#4ade80' },
            { emoji: '🔥', label: 'Streak', value: `${streak}d`, color: '#fb923c' },
            { emoji: '🌟', label: 'Level', value: pet?.level || 1, color: 'var(--color-primary)' },
          ].map((stat) => (
            <div key={stat.label} style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 8px' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {ACHIEVEMENTS_CONFIG.map((achievement, i) => {
          const isUnlocked = unlockedAchievements.includes(achievement.type);
          const rarity = RARITY_COLORS[achievement.rarity];

          return (
            <motion.div
              key={achievement.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -3 }}
              style={{
                background: isUnlocked ? rarity.bg : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isUnlocked ? rarity.border : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 16,
                padding: '20px 18px',
                opacity: isUnlocked ? 1 : 0.5,
                filter: isUnlocked ? 'none' : 'grayscale(0.8)',
                transition: 'all 0.2s ease',
                boxShadow: isUnlocked ? `0 4px 16px ${rarity.border}` : 'none',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10, filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                {isUnlocked ? achievement.icon : '🔒'}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: isUnlocked ? 'var(--text-primary)' : 'rgba(255,255,255,0.3)' }}>
                {achievement.title}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 12, lineHeight: 1.4 }}>
                {achievement.description}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 10px',
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 700,
                  color: rarity.text,
                  border: `1px solid ${rarity.border}`,
                  background: rarity.bg,
                }}
              >
                {isUnlocked ? '✓' : '○'} {rarity.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
