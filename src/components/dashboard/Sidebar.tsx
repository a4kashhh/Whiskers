'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  House, ForkKnife, GameController, ChatCircle,
  ChartBar, Trophy, Users, SignOut, PawPrint,
  Coins, Fire, Heart,
} from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePetStore, xpForLevel } from '@/stores/usePetStore';
import { useGameStore } from '@/stores/useGameStore';
import { logout } from '@/lib/firebase/auth';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import { Logo } from '@/components/ui/Logo';

const NAV = [
  { href: '/dashboard',    label: 'Home',         icon: House          },
  { href: '/feed',         label: 'Feed & Care',  icon: ForkKnife      },
  { href: '/play',         label: 'Play',         icon: GameController },
  { href: '/chat',         label: 'AI Chat',      icon: ChatCircle     },
  { href: '/analytics',   label: 'Analytics',    icon: ChartBar       },
  { href: '/achievements', label: 'Achievements', icon: Trophy         },
  { href: '/social',       label: 'Social',       icon: Users          },
];

const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐨', dog: '🦦', panda: '🐼', fox: '🕷️', dragon: '🧑‍🚀', bunny: '🍦',
};

export function Sidebar() {
  const pathname = usePathname();
  const pet      = usePetStore((s) => s.pet);
  const appUser  = useAuthStore((s) => s.appUser);
  const { coins, streak } = useGameStore();
  const theme    = useTheme();
  const accent   = theme.primaryColor ?? '#9B6B5A';
  const xpMax    = pet ? xpForLevel(pet.level) : 100;
  const xpPct    = pet ? Math.min(100, (pet.xp / xpMax) * 100) : 0;

  return (
    <aside className="sidebar glass-panel" style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: 248, zIndex: 50,
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
      borderRight: '1px solid rgba(0,0,0,0.05)'
    }}>

      {/* Brand */}
      <div style={{ padding: '22px 20px 16px', display: 'flex', justifyContent: 'center' }}>
        <Logo size={42} />
      </div>

      <div style={{ height: 1, background: 'var(--border-light)', margin: '0 16px 16px' }} />

      {/* Pet card */}
      {pet && (
        <div style={{
          margin: '0 14px 16px', padding: '16px',
          background: `${accent}0d`, border: `1.5px solid ${accent}20`, borderRadius: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 15, background: 'var(--bg-card)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, boxShadow: `0 3px 10px ${accent}20`,
            }}>
              {SPECIES_EMOJI[pet.species]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {pet.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'capitalize' }}>
                {pet.species} · {pet.evolutionStage}
              </div>
            </div>
            <div style={{
              background: accent, color: 'white', borderRadius: 100,
              padding: '3px 9px', fontSize: 11, fontWeight: 800,
            }}>
              Lv.{pet.level}
            </div>
          </div>

          {/* XP */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>XP</span>
              <span style={{ fontSize: 11, color: accent, fontWeight: 800 }}>{pet.xp}/{xpMax}</span>
            </div>
            <div className="progress-track" style={{ height: 6 }}>
              <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }} />
            </div>
          </div>

          {/* Stats row — real icons, no boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', gap: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <Coins size={18} weight="duotone" color="#ca8a04" style={{ display: 'block', margin: '0 auto 3px' }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ca8a04' }}>{coins}</div>
            </div>
            <div style={{ background: 'var(--border-light)' }} />
            <div style={{ textAlign: 'center' }}>
              <Fire size={18} weight="duotone" color="#dc2626" style={{ display: 'block', margin: '0 auto 3px' }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: '#dc2626' }}>{streak}d</div>
            </div>
            <div style={{ background: 'var(--border-light)' }} />
            <div style={{ textAlign: 'center' }}>
              <Heart size={18} weight="duotone" color="#e11d48" style={{ display: 'block', margin: '0 auto 3px' }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: '#e11d48' }}>{pet.health}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-muted)',
          padding: '4px 8px 10px', textTransform: 'uppercase' }}>
          Menu
        </div>

        {NAV.map((item, i) => {
          const active = pathname === item.href;
          const Icon   = item.icon;
          return (
            <motion.div key={item.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }} style={{ position: 'relative', marginBottom: 2 }}>
              <AnimatePresence>
                {active && (
                  <motion.div key="pill" layoutId="nav-pill" className="nav-active-pill"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
                )}
              </AnimatePresence>
              <Link href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                borderRadius: 12, textDecoration: 'none',
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: active ? 800 : 600, fontSize: 13.5,
                position: 'relative', zIndex: 1, transition: 'color 0.15s',
              }}>
                <Icon size={16} weight={active ? 'fill' : 'regular'}
                  color={active ? accent : 'var(--text-muted)'} />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      {appUser && (
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 11, background: accent, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: 'white',
            }}>
              {appUser.displayName?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {appUser.displayName}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Trainer</div>
            </div>
          </div>
          <button onClick={logout} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '8px', borderRadius: 10,
            background: 'rgba(225,29,72,0.06)', border: '1.5px solid rgba(225,29,72,0.14)',
            color: '#e11d48', cursor: 'pointer', fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit',
            transition: 'all 0.15s ease',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(225,29,72,0.12)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(225,29,72,0.06)'; }}
          >
            <SignOut size={14} weight="bold" /> Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
