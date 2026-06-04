'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '@/stores/usePetStore';
import { useGameStore } from '@/stores/useGameStore';
import { useToast } from '@/components/ui/ToastProvider';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import type { Pet, ActivityType } from '@/types';

const ACTIONS: { type: ActivityType; label: string; emoji: string; color: string; desc: string }[] = [
  { type: 'feed',     label: 'Feed',    emoji: '🍖', color: '#fb923c', desc: '+Hunger' },
  { type: 'water',    label: 'Water',   emoji: '💧', color: '#38bdf8', desc: '+Energy' },
  { type: 'play',     label: 'Play',    emoji: '🎮', color: '#a78bfa', desc: '+Happy' },
  { type: 'sleep',    label: 'Sleep',   emoji: '💤', color: '#818cf8', desc: '+Energy' },
  { type: 'clean',    label: 'Clean',   emoji: '🛁', color: '#34d399', desc: '+Health' },
  { type: 'train',    label: 'Train',   emoji: '💪', color: '#f59e0b', desc: '+XP' },
];

interface QuickActionsProps { pet: Pet; userId: string; }

export function QuickActions({ pet, userId }: QuickActionsProps) {
  const performAction   = usePetStore((s) => s.performAction);
  const { addCoins, updateStreak, addNotification } = useGameStore();
  const { success } = useToast();
  const theme = useTheme();
  const [loading, setLoading] = useState<ActivityType | null>(null);
  const [justDone, setJustDone] = useState<ActivityType | null>(null);

  async function handleAction(action: typeof ACTIONS[0], e: React.MouseEvent) {
    if (loading) return;
    setLoading(action.type);
    try {
      await performAction(action.type, userId);
      addCoins(5);
      updateStreak();
      success(`${action.emoji} ${action.label}!`, action.desc);
      addNotification({
        userId, type: 'general', icon: action.emoji,
        title: `${pet.name} enjoyed that!`,
        message: `You ${action.label.toLowerCase()}ed ${pet.name}. ${action.desc}`,
        createdAt: Date.now(),
      });
      setJustDone(action.type);
      setTimeout(() => setJustDone(null), 1500);
    } catch { /* silent */ } finally {
      setLoading(null);
    }
  }

  return (
    <div className="glass-card" style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Quick Actions
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>+5 coins each</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {ACTIONS.map((action) => {
          const isLoading = loading === action.type;
          const isDone    = justDone === action.type;
          return (
            <motion.button
              key={action.type}
              whileHover={loading ? {} : { scale: 1.03, y: -2 }}
              whileTap={loading ? {} : { scale: 0.97 }}
              onClick={(e) => handleAction(action, e)}
              disabled={!!loading}
              style={{
                padding: '13px 8px',
                borderRadius: 12,
                border: `1px solid ${isDone ? action.color + '50' : isLoading ? action.color + '40' : 'rgba(255,255,255,0.07)'}`,
                background: isDone
                  ? `${action.color}18`
                  : isLoading
                  ? `${action.color}12`
                  : 'rgba(255,255,255,0.035)',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                transition: 'all 0.18s ease',
                boxShadow: isDone ? `0 0 16px ${action.color}30` : 'none',
                fontFamily: 'inherit',
              }}
            >
              <motion.span
                animate={isLoading ? { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] } : isDone ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: isLoading ? 0.4 : 0.3, repeat: isLoading ? Infinity : 0 }}
                style={{ fontSize: 22 }}
              >
                {isDone ? '✅' : action.emoji}
              </motion.span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: isDone ? action.color : 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
                {action.label}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{action.desc}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
