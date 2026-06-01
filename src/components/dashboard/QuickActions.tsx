'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '@/stores/usePetStore';
import { useGameStore } from '@/stores/useGameStore';
import { useToast } from '@/components/ui/ToastProvider';
import type { Pet, ActivityType } from '@/types';

const ACTIONS: { type: ActivityType; label: string; emoji: string; color: string; desc: string }[] = [
  { type: 'feed', label: 'Feed', emoji: '🍖', color: '#fb923c', desc: '+Hunger +Mood' },
  { type: 'water', label: 'Water', emoji: '💧', color: '#38bdf8', desc: '+Hydration +Energy' },
  { type: 'play', label: 'Play', emoji: '🎮', color: '#a78bfa', desc: '+Happiness +XP' },
  { type: 'sleep', label: 'Sleep', emoji: '💤', color: '#818cf8', desc: '+Energy +Sleep' },
  { type: 'clean', label: 'Clean', emoji: '🛁', color: '#34d399', desc: '+Health +Mood' },
  { type: 'train', label: 'Train', emoji: '💪', color: '#f59e0b', desc: '+XP +Skills' },
];

interface QuickActionsProps {
  pet: Pet;
  userId: string;
}

export function QuickActions({ pet, userId }: QuickActionsProps) {
  const performAction = usePetStore((s) => s.performAction);
  const { addCoins, updateStreak, addNotification } = useGameStore();
  const { success } = useToast();
  const [loading, setLoading] = useState<ActivityType | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  async function handleAction(action: typeof ACTIONS[0], e: React.MouseEvent) {
    if (loading) return;
    setLoading(action.type);

    // Spawn floating particles
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: rect.left + rect.width / 2,
      y: rect.top,
      emoji: action.emoji,
    }));
    setParticles((p) => [...p, ...newParticles]);
    setTimeout(() => setParticles((p) => p.filter((pp) => !newParticles.find((np) => np.id === pp.id))), 1200);

    try {
      await performAction(action.type, userId);
      addCoins(5);
      updateStreak();
      success(`${action.emoji} ${action.label}!`, `${action.desc}`);
      addNotification({
        userId,
        type: 'general',
        title: `${pet.name} enjoyed that!`,
        message: `You ${action.label.toLowerCase()}ed ${pet.name}. ${action.desc}`,
        createdAt: Date.now(),
        icon: action.emoji,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      {/* Floating particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}>
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
              animate={{ y: p.y - 100, opacity: 0, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ position: 'fixed', fontSize: 24, pointerEvents: 'none' }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>
          ⚡ Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {ACTIONS.map((action) => (
            <motion.button
              key={action.type}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleAction(action, e)}
              disabled={loading === action.type}
              style={{
                background: loading === action.type
                  ? `${action.color}20`
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${action.color}30`,
                borderRadius: 14,
                padding: '14px 10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
                boxShadow: loading === action.type ? `0 0 12px ${action.color}40` : 'none',
              }}
            >
              <motion.span
                animate={loading === action.type ? { rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.4, repeat: Infinity }}
                style={{ fontSize: 24 }}
              >
                {action.emoji}
              </motion.span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{action.label}</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.3 }}>{action.desc}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
}
