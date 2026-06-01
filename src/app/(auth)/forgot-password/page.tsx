'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { resetPassword } from '@/lib/firebase/auth';
import { useToast } from '@/components/ui/ToastProvider';

export default function ForgotPasswordPage() {
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      success('Reset email sent!', 'Check your inbox.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      showError('Error', message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }} style={{ fontSize: 48 }}>🔐</motion.div>
        <h1 className="gradient-text" style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>Reset Password</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>We'll send you a reset link</p>
      </div>
      <div className="glass-card" style={{ padding: 32 }}>
        {sent ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: 24 }}>
            <CheckCircle size={48} style={{ color: '#4ade80', margin: '0 auto 16px' }} />
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Email sent!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>Check your inbox and follow the link to reset your password.</p>
            <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Back to Login</Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
              <input id="reset-email" type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-glass" style={{ paddingLeft: 40 }} required autoFocus />
            </div>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.99 }} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Mail size={18} />}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 14, textDecoration: 'none', marginTop: 4 }}>
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </form>
        )}
      </div>
    </motion.div>
  );
}
