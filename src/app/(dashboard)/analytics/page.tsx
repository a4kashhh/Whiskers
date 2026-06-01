'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { usePetStore } from '@/stores/usePetStore';
import { useGameStore } from '@/stores/useGameStore';
import { getRecentActivities } from '@/lib/firebase/firestore';
import type { Activity } from '@/types';
import { format } from 'date-fns';

function generateMockTrendData(pet: NonNullable<ReturnType<typeof usePetStore.getState>['pet']>) {
  const now = Date.now();
  const days = 7;
  return Array.from({ length: days }, (_, i) => ({
    date: format(now - (days - 1 - i) * 86400000, 'MMM d'),
    mood: Math.max(20, Math.min(100, pet.mood + (Math.random() - 0.5) * 30)),
    happiness: Math.max(20, Math.min(100, pet.happiness + (Math.random() - 0.5) * 25)),
    health: Math.max(30, Math.min(100, pet.health + (Math.random() - 0.5) * 15)),
    energy: Math.max(10, Math.min(100, pet.energy + (Math.random() - 0.5) * 40)),
  })).map(d => ({
    ...d,
    mood: Math.round(d.mood),
    happiness: Math.round(d.happiness),
    health: Math.round(d.health),
    energy: Math.round(d.energy),
  }));
}

const CHART_COLORS = {
  mood: '#a78bfa',
  happiness: '#fbbf24',
  health: '#4ade80',
  energy: '#38bdf8',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10,5,20,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: '10px 14px',
        backdropFilter: 'blur(20px)',
      }}>
        <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
            <span style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{entry.name}:</span>
            <span style={{ fontWeight: 600, color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const pet = usePetStore((s) => s.pet);
  const { totalXP, coins, streak } = useGameStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trendData, setTrendData] = useState<ReturnType<typeof generateMockTrendData>>([]);

  useEffect(() => {
    if (!pet) return;
    setTrendData(generateMockTrendData(pet));
    getRecentActivities(pet.id, 50).then(setActivities).catch(console.error);
  }, [pet?.id]);

  if (!pet) return null;

  // Activity frequency data
  const activityCounts: Record<string, number> = {};
  activities.forEach((a) => { activityCounts[a.type] = (activityCounts[a.type] || 0) + 1; });
  const activityBarData = Object.entries(activityCounts).map(([type, count]) => ({ type, count }));

  const StatCard = ({ value, label, emoji, color }: { value: string | number; label: string; emoji: string; color: string }) => (
    <motion.div
      className="glass-card glass-card-hover"
      whileHover={{ y: -4 }}
      style={{ padding: 24, textAlign: 'center' }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>📊 Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{pet.name}'s life insights</p>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard value={pet.level} label="Current Level" emoji="⭐" color="var(--color-primary)" />
        <StatCard value={totalXP} label="Total XP Earned" emoji="⚡" color="#fbbf24" />
        <StatCard value={`${streak}d`} label="Current Streak" emoji="🔥" color="#fb923c" />
        <StatCard value={coins} label="Coins Earned" emoji="🪙" color="#4ade80" />
      </div>

      {/* Mood & Happiness Trend */}
      <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>📈 Wellbeing Trends (7 Days)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={trendData}>
            <defs>
              {Object.entries(CHART_COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.5)' }} />
            {Object.entries(CHART_COLORS).map(([key, color]) => (
              <Area key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} fill={`url(#gradient-${key})`} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Activity Frequency */}
      <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>🎮 Activity Frequency</h3>
        {activityBarData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            No activities logged yet. Start taking care of {pet.name}!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="type" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Pet Profile Overview */}
      <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>📝 {pet.name}'s Profile</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Species', value: pet.species, emoji: '🐾' },
            { label: 'Personality', value: pet.personality, emoji: '🌟' },
            { label: 'Evolution', value: pet.evolutionStage, emoji: '🌱' },
            { label: 'Level', value: `${pet.level}`, emoji: '⭐' },
            { label: 'XP', value: `${pet.xp}`, emoji: '⚡' },
            { label: 'Activities', value: `${activities.length}`, emoji: '📊' },
          ].map((item) => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{item.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{item.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
