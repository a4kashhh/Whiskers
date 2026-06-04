'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePetStore } from '@/stores/usePetStore';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';

const MOOD_LABEL: Record<string, string> = {
  happy: '😄 Happy', excited: '🎉 Excited', content: '😊 Content',
  sad: '😢 Sad', sleepy: '😴 Sleepy', hungry: '😋 Hungry',
  sick: '🤒 Sick', playful: '🎮 Playful',
};

export function TopBar() {
  const theme   = useTheme();
  const pet     = usePetStore((s) => s.pet);
  const { coins, streak, notifications, markNotificationRead, clearAllNotifications } = useGameStore();
  const appUser = useAuthStore((s) => s.appUser);
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = notifications.filter((n) => !n.read);

  return (
    <header style={{
      height: 'var(--topbar-height)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px',
      background: 'rgba(6,3,14,0.6)',
      backdropFilter: 'blur(24px) saturate(180%)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'sticky', top: 0, zIndex: 40, flexShrink: 0,
    }}>

      {/* ── Left: greeting ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {pet ? (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {pet.name}&apos;s Universe
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
              {pet.mood > 70 ? '😄 Great mood' : pet.mood > 40 ? '😊 Doing okay' : '😟 Needs attention'}
              {' · '}
              <span style={{ color: theme.primaryColor }}>Level {pet.level}</span>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            Welcome back{appUser?.displayName ? `, ${appUser.displayName.split(' ')[0]}` : ''}! 👋
          </div>
        )}
      </div>

      {/* ── Right: stats + notifs ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Coins pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)',
          borderRadius: 100, padding: '6px 14px',
          fontSize: 13, fontWeight: 600, color: '#fbbf24',
        }}>
          🪙 {coins.toLocaleString()}
        </div>

        {/* Streak pill */}
        {streak > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.18)',
            borderRadius: 100, padding: '6px 14px',
            fontSize: 13, fontWeight: 600, color: '#fb923c',
          }}>
            🔥 {streak}d
          </div>
        )}

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            id="notif-bell"
            onClick={() => setNotifOpen((v) => !v)}
            style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: notifOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative',
              transition: 'all 0.18s ease',
            }}
          >
            <Bell size={15} strokeWidth={1.8} />
            {unread.length > 0 && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f87171, #ef4444)',
                  fontSize: 9, fontWeight: 700, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #0d0117',
                }}
              >
                {unread.length}
              </motion.div>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -8 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                  width: 340,
                  background: 'rgba(10,5,24,0.96)',
                  backdropFilter: 'blur(32px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset',
                  overflow: 'hidden', zIndex: 100,
                }}
              >
                <div style={{
                  padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.055)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>
                    Notifications {unread.length > 0 && (
                      <span style={{ color: theme.primaryColor }}>· {unread.length} new</span>
                    )}
                  </span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer',
                        background: 'none', border: 'none', fontFamily: 'inherit' }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
                      All caught up!
                    </div>
                  ) : (
                    notifications.slice(0, 12).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        style={{
                          padding: '12px 18px',
                          borderBottom: '1px solid rgba(255,255,255,0.035)',
                          cursor: 'pointer',
                          background: n.read ? 'transparent' : 'rgba(255,255,255,0.025)',
                          display: 'flex', gap: 12, alignItems: 'flex-start',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                          background: 'rgba(255,255,255,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16,
                        }}>
                          {n.icon || '🔔'}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{n.message}</div>
                        </div>
                        {!n.read && (
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primaryColor, flexShrink: 0, marginTop: 5 }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        {appUser && (
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: 'white',
            boxShadow: `0 2px 12px ${theme.glowColor}`,
            cursor: 'default',
          }}>
            {appUser.displayName?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>
    </header>
  );
}
