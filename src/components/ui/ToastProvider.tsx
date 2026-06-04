'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Star } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'achievement';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  icon?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  achievement: (title: string, icon?: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const toast: Toast = { ...opts, id };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => removeToast(id), opts.duration ?? 4000);
  }, [removeToast]);

  const ctx: ToastContextValue = {
    toast: addToast,
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message }),
    achievement: (title, icon, message) =>
      addToast({ type: 'achievement', title, icon, message, duration: 6000 }),
  };

  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <AlertCircle size={18} className="text-red-400" />,
    info: <Info size={18} style={{ color: 'var(--color-primary)' }} />,
    achievement: <Star size={18} className="text-yellow-400" />,
  };

  const borderColors: Record<ToastType, string> = {
    success: '#4ade80',
    error: '#f87171',
    info: 'var(--color-primary)',
    achievement: '#fbbf24',
  };

  const ACCENT: Record<ToastType, string> = {
    success: '#4ade80', error: '#f87171', info: 'var(--color-primary)', achievement: '#fbbf24',
  };
  const BG: Record<ToastType, string> = {
    success: 'rgba(74,222,128,0.1)', error: 'rgba(248,113,113,0.1)',
    info: 'rgba(192,132,252,0.1)', achievement: 'rgba(251,191,36,0.1)',
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="toast-container">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 48, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.9 }}
              transition={{ type: 'spring', damping: 22, stiffness: 350 }}
              style={{
                background: 'rgba(10,5,24,0.92)',
                backdropFilter: 'blur(32px)',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderLeft: `3px solid ${ACCENT[t.type]}`,
                borderRadius: 14,
                padding: '14px 16px',
                boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)`,
                minWidth: 300, maxWidth: 380,
                pointerEvents: 'all',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {/* Icon */}
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: BG[t.type],
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>
                  {t.icon ? t.icon : icons[t.type]}
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    {t.title}
                  </div>
                  {t.message && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>
                      {t.message}
                    </div>
                  )}
                </div>
                {/* Close */}
                <button
                  onClick={() => removeToast(t.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, flexShrink: 0, fontFamily: 'inherit' }}
                >
                  <X size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
