'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useToast } from '@/components/ui/ToastProvider';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import { PetAvatar } from '@/components/pet/PetAvatar';

const MINIGAMES = [
  { id: 'fetch',    name: 'Fetch',          emoji: '🎾', desc: 'Toss the ball!',               xp: 25, happiness: 20, energy: 15, duration: 2000, color: '#fb923c' },
  { id: 'puzzle',   name: 'Puzzle Time',    emoji: '🧩', desc: 'Mental stimulation',             xp: 35, happiness: 15, energy: 10, duration: 3000, color: '#a78bfa' },
  { id: 'chase',    name: 'Chase',          emoji: '🎲', desc: 'Wild chase around the room',     xp: 20, happiness: 25, energy: 25, duration: 1500, color: '#f472b6' },
  { id: 'training', name: 'Training',       emoji: '💪', desc: 'Level up your skills',           xp: 50, happiness: 10, energy: 30, duration: 4000, color: '#f59e0b' },
  { id: 'cuddle',   name: 'Cuddle Time',    emoji: '🤗', desc: 'Slow & sweet bonding',           xp: 15, happiness: 30, energy: 5,  duration: 2500, color: '#f472b6' },
  { id: 'dance',    name: 'Dance Party',    emoji: '🕺', desc: 'Groove together!',               xp: 30, happiness: 35, energy: 20, duration: 3500, color: '#22d3ee' },
];

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 160,
  y: -120 - Math.random() * 80,
  emoji: (['✨', '🎉', '⭐', '💫'] as const)[i % 4],
  dur: 0.65 + (i % 4) * 0.18,
}));

export default function PlayPage() {
  const pet         = usePetStore((s) => s.pet);
  const performAction = usePetStore((s) => s.performAction);
  const appUser     = useAuthStore((s) => s.appUser);
  const { addCoins, addTotalXP } = useGameStore();
  const { success, error: showError } = useToast();
  const theme       = useTheme();
  const [playing, setPlaying]       = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [justPlayed, setJustPlayed] = useState<string | null>(null);

  if (!pet || !appUser) return null;

  async function playGame(game: typeof MINIGAMES[0]) {
    if (playing) return;
    if (pet!.energy < game.energy) {
      showError('Too tired!', `${pet!.name} needs at least ${game.energy} energy to play.`);
      return;
    }
    setPlaying(game.id);
    setShowParticles(true);
    await new Promise((r) => setTimeout(r, game.duration));
    try {
      await performAction('play', appUser!.uid, {
        statOverrides: { happiness: game.happiness, energy: -game.energy, mood: 8 },
        xpOverride: game.xp,
      });
      addCoins(Math.floor(game.xp / 4));
      addTotalXP(game.xp);
      setJustPlayed(game.id);
      success(`${game.emoji} ${game.name} done!`, `+${game.xp} XP earned!`);
      setTimeout(() => setJustPlayed(null), 2000);
    } catch {
      showError('Oops!', 'Something went wrong, try again.');
    } finally {
      setPlaying(null);
      setTimeout(() => setShowParticles(false), 600);
    }
  }

  const activeGame = MINIGAMES.find((g) => g.id === playing);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Playtime! 🎮</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Choose a game to play with {pet.name}
        </p>
      </motion.div>

      {/* Status banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card"
        style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 24 }}
      >
        {/* Pet with particles */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <AnimatePresence>
            {showParticles && PARTICLES.map((p) => (
              <motion.div
                key={`${playing}-${p.id}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.8 }}
                transition={{ duration: p.dur, ease: 'easeOut' }}
                style={{ position: 'absolute', fontSize: 18, pointerEvents: 'none', zIndex: 10, top: '50%', left: '50%' }}
              >
                {p.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.div
            animate={playing ? { y: [0,-20,0,-20,0], rotate: [0,10,-10,5,0] } : { y: [0,-6,0] }}
            transition={{ duration: playing ? 0.5 : 3, repeat: Infinity }}
          >
            <PetAvatar pet={pet} size={80} interactive={false} />
          </motion.div>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
            {playing ? `${activeGame?.name} in progress...` : `${pet.name} wants to play!`}
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            <span>⚡ Energy <strong style={{ color: pet.energy < 30 ? '#f87171' : 'var(--text-primary)' }}>{pet.energy}</strong></span>
            <span>😊 Happiness <strong style={{ color: 'var(--text-primary)' }}>{pet.happiness}</strong></span>
          </div>
          {playing && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <div style={{ height: 3, flex: 1, borderRadius: 100, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: (activeGame?.duration ?? 2000) / 1000, ease: 'linear' }}
                  style={{ height: '100%', borderRadius: 100,
                    background: `linear-gradient(90deg, ${activeGame?.color ?? theme.primaryColor}, ${theme.accentColor})` }}
                />
              </div>
              <span style={{ fontSize: 12, color: theme.primaryColor, fontWeight: 600, whiteSpace: 'nowrap' }}>
                Playing {activeGame?.emoji}
              </span>
            </motion.div>
          )}
        </div>

        {/* Energy warning */}
        {pet.energy < 30 && !playing && (
          <div style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.2)', fontSize: 12, color: '#f87171', fontWeight: 600 }}>
            ⚠️ Low energy
          </div>
        )}
      </motion.div>

      {/* Game grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
        {MINIGAMES.map((game, i) => {
          const tooTired  = pet.energy < game.energy;
          const isPlaying = playing === game.id;
          const isDone    = justPlayed === game.id;
          const disabled  = !!playing || tooTired;
          return (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileHover={disabled ? {} : { y: -4 }}
              whileTap={disabled ? {} : { scale: 0.97 }}
              onClick={() => playGame(game)}
              disabled={disabled}
              style={{
                padding: '20px 16px',
                borderRadius: 16,
                border: `1px solid ${isPlaying ? game.color + '60' : isDone ? game.color + '40' : game.color + '18'}`,
                background: isPlaying ? `${game.color}14` : isDone ? `${game.color}0e` : 'rgba(255,255,255,0.03)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                opacity: tooTired && !playing ? 0.4 : 1,
                transition: 'all 0.2s ease',
                boxShadow: isPlaying ? `0 0 24px ${game.color}30` : 'none',
                fontFamily: 'inherit',
              }}
            >
              <motion.div
                animate={isPlaying ? { rotate: [0,360], scale: [1,1.3,1] } : isDone ? { scale: [1,1.5,1] } : {}}
                transition={{ duration: isPlaying ? 0.8 : 0.3, repeat: isPlaying ? Infinity : 0 }}
                style={{ fontSize: 36, marginBottom: 12, display: 'inline-block' }}
              >
                {isDone ? '✅' : game.emoji}
              </motion.div>

              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: 'var(--text-primary)' }}>
                {game.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.4 }}>
                {game.desc}
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: theme.primaryColor,
                  background: `${theme.primaryColor}15`, padding: '2px 8px', borderRadius: 100 }}>
                  +{game.xp} XP
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, color: tooTired ? '#f87171' : 'var(--text-muted)',
                  background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 100 }}>
                  -{game.energy} ⚡
                </span>
              </div>

              {tooTired && (
                <div style={{ marginTop: 10, fontSize: 11, color: '#f87171', fontWeight: 600 }}>
                  Need {game.energy} energy
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
