'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useToast } from '@/components/ui/ToastProvider';
import { PetAvatar } from '@/components/pet/PetAvatar';

const MINIGAMES = [
  {
    id: 'fetch',
    name: 'Fetch',
    emoji: '🎾',
    description: 'Toss the ball and watch your pet dash!',
    xpReward: 25,
    happinessBoost: 20,
    energyCost: 15,
    duration: 2000,
    color: '#fb923c',
  },
  {
    id: 'puzzle',
    name: 'Puzzle Time',
    emoji: '🧩',
    description: 'Mental stimulation for a smart pet',
    xpReward: 35,
    happinessBoost: 15,
    energyCost: 10,
    duration: 3000,
    color: '#a78bfa',
  },
  {
    id: 'chase',
    name: 'Chase Game',
    emoji: '🎲',
    description: 'Wild and exciting chase around the room',
    xpReward: 20,
    happinessBoost: 25,
    energyCost: 25,
    duration: 1500,
    color: '#f472b6',
  },
  {
    id: 'training',
    name: 'Skills Training',
    emoji: '💪',
    description: 'Discipline training for leveling up',
    xpReward: 50,
    happinessBoost: 10,
    energyCost: 30,
    duration: 4000,
    color: '#f59e0b',
  },
  {
    id: 'cuddle',
    name: 'Cuddle Time',
    emoji: '🤗',
    description: 'Slow and sweet bonding moment',
    xpReward: 15,
    happinessBoost: 30,
    energyCost: 5,
    duration: 2500,
    color: '#f472b6',
  },
  {
    id: 'dance',
    name: 'Dance Party',
    emoji: '🕺',
    description: 'Groove together to the beat!',
    xpReward: 30,
    happinessBoost: 35,
    energyCost: 20,
    duration: 3500,
    color: '#22d3ee',
  },
];

export default function PlayPage() {
  const pet = usePetStore((s) => s.pet);
  const performAction = usePetStore((s) => s.performAction);
  const appUser = useAuthStore((s) => s.appUser);
  const { addCoins, addTotalXP } = useGameStore();
  const { success } = useToast();
  const [playing, setPlaying] = useState<string | null>(null);
  const [particles, setParticles] = useState<number[]>([]);

  if (!pet || !appUser) return null;

  async function playGame(game: typeof MINIGAMES[0]) {
    if (playing) return;
    setPlaying(game.id);
    setParticles(Array.from({ length: 8 }, (_, i) => i));

    await new Promise((r) => setTimeout(r, game.duration));
    await performAction('play', appUser!.uid);
    addCoins(Math.floor(game.xpReward / 4));
    addTotalXP(game.xpReward);

    success(`${game.emoji} ${game.name} complete!`, `+${game.xpReward} XP gained!`);
    setPlaying(null);
    setTimeout(() => setParticles([]), 500);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Playtime! 🎮</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Play games with {pet.name}</p>
      </div>

      {/* Pet + Energy */}
      <div className="glass-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ position: 'relative' }}>
          <AnimatePresence>
            {particles.map((i) => (
              <motion.div
                key={`${playing}-${i}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 150,
                  y: -100 - Math.random() * 100,
                  opacity: 0,
                  scale: 2,
                }}
                transition={{ duration: 0.8 + Math.random() * 0.5, ease: 'easeOut' }}
                style={{ position: 'absolute', fontSize: 20, pointerEvents: 'none', zIndex: 10 }}
              >
                {['✨', '🎉', '⭐'][Math.floor(Math.random() * 3)]}
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.div
            animate={playing ? { y: [0, -20, 0, -20, 0], rotate: [0, 10, -10, 10, 0] } : { y: [0, -8, 0] }}
            transition={{ duration: playing ? 0.5 : 3, repeat: Infinity }}
          >
            <PetAvatar pet={pet} size={90} interactive={false} />
          </motion.div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{pet.name} wants to play!</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Energy: {pet.energy}/100 • Happiness: {pet.happiness}/100</div>
          {playing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)' }}
            >
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⏳</motion.span>
              Playing {MINIGAMES.find(g => g.id === playing)?.name}...
            </motion.div>
          )}
        </div>
      </div>

      {/* Minigames Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {MINIGAMES.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => playGame(game)}
            disabled={!!playing || pet.energy < game.energyCost}
            style={{
              background: playing === game.id ? `${game.color}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${game.color}30`,
              borderRadius: 20,
              padding: '24px 18px',
              cursor: playing || pet.energy < game.energyCost ? 'not-allowed' : 'pointer',
              textAlign: 'center',
              opacity: pet.energy < game.energyCost && !playing ? 0.5 : 1,
              transition: 'all 0.2s ease',
              boxShadow: playing === game.id ? `0 0 20px ${game.color}40` : 'none',
            }}
          >
            <motion.div
              animate={playing === game.id ? { rotate: [0, 360], scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.6, repeat: playing === game.id ? Infinity : 0 }}
              style={{ fontSize: 44, marginBottom: 12 }}
            >
              {game.emoji}
            </motion.div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{game.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.4 }}>{game.description}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: 100 }}>+{game.xpReward}XP</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#f87171', background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: 100 }}>-{game.energyCost}⚡</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
