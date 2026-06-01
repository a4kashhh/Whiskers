'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getRecentActivities } from '@/lib/firebase/firestore';
import type { Activity } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const ACTIVITY_INFO: Record<string, { emoji: string; label: string; color: string }> = {
  feed: { emoji: '🍖', label: 'Fed', color: '#fb923c' },
  water: { emoji: '💧', label: 'Watered', color: '#38bdf8' },
  play: { emoji: '🎮', label: 'Played', color: '#a78bfa' },
  sleep: { emoji: '💤', label: 'Slept', color: '#818cf8' },
  clean: { emoji: '🛁', label: 'Cleaned', color: '#34d399' },
  train: { emoji: '💪', label: 'Trained', color: '#f59e0b' },
  medicine: { emoji: '💊', label: 'Medicine', color: '#f472b6' },
};

interface CareHistoryProps {
  petId: string;
}

export function CareHistory({ petId }: CareHistoryProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentActivities(petId, 8)
      .then(setActivities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [petId]);

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16 }}>
        🕐 Care History
      </h3>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-shimmer" style={{ height: 44, borderRadius: 10 }} />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)', fontSize: 14 }}>
          No care activities yet. Start taking care of {' '}
          <span style={{ color: 'var(--color-primary)' }}>your pet</span>!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activities.map((activity, i) => {
            const info = ACTIVITY_INFO[activity.type] || { emoji: '⭐', label: activity.type, color: 'var(--color-primary)' };
            return (
              <motion.div
                key={activity.id || i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 10,
                  borderLeft: `3px solid ${info.color}`,
                }}
              >
                <span style={{ fontSize: 18 }}>{info.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{info.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#fbbf24' }}>+{activity.xpGained}XP</div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
