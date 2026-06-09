'use client';

import { motion } from 'framer-motion';
import type { Pet, PetMood } from '@/types';
import { PetSprite } from '@/components/pet-sprite';
import { getPets } from '@/lib/pets';

interface PetAvatarProps {
  pet: Pet;
  size?: number;
  interactive?: boolean;
  onClick?: () => void;
}

// Map Whiskers species to the closest Petdex sprite slugs
const SPECIES_TO_SPRITE: Record<string, string> = {
  cat:    'kebo',
  dog:    'boba',
  panda:  'pixel-panda',
  fox:    'noir-webling',
  dragon: 'cosmo',
  bunny:  'scoop',
};

function getPetSpritesheet(species: string): string | null {
  const allPets = getPets();
  const slug = SPECIES_TO_SPRITE[species] || 'boxcat';
  const found = allPets.find((p) => p.slug === slug);
  return found?.spritesheetPath ?? allPets[0]?.spritesheetPath ?? null;
}

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

// Map mood to Petdex state ids
const MOOD_TO_STATE: Record<PetMood, string> = {
  happy: 'happy',
  sad: 'sad',
  excited: 'jump',
  sleepy: 'sleep',
  hungry: 'hungry',
  playful: 'jump',
  sick: 'sick',
  content: 'idle',
};

export function PetAvatar({ pet, size = 120, interactive = true, onClick }: PetAvatarProps) {
  const mood = getMood(pet);
  const spritesheet = getPetSpritesheet(pet.species);
  const stateId = (MOOD_TO_STATE[mood] || 'idle') as any;

  // Since PetSprite standard height is 208px, calculate scale to match target size
  const scale = size / 208;

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

      {/* Pet Animated Sprite */}
      <motion.div
        key={`sprite-${mood}`}
        animate={MOOD_ANIMATIONS[mood]}
        transition={{
          duration: MOOD_DURATION[mood],
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={interactive ? { scale: 1.1 } : {}}
        whileTap={interactive ? { scale: 0.95 } : {}}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          userSelect: 'none',
        }}
      >
        {spritesheet ? (
          <PetSprite
            src={spritesheet}
            state={stateId}
            scale={scale}
            label={`${pet.name} the ${pet.species}`}
          />
        ) : (
          <span style={{ fontSize: size }}>🐾</span>
        )}
      </motion.div>

      {/* Mood badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        key={`badge-${mood}`}
        className="glass-panel"
        style={{
          border: '1px solid rgba(0,0,0,0.08)',
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
