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
  const theme  = useTheme();
  const accent = theme.primaryColor ?? '#5266ea';
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
    <div className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-[#050505]">Quick Actions</span>
        <span className="text-[11px] font-semibold rounded-full px-3 py-0.5 border"
          style={{ color: accent, background: `${accent}10`, borderColor: `${accent}25` }}>
          +5 coins each
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map((action) => {
          const isLoading = loading === action.type;
          const isDone    = justDone === action.type;
          const { Icon } = action;
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
                border: `1.5px solid ${isDone ? action.color + '50' : isLoading ? action.color + '30' : 'rgba(0,0,0,0.08)'}`,
                background: isDone ? `${action.color}12` : isLoading ? `${action.color}08` : 'rgba(255,255,255,0.55)',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                transition: 'all 0.18s ease',
                fontFamily: 'inherit',
                backdropFilter: 'blur(8px)',
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
              <span style={{ fontSize: 12, fontWeight: 700, color: isDone ? action.color : '#202127' }}>
                {action.label}
              </span>
              <span style={{ fontSize: 10.5, color: '#4f515c', fontWeight: 600 }}>{action.desc}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
