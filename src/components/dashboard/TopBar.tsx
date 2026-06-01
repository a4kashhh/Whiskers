'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePetStore } from '@/stores/usePetStore';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import { xpForLevel } from '@/stores/usePetStore';

export function TopBar() {
  const theme = useTheme();
  const pet = usePetStore((s) => s.pet);
  const { coins, streak, notifications } = useGameStore();
  const { markNotificationRead } = useGameStore();
  const appUser = useAuthStore((s) => s.appUser);
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = notifications.filter((n) => !n.read);
  const xpMax = pet ? xpForLevel(pet.level) : 100;
  const xpPct = pet ? Math.min(100, (pet.xp / xpMax) * 100) : 0;

  return (
    <header
      style={{
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Left: Pet status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {pet && (
          <>
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: 28 }}
            >
              {{ cat: '🐱', dog: '🐶', panda: '🐼', fox: '🦊', dragon: '🐉', bunny: '🐰' }[pet.species]}
            </motion.span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{pet.name}</span>
                <span
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                    borderRadius: 100,
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  Lv.{pet.level}
                </span>
              </div>
              {/* XP Bar */}
              <div style={{ width: 160, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 100, marginTop: 4 }}>
                <motion.div
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 0.8 }}
                  style={{
                    height: '100%',
                    borderRadius: 100,
                    background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.accentColor})`,
                    boxShadow: `0 0 6px ${theme.glowColor}`,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right: Stats + Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Coins */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 100,
            padding: '6px 14px',
            fontSize: 14,
            fontWeight: 600,
            color: '#fbbf24',
          }}
        >
          🪙 {coins}
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 100,
              padding: '6px 14px',
              fontSize: 14,
              fontWeight: 600,
              color: '#fb923c',
            }}
          >
            🔥 {streak}d
          </div>
        )}

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            id="notif-bell"
            onClick={() => setNotifOpen((v) => !v)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              position: 'relative',
            }}
          >
            <Bell size={18} />
            {unread.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#f87171',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unread.length}
              </motion.div>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: 320,
                  background: 'rgba(10,5,20,0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  zIndex: 100,
                }}
              >
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, fontSize: 14 }}>
                  Notifications {unread.length > 0 && <span style={{ color: 'var(--color-primary)' }}>({unread.length})</span>}
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
                      No notifications yet ✨
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          cursor: 'pointer',
                          background: n.read ? 'transparent' : 'rgba(255,255,255,0.03)',
                          display: 'flex',
                          gap: 10,
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{n.icon || '🔔'}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{n.message}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
