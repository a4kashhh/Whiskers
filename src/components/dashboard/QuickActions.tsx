'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ForkKnife, Drop, GameController, Moon, Bathtub, Barbell, CheckCircle, CircleNotch,
} from '@phosphor-icons/react';
import { usePetStore } from '@/stores/usePetStore';
import { useGameStore } from '@/stores/useGameStore';
import { useToast } from '@/components/ui/ToastProvider';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import type { Pet, ActivityType } from '@/types';

const ACTIONS = [
  { type: 'feed'  as ActivityType, label: 'Feed',   Icon: ForkKnife,      color: '#ea580c', desc: '+Hunger'  },
  { type: 'water' as ActivityType, label: 'Water',  Icon: Drop,           color: '#0284c7', desc: '+Energy'  },
  { type: 'play'  as ActivityType, label: 'Play',   Icon: GameController, color: '#7c3aed', desc: '+Happy'   },
  { type: 'sleep' as ActivityType, label: 'Sleep',  Icon: Moon,           color: '#4f46e5', desc: '+Energy'  },
  { type: 'clean' as ActivityType, label: 'Clean',  Icon: Bathtub,        color: '#059669', desc: '+Health'  },
  { type: 'train' as ActivityType, label: 'Train',  Icon: Barbell,        color: '#d97706', desc: '+XP'      },
];

interface QuickActionsProps { pet: Pet; userId: string; }

export function QuickActions({ pet, userId }: QuickActionsProps) {
  const performAction = usePetStore((s) => s.performAction);
  const { addCoins, updateStreak, addNotification } = useGameStore();
  const { success } = useToast();
  const theme   = useTheme();
  const accent  = theme.primaryColor ?? '#9B6B5A';
  const [loading, setLoading] = useState<ActivityType | null>(null);
  const [justDone, setJustDone] = useState<ActivityType | null>(null);

  async function handleAction(action: typeof ACTIONS[0]) {
    if (loading) return;
    setLoading(action.type);
    try {
      await performAction(action.type, userId);
      addCoins(5);
      updateStreak();
      success(`${action.label}!`, action.desc);
      addNotification({
        userId, type: 'general', icon: '',
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
    <div style={{
      background: 'var(--bg-card)', border: '1.5px solid var(--border-light)',
      borderRadius: 22, padding: '20px 20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>Quick Actions</span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: accent,
          background: `${accent}10`, borderRadius: 100, padding: '3px 10px',
          border: `1px solid ${accent}20`,
        }}>+5 coins each</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {ACTIONS.map((action) => {
          const isLoading = loading === action.type;
          const isDone    = justDone === action.type;
          const { Icon }  = action;
          return (
            <motion.button
              key={action.type}
              whileHover={loading ? {} : { y: -3 }}
              whileTap={loading ? {} : { scale: 0.97 }}
              onClick={() => handleAction(action)}
              disabled={!!loading}
              style={{
                padding: '14px 8px',
                borderRadius: 14,
                border: `1.5px solid ${isDone ? action.color + '40' : isLoading ? action.color + '30' : 'var(--border-light)'}`,
                background: isDone ? `${action.color}0e` : isLoading ? `${action.color}08` : 'var(--bg-surface)',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                transition: 'all 0.18s ease',
                fontFamily: 'inherit',
              }}
            >
              <motion.div
                animate={isLoading ? { rotate: 360 } : isDone ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: isLoading ? 0.8 : 0.3, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
              >
                {isDone
                  ? <CheckCircle size={24} weight="fill" color={action.color} />
                  : isLoading
                  ? <CircleNotch size={24} weight="bold" color={action.color} />
                  : <Icon size={24} weight="duotone" color={action.color} />
                }
              </motion.div>
              <span style={{ fontSize: 12, fontWeight: 700, color: isDone ? action.color : 'var(--text-secondary)' }}>
                {action.label}
              </span>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 }}>{action.desc}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
