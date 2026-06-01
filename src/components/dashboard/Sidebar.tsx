'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Utensils,
  Gamepad2,
  MessageCircle,
  BarChart2,
  Users,
  Trophy,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePetStore } from '@/stores/usePetStore';
import { useGameStore } from '@/stores/useGameStore';
import { logout } from '@/lib/firebase/auth';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Universe', icon: LayoutDashboard },
  { href: '/feed', label: 'Feed & Care', icon: Utensils },
  { href: '/play', label: 'Play', icon: Gamepad2 },
  { href: '/chat', label: 'AI Chat', icon: MessageCircle },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/social', label: 'Social', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const pet = usePetStore((s) => s.pet);
  const appUser = useAuthStore((s) => s.appUser);
  const { coins, streak } = useGameStore();
  const theme = useTheme();

  async function handleLogout() {
    await logout();
  }

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 280,
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 16px',
        zIndex: 50,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '8px 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            style={{ fontSize: 32 }}
          >
            {pet?.species ? { cat: '🐱', dog: '🐶', panda: '🐼', fox: '🦊', dragon: '🐉', bunny: '🐰' }[pet.species] : '🐾'}
          </motion.span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>PetVerse</div>
            {pet && <div style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}>{pet.name}'s Universe</div>}
          </div>
        </div>
      </div>

      {/* Stats mini bar */}
      {appUser && (
        <div style={{ display: 'flex', gap: 8, padding: '16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12,
              padding: '8px 12px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 18 }}>🪙</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>{coins}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Coins</div>
          </div>
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12,
              padding: '8px 12px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 18 }}>🔥</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fb923c' }}>{streak}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Streak</div>
          </div>
          {pet && (
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 12,
                padding: '8px 12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 18 }}>⭐</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>Lv.{pet.level}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Level</div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, paddingTop: 16 }}>
        {NAV_ITEMS.map((item, i) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  marginBottom: 4,
                  background: isActive
                    ? `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.accentColor}10)`
                    : 'transparent',
                  color: isActive ? theme.primaryColor : 'rgba(255,255,255,0.55)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,
                  transition: 'all 0.2s ease',
                  border: isActive ? `1px solid ${theme.primaryColor}30` : '1px solid transparent',
                  boxShadow: isActive ? `0 0 12px ${theme.glowColor}` : 'none',
                }}
              >
                <Icon size={18} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    style={{
                      marginLeft: 'auto',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: theme.primaryColor,
                      boxShadow: `0 0 6px ${theme.primaryColor}`,
                    }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom: User + Logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
        {appUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 12px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                color: 'white',
                flexShrink: 0,
              }}
            >
              {appUser.displayName?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {appUser.displayName}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Trainer</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.15)',
            borderRadius: 12,
            color: '#f87171',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
