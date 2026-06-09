'use client';

import { motion } from 'framer-motion';

interface StatMeterProps {
  label: string;
  value: number;
  emoji: string;
  color?: string;
  showValue?: boolean;
}

function getColor(value: number): string {
  if (value > 70) return '#4ade80'; // green
  if (value > 40) return '#fbbf24'; // yellow
  return '#f87171'; // red
}

export function StatMeter({ label, value, emoji, color, showValue = true }: StatMeterProps) {
  const barColor = color || getColor(value);
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="stat-meter">
      <div className="stat-meter-label">
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16 }}>{emoji}</span>
          <span>{label}</span>
        </span>
        {showValue && (
          <motion.span
            key={Math.round(clamped)}
            initial={{ scale: 1.3, color: barColor }}
            animate={{ scale: 1, color: 'var(--text-secondary)' }}
            transition={{ duration: 0.3 }}
            style={{ fontWeight: 700, fontSize: 13 }}
          >
            {Math.round(clamped)}
          </motion.span>
        )}
      </div>
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          style={{
            background: `linear-gradient(90deg, ${barColor}aa, ${barColor})`,
            boxShadow: `0 0 8px ${barColor}66`,
          }}
        />
      </div>
    </div>
  );
}

// XP Progress Bar
interface XPBarProps {
  xp: number;
  level: number;
  maxXP: number;
}

export function XPBar({ xp, level, maxXP }: XPBarProps) {
  const percent = Math.min(100, (xp / maxXP) * 100);

  return (
    <div className="xp-bar-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
          ⭐ Experience
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {xp} / {maxXP} XP
        </span>
      </div>
      <div
        style={{
          position: 'relative',
          height: 10,
          background: 'rgba(0,0,0,0.07)',
          borderRadius: 100,
          overflow: 'visible',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            height: '100%',
            borderRadius: 100,
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
            boxShadow: '0 0 10px var(--glow-color)',
            position: 'relative',
          }}
        >
          {percent > 5 && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                right: -1,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--color-accent)',
                boxShadow: '0 0 8px var(--color-accent)',
              }}
            />
          )}
        </motion.div>
      </div>
      <div className="xp-level-badge">Lv.{level}</div>
    </div>
  );
}

// Circular stat (for overview)
interface CircularStatProps {
  value: number;
  label: string;
  emoji: string;
  size?: number;
}

export function CircularStat({ value, label, emoji, size = 80 }: CircularStatProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;
  const barColor = getColor(clamped);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.07)"
            strokeWidth={6}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={barColor}
            strokeWidth={6}
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
              filter: `drop-shadow(0 0 4px ${barColor})`,
            }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.28,
          }}
        >
          {emoji}
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: barColor }}>
          {Math.round(clamped)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {label}
        </div>
      </div>
    </div>
  );
}
