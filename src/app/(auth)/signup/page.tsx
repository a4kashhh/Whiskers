'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { signupWithEmail, loginWithGoogle } from '@/lib/firebase/auth';
import { useToast } from '@/components/ui/ToastProvider';

export default function SignupPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (step === 1) {
      if (displayName.trim().length < 2) return;
      setStep(2);
      return;
    }
    if (password !== confirmPassword) {
      showError('Passwords do not match', 'Please check and try again');
      return;
    }
    setLoading(true);
    try {
      await signupWithEmail(email, password, displayName);
      success('Welcome to Whiskers! 🎉', 'Let\'s adopt your first pet!');
      router.push('/onboarding');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      showError('Signup failed', message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      success('Welcome!', 'Let\'s set up your universe!');
      router.push('/onboarding');
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
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: 48 }}
        >
          ✨
        </motion.div>
        <h1 className="gradient-text" style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>
          Create Universe
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>
          Step {step} of 2
        </p>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
        {[1, 2].map((s) => (
          <div
            key={s}
            style={{
              width: s === step ? 32 : 8,
              height: 8,
              borderRadius: 100,
              background: s <= step ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      <div className="glass-card" style={{ padding: 32 }}>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }}
                />
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Your trainer name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-glass"
                  style={{ paddingLeft: 40 }}
                  required
                  minLength={2}
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                {googleLoading ? <Loader2 size={16} /> : '🔑'} Quick signup with Google
              </button>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.99 }}
                className="btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                Continue <ArrowRight size={16} />
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass"
                  style={{ paddingLeft: 40 }}
                  required
                  autoFocus
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
                <input
                  id="signup-password"
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass"
                  style={{ paddingLeft: 40 }}
                  required
                  minLength={6}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
                <input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-glass"
                  style={{ paddingLeft: 40 }}
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.99 }}
                className="btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={18} />}
                {loading ? 'Creating Universe...' : 'Create My Universe'}
              </motion.button>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }}
              >
                ← Back
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
          Already have a universe?{' '}
          <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}
