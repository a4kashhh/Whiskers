'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Coins, Fire, X } from '@phosphor-icons/react';
import { useGameStore } from '@/stores/useGameStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePetStore } from '@/stores/usePetStore';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';

export function TopBar() {
  const theme   = useTheme();
  const pet     = usePetStore((s) => s.pet);
  const { coins, streak, notifications, markNotificationRead, clearAllNotifications } = useGameStore();
  const appUser = useAuthStore((s) => s.appUser);
  const [notifOpen, setNotifOpen] = useState(false);
  const accent = theme.primaryColor ?? '#9B6B5A';
  const unread = notifications.filter((n) => !n.read);
  const name   = appUser?.displayName?.split(' ')[0] ?? 'Trainer';
  const hour   = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="topbar" style={{
      height: 'var(--topbar-height)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 40,
    }}>
      {/* Left */}
      <div>
        <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {greeting}, {name}!
        </div>
        {pet && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 1 }}>
            {pet.name} is {pet.mood > 70 ? 'feeling great today' : pet.mood > 40 ? 'doing okay' : 'needs attention'}
          </div>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Coins pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'var(--bg-card)', border: '1.5px solid rgba(202,138,4,0.22)',
          borderRadius: 100, padding: '7px 14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
        }}>
          <Coins size={16} weight="duotone" color="#ca8a04" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#ca8a04' }}>{coins.toLocaleString()}</span>
        </div>

        {/* Streak pill */}
        {streak > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'var(--bg-card)', border: '1.5px solid rgba(220,38,38,0.2)',
            borderRadius: 100, padding: '7px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
          }}>
            <Fire size={16} weight="duotone" color="#dc2626" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#dc2626' }}>{streak}d</span>
          </div>
        )}

        {/* Bell */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setNotifOpen((v) => !v)} style={{
            width: 38, height: 38, borderRadius: 11,
            background: notifOpen ? `${accent}12` : 'var(--bg-card)',
            border: `1.5px solid ${notifOpen ? accent + '30' : 'var(--border-light)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            transition: 'all 0.15s ease', position: 'relative',
          }}>
            <Bell size={16} weight={notifOpen ? 'fill' : 'regular'} color={notifOpen ? accent : 'var(--text-muted)'} />
            {unread.length > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{
                position: 'absolute', top: -3, right: -3,
                width: 16, height: 16, borderRadius: '50%',
                background: '#e11d48', color: 'white',
                fontSize: 9, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-surface)',
              }}>
                {unread.length}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, scale: 0.94, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -8 }} transition={{ duration: 0.18 }}
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                  width: 320, background: 'var(--bg-card)',
                  border: '1.5px solid var(--border-light)', borderRadius: 20,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.6)', overflow: 'hidden', zIndex: 100,
                }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>
                    Notifications {unread.length > 0 && <span style={{ color: accent }}>· {unread.length} new</span>}
                  </span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {notifications.length > 0 && (
                      <button onClick={clearAllNotifications} style={{ fontSize: 11, color: 'var(--text-muted)',
                        cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontWeight: 700 }}>
                        Clear all
                      </button>
                    )}
                    <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                      <X size={14} color="var(--text-muted)" />
                    </button>
                  </div>
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Bell size={32} weight="thin" color="var(--text-muted)" style={{ display: 'block', margin: '0 auto 10px' }} />
                      <div style={{ fontWeight: 700, fontSize: 13 }}>All caught up!</div>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div key={n.id} onClick={() => markNotificationRead(n.id)} style={{
                        padding: '12px 18px', borderBottom: '1px solid var(--border-light)',
                        cursor: 'pointer', background: n.read ? 'transparent' : `${accent}06`,
                        display: 'flex', gap: 12, alignItems: 'flex-start', transition: 'background 0.15s',
                      }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${accent}10`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bell size={16} weight="duotone" color={accent} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>{n.message}</div>
                        </div>
                        {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent, marginTop: 5, flexShrink: 0 }} />}
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
            width: 36, height: 36, borderRadius: 11, background: accent, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: 'white',
            boxShadow: `0 2px 8px ${accent}40`,
          }}>
            {appUser.displayName?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
      </div>
    </header>
  );
}
