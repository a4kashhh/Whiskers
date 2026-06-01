'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import type { Pet } from '@/types';

const DAILY_TASKS = [
  { id: 'feed_once', label: 'Feed your pet', emoji: '🍖', xp: 20, coins: 10 },
  { id: 'play_once', label: 'Play with your pet', emoji: '🎮', xp: 30, coins: 15 },
  { id: 'clean_once', label: 'Clean your pet', emoji: '🛁', xp: 15, coins: 8 },
  { id: 'chat_once', label: 'Chat with your pet', emoji: '💬', xp: 25, coins: 12 },
  { id: 'train_once', label: 'Train your pet', emoji: '💪', xp: 40, coins: 20 },
];

interface DailyTasksProps {
  pet: Pet;
}

export function DailyTasks({ pet }: DailyTasksProps) {
  const [completed, setCompleted] = useState<string[]>([]);
  const { addCoins, addTotalXP } = useGameStore();

  const today = new Date().toDateString();
  const storageKey = `petverse-tasks-${today}-${pet.id}`;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setCompleted(saved);
    } catch {}
  }, [storageKey]);

  function completeTask(id: string, xp: number, coins: number) {
    if (completed.includes(id)) return;
    const newCompleted = [...completed, id];
    setCompleted(newCompleted);
    localStorage.setItem(storageKey, JSON.stringify(newCompleted));
    addCoins(coins);
    addTotalXP(xp);
  }

  const progress = (completed.length / DAILY_TASKS.length) * 100;

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)' }}>📋 Daily Tasks</h3>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>
          {completed.length}/{DAILY_TASKS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-track" style={{ marginBottom: 20 }}>
        <motion.div
          className="progress-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence>
          {DAILY_TASKS.map((task) => {
            const done = completed.includes(task.id);
            return (
              <motion.button
                key={task.id}
                layout
                onClick={() => completeTask(task.id, task.xp, task.coins)}
                whileHover={{ x: done ? 0 : 3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  background: done ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${done ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 12,
                  cursor: done ? 'default' : 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: `2px solid ${done ? '#4ade80' : 'rgba(255,255,255,0.2)'}`,
                    background: done ? '#4ade80' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  {done && <Check size={12} color="white" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 18 }}>{task.emoji}</span>
                <span style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 500,
                  color: done ? 'rgba(255,255,255,0.4)' : 'var(--text-primary)',
                  textDecoration: done ? 'line-through' : 'none',
                }}>
                  {task.label}
                </span>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 600 }}>+{task.coins}🪙</span>
                  <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>+{task.xp}XP</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {completed.length === DAILY_TASKS.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginTop: 16,
            padding: '12px',
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: 12,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 600,
            color: '#4ade80',
          }}
        >
          🎉 All tasks complete! Amazing trainer!
        </motion.div>
      )}
    </div>
  );
}
