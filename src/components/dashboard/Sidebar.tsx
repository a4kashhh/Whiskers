'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Utensils, Gamepad2, MessageCircle,
  BarChart2, Users, Trophy, LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePetStore } from '@/stores/usePetStore';
import { useGameStore } from '@/stores/useGameStore';
import { logout } from '@/lib/firebase/auth';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import { xpForLevel } from '@/stores/usePetStore';

const NAV = [
  { href: '/dashboard',    label: 'Universe',     icon: LayoutDashboard },
  { href: '/feed',         label: 'Feed & Care',  icon: Utensils },
  { href: '/play',         label: 'Play',         icon: Gamepad2 },
  { href: '/chat',         label: 'AI Chat',      icon: MessageCircle },
  { href: '/analytics',   label: 'Analytics',    icon: BarChart2 },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/social',       label: 'Social',       icon: Users },
];

const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', panda: '🐼', fox: '🦊', dragon: '🐉', bunny: '🐰',
};

export function Sidebar() {
  const pathname = usePathname();
  const pet      = usePetStore((s) => s.pet);
  const appUser  = useAuthStore((s) => s.appUser);
  const { coins, streak } = useGameStore();
  const theme    = useTheme();

  const xpMax = pet ? xpForLevel(pet.level) : 100;
  const xpPct = pet ? Math.min(100, (pet.xp / xpMax) * 100) : 0;

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: 260,
      background: 'rgba(6,3,14,0.82)',
      backdropFilter: 'blur(32px) saturate(200%)',
      borderRight: '1px solid rgba(255,255,255,0.055)',
      display: 'flex', flexDirection: 'column',
      zIndex: 50, overflowY: 'auto',
    }}>

      {/* ── Logo ────────────────────────────────────────────────────── */}
      <div style={{ padding: '24px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
            boxShadow: `0 4px 16px ${theme.glowColor}`,
          }}>
            {pet ? SPECIES_EMOJI[pet.species] : '🐾'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Whiskers
            </div>
            {pet && (
              <div style={{ fontSize: 11, color: theme.primaryColor, fontWeight: 500, marginTop: 1 }}>
                {pet.name}&apos;s universe
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Pet XP card ─────────────────────────────────────────────── */}
      {pet && (
        <div style={{ margin: '0 12px 8px', padding: '14px 16px', borderRadius: 14,
          background: `linear-gradient(135deg, ${theme.primaryColor}18, ${theme.accentColor}0a)`,
          border: `1px solid ${theme.primaryColor}22`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>{SPECIES_EMOJI[pet.species]}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{pet.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{pet.evolutionStage} · {pet.personality}</div>
              </div>
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
              borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 700, color: 'white',
              boxShadow: `0 2px 10px ${theme.glowColor}`,
            }}>
              Lv.{pet.level}
            </div>
          </div>
          {/* XP bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>EXPERIENCE</span>
              <span style={{ fontSize: 10, color: theme.primaryColor, fontWeight: 600 }}>{pet.xp} / {xpMax} XP</span>
            </div>
            <div className="progress-track" style={{ height: 5 }}>
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 14 }}>🪙</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24' }}>{coins}</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 14 }}>🔥</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fb923c' }}>{streak}</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 14 }}>❤️</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f472b6' }}>{pet.health}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '8px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)',
          padding: '8px 8px 6px', textTransform: 'uppercase' }}>
          Navigation
        </div>
        {NAV.map((item, i) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              style={{ position: 'relative', marginBottom: 2 }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="nav-active-indicator"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Link
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px 9px 16px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  background: isActive
                    ? `linear-gradient(135deg, ${theme.primaryColor}1a, ${theme.accentColor}0d)`
                    : 'transparent',
                  color: isActive ? theme.primaryColor : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13.5,
                  letterSpacing: '-0.01em',
                  border: isActive ? `1px solid ${theme.primaryColor}20` : '1px solid transparent',
                  transition: 'all 0.18s ease',
                }}
              >
                <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* ── User footer ─────────────────────────────────────────────── */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.055)' }}>
        {appUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px 12px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white',
              boxShadow: `0 2px 12px ${theme.glowColor}`,
            }}>
              {appUser.displayName?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {appUser.displayName}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Trainer</div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 12px', borderRadius: 10,
            background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.12)',
            color: 'rgba(248,113,113,0.75)', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.13)';
            (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.07)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(248,113,113,0.75)';
          }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
