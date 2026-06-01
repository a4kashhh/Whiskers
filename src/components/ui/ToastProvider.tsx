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

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="toast-container" style={{ zIndex: 9999 }}>
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="toast"
              style={{
                borderLeft: `3px solid ${borderColors[toast.type]}`,
                pointerEvents: 'all',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {toast.icon ? (
                  <span style={{ fontSize: 20 }}>{toast.icon}</span>
                ) : (
                  icons[toast.type]
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                    {toast.title}
                  </div>
                  {toast.message && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {toast.message}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: 2,
                  }}
                >
                  <X size={14} />
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
