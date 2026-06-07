'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendUp, Lightning, Fire, Coins, Star,
  PawPrint, Leaf, ChartBar,
} from '@phosphor-icons/react';
import { usePetStore } from '@/stores/usePetStore';
import { useGameStore } from '@/stores/useGameStore';
import { getRecentActivities } from '@/lib/firebase/firestore';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import type { Activity } from '@/types';
import { format } from 'date-fns';

/* ── helpers ─────────────────────────────────────────── */
function genTrend(pet: NonNullable<ReturnType<typeof usePetStore.getState>['pet']>) {
  const now = Date.now();
  return Array.from({ length: 7 }, (_, i) => ({
    date:      format(now - (6 - i) * 86400000, 'MMM d'),
    mood:      Math.round(Math.max(20, Math.min(100, pet.mood      + (Math.random() - 0.5) * 30))),
    happiness: Math.round(Math.max(20, Math.min(100, pet.happiness + (Math.random() - 0.5) * 25))),
    health:    Math.round(Math.max(30, Math.min(100, pet.health    + (Math.random() - 0.5) * 15))),
    energy:    Math.round(Math.max(10, Math.min(100, pet.energy    + (Math.random() - 0.5) * 40))),
  }));
}

/* ── SVG Sparkline ───────────────────────────────────── */
function Sparkline({ values, color, height = 60 }: { values: number[]; color: string; height?: number }) {
  const W = 280;
  const pad = 4;
  const max = Math.max(...values, 1);
  const xs = values.map((_, i) => pad + (i / (values.length - 1)) * (W - pad * 2));
  const ys = values.map((v) => height - pad - (v / max) * (height - pad * 2));
  const line = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const area = `${line} L${xs[xs.length - 1]},${height} L${xs[0]},${height} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${color.replace('#', '')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="white" stroke={color} strokeWidth="2" />
      ))}
    </svg>
  );
}

/* ── SVG Bar chart ───────────────────────────────────── */
function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color }}>{d.value}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ width: '100%', background: color, borderRadius: '6px 6px 0 0', minHeight: 4, opacity: 0.85 }}
            />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Radial stat ─────────────────────────────────────── */
function RadialStat({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28; const c = 2 * Math.PI * r;
  const filled = (value / 100) * c;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="6" />
        <motion.circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={c} strokeLinecap="round"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - filled }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '36px 36px' }}
        />
        <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>{value}</text>
      </svg>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

const FADE = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

/* ── Page ────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const pet = usePetStore((s) => s.pet);
  const { totalXP, coins, streak } = useGameStore();
  const theme = useTheme();
  const accent = theme.primaryColor ?? '#9B6B5A';
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trend, setTrend] = useState<ReturnType<typeof genTrend>>([]);

  useEffect(() => {
    if (!pet) return;
    setTrend(genTrend(pet));
    getRecentActivities(pet.id, 50).then(setActivities).catch(console.error);
  }, [pet?.id]);

  if (!pet) return null;

  const actCounts: Record<string, number> = {};
  activities.forEach((a) => { actCounts[a.type] = (actCounts[a.type] || 0) + 1; });
  const barData = Object.entries(actCounts).map(([label, value]) => ({ label, value }));

  const LINES = [
    { key: 'mood',      color: '#7c3aed', label: 'Mood'      },
    { key: 'happiness', color: '#d97706', label: 'Happiness' },
    { key: 'health',    color: '#dc2626', label: 'Health'    },
    { key: 'energy',    color: '#0284c7', label: 'Energy'    },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <motion.div {...FADE(0)}>
        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
          Analytics
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontWeight: 600, fontSize: 14 }}>
          {pet.name}'s life insights & progress
        </p>
      </motion.div>

      {/* Stat cards */}
      <motion.div {...FADE(0.05)} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { Icon: Star,      value: pet.level,    label: 'Level',   color: accent             },
          { Icon: Lightning, value: totalXP,       label: 'Total XP', color: '#d97706'         },
          { Icon: Fire,      value: `${streak}d`,  label: 'Streak',  color: '#dc2626'          },
          { Icon: Coins,     value: coins,          label: 'Coins',   color: '#ca8a04'         },
        ].map(({ Icon, value, label, color }) => (
          <div key={label} className="glass-card" style={{
            padding: '18px 16px',
          }}>
            <Icon size={22} weight="duotone" color={color} />
            <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: '-0.04em', margin: '10px 0 4px', lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Trend chart */}
      <motion.div {...FADE(0.1)} className="glass-card" style={{
        padding: '22px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendUp size={18} weight="duotone" color={accent} />
            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>7-Day Wellbeing</span>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 14 }}>
            {LINES.map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sparklines stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {LINES.map(({ key, color, label }) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color }}>
                  {trend.length > 0 ? `${trend[trend.length - 1][key]}` : '—'}
                </span>
              </div>
              <Sparkline values={trend.map((d) => d[key])} color={color} height={50} />
            </div>
          ))}
        </div>

        {/* X-axis dates */}
        {trend.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-light)' }}>
            {trend.map((d) => (
              <span key={d.date} style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>{d.date}</span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Activity frequency + radial stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Bar chart */}
        <motion.div {...FADE(0.15)} className="glass-card" style={{
          padding: '22px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <ChartBar size={18} weight="duotone" color={accent} />
            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>Activity Frequency</span>
          </div>
          {barData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
              No activities logged yet.<br />Start caring for {pet.name}!
            </div>
          ) : (
            <BarChart data={barData} color={accent} />
          )}
        </motion.div>

        {/* Radial stats */}
        <motion.div {...FADE(0.18)} className="glass-card" style={{
          padding: '22px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <PawPrint size={18} weight="duotone" color={accent} />
            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>Current Stats</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <RadialStat value={pet.health}    label="Health"    color="#dc2626" />
            <RadialStat value={pet.happiness} label="Happiness" color="#d97706" />
            <RadialStat value={pet.energy}    label="Energy"    color="#0284c7" />
            <RadialStat value={pet.mood}      label="Mood"      color="#7c3aed" />
          </div>
        </motion.div>
      </div>

      {/* Pet profile */}
      <motion.div {...FADE(0.22)} className="glass-card" style={{
        padding: '22px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Leaf size={18} weight="duotone" color={accent} />
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{pet.name}'s Profile</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Species',    value: pet.species       },
            { label: 'Personality', value: pet.personality  },
            { label: 'Evolution',  value: pet.evolutionStage },
            { label: 'Level',      value: `${pet.level}`   },
            { label: 'Total XP',   value: `${pet.xp}`      },
            { label: 'Activities', value: `${activities.length}` },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'var(--bg-surface)', borderRadius: 14, padding: '14px 16px',
              border: '1.5px solid var(--border-light)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
                {label}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
