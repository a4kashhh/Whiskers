'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Pet, PetMood } from '@/types';

interface PetAvatarProps {
  pet: Pet;
  size?: number;
  interactive?: boolean;
  onClick?: () => void;
}

const PET_EMOJI: Record<string, Record<string, string>> = {
  cat: {
    happy: '😺',
    sad: '😿',
    excited: '🙀',
    sleepy: '😴',
    hungry: '😾',
    playful: '😸',
    sick: '🤒',
    content: '😻',
  },
  dog: {
    happy: '🐕',
    sad: '🐶',
    excited: '🐩',
    sleepy: '😴',
    hungry: '🦴',
    playful: '🎾',
    sick: '🤒',
    content: '🐕‍🦺',
  },
  panda: {
    happy: '🐼',
    sad: '🐼',
    excited: '🐼',
    sleepy: '😴',
    hungry: '🎋',
    playful: '🐼',
    sick: '🤒',
    content: '🐼',
  },
  fox: {
    happy: '🦊',
    sad: '🦊',
    excited: '🦊',
    sleepy: '😴',
    hungry: '🦊',
    playful: '🦊',
    sick: '🤒',
    content: '🦊',
  },
  dragon: {
    happy: '🐉',
    sad: '🐉',
    excited: '🔥',
    sleepy: '😴',
    hungry: '🐉',
    playful: '⚡',
    sick: '🤒',
    content: '🐲',
  },
  bunny: {
    happy: '🐰',
    sad: '🐇',
    excited: '🐰',
    sleepy: '😴',
    hungry: '🥕',
    playful: '🐇',
    sick: '🤒',
    content: '🐰',
  },
};

function getMood(pet: Pet): PetMood {
  if (pet.health < 20) return 'sick';
  if (pet.energy < 20) return 'sleepy';
  if (pet.hunger < 20) return 'hungry';
  if (pet.happiness > 80) return 'happy';
  if (pet.mood > 80) return 'excited';
  if (pet.mood < 30) return 'sad';
  if (pet.energy > 70) return 'playful';
  return 'content';
}

const MOOD_ANIMATIONS: Record<PetMood, any> = {
  happy: { y: [0, -16, 0], rotate: [0, 5, -5, 0] },
  sad: { y: [0, 4, 0] },
  excited: { y: [0, -20, 0, -20, 0], rotate: [0, 8, -8, 0] },
  sleepy: { y: [0, 4, 0], opacity: [1, 0.7, 1] },
  hungry: { rotate: [0, -5, 5, -5, 0] },
  playful: { y: [0, -12, 4, -8, 0], x: [0, 4, -4, 0] },
  sick: { x: [0, -4, 4, -2, 2, 0] },
  content: { y: [0, -8, 0] },
};

const MOOD_DURATION: Record<PetMood, number> = {
  happy: 1.5,
  sad: 3,
  excited: 0.8,
  sleepy: 4,
  hungry: 1,
  playful: 1.2,
  sick: 0.4,
  content: 3,
};

export function PetAvatar({ pet, size = 120, interactive = true, onClick }: PetAvatarProps) {
  const mood = getMood(pet);
  const emoji = PET_EMOJI[pet.species]?.[mood] || PET_EMOJI[pet.species]?.happy || '🐾';

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        cursor: interactive ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {/* Ambient glow ring */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: size + 40,
          height: size + 40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--glow-color) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
      />

      {/* Pet emoji */}
      <motion.div
        key={`emoji-${mood}`}
        animate={MOOD_ANIMATIONS[mood]}
        transition={{
          duration: MOOD_DURATION[mood],
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={interactive ? { scale: 1.1 } : {}}
        whileTap={interactive ? { scale: 0.95 } : {}}
        style={{
          fontSize: size,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          userSelect: 'none',
          filter: `drop-shadow(0 0 20px var(--glow-color))`,
        }}
      >
        {emoji}
      </motion.div>

      {/* Mood badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        key={`badge-${mood}`}
        style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 100,
          padding: '3px 10px',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          textTransform: 'capitalize',
          zIndex: 1,
        }}
      >
        {mood === 'sick' ? '🤒 Sick' :
         mood === 'hungry' ? '😋 Hungry' :
         mood === 'sleepy' ? '😴 Sleepy' :
         mood === 'excited' ? '🎉 Excited' :
         mood === 'playful' ? '🎮 Playful' :
         mood === 'sad' ? '😢 Sad' :
         mood === 'happy' ? '😄 Happy' :
         '😊 Content'}
      </motion.div>

      {/* Level badge */}
      <div
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          borderRadius: '50%',
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 800,
          color: 'white',
          boxShadow: '0 2px 8px var(--glow-color)',
          zIndex: 2,
        }}
      >
        {pet.level}
      </div>
    </div>
  );
}
