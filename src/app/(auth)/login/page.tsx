'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { loginWithEmail, loginWithGoogle } from '@/lib/firebase/auth';
import { useToast } from '@/components/ui/ToastProvider';
import { Logo } from '@/components/ui/Logo';
import type { Metadata } from 'next';

export default function LoginPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      success('Welcome back!', 'Entering your Pet Universe...');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      showError('Login failed', message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      success('Welcome!', 'Entering your Pet Universe...');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      showError('Google login failed', message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <Logo size={54} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 12 }}>
          Sign in to your universe
        </p>
      </div>

      {/* Card */}
      <div className="glass-card" style={{ padding: 32 }}>
        {/* Google Login */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            color: '#ffffff',
            fontFamily: 'inherit',
            cursor: 'pointer',
            fontSize: 15,
            fontWeight: 700,
            transition: 'all 0.2s',
            marginBottom: 24,
          }}
        >
          {googleLoading ? (
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.26 9.77A7.4 7.4 0 0 1 12 4.55c1.95 0 3.73.72 5.1 1.9l3.8-3.8A11.93 11.93 0 0 0 12 .05C7.31.05 3.26 2.7 1.28 6.62l3.98 3.15Z" />
              <path fill="#34A853" d="M16.04 18.01A7.4 7.4 0 0 1 12 19.45c-3.16 0-5.86-1.97-7.04-4.77l-3.98 3.07C2.99 21.2 7.17 23.95 12 23.95c2.96 0 5.78-.96 8.01-2.77l-3.97-3.17Z" />
              <path fill="#4A90D9" d="M20.01 21.18C22.38 18.95 23.95 15.65 23.95 12c0-.8-.08-1.57-.2-2.33H12v4.69h6.7a5.75 5.75 0 0 1-2.66 3.65l3.97 3.17Z" />
              <path fill="#FBBC05" d="M4.96 14.68A7.4 7.4 0 0 1 4.55 12c0-.93.16-1.83.41-2.68L.98 6.17A11.93 11.93 0 0 0 .05 12c0 1.93.45 3.75 1.25 5.38l3.66-2.7Z" />
            </svg>
          )}
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Mail
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-primary)',
              }}
            />
            <input
              id="login-email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-glass"
              style={{ paddingLeft: 40 }}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-primary)',
              }}
            />
            <input
              id="login-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass"
              style={{ paddingLeft: 40 }}
              required
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link
              href="/forgot-password"
              style={{ color: 'var(--color-primary)', fontSize: 13, textDecoration: 'none' }}
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="btn-primary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {loading ? (
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Sparkles size={18} />
            )}
            {loading ? 'Signing in...' : 'Enter Your Universe'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
          New here?{' '}
          <Link
            href="/signup"
            style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
          >
            Create your universe
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
