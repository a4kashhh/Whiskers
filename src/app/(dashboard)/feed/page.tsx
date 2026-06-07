'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useToast } from '@/components/ui/ToastProvider';
import { PetAvatar } from '@/components/pet/PetAvatar';
import { StatMeter } from '@/components/pet/StatMeter';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import type { FoodItem } from '@/types';

const FOOD_ITEMS: FoodItem[] = [
  { id: 'kibble',      name: 'Kibble',        type: 'regular', emoji: '🍞', effects: { hunger: 25, energy: 5 },                          xpReward: 8,  cost: 0,  description: 'Standard balanced meal' },
  { id: 'apple',       name: 'Fresh Apple',   type: 'regular', emoji: '🍎', effects: { hunger: 15, health: 8 },                          xpReward: 5,  cost: 0,  description: 'A healthy daily snack' },
  { id: 'treat',       name: 'Sweet Treat',   type: 'treat',   emoji: '🍪', effects: { mood: 20, happiness: 15, hunger: 10 },            xpReward: 12, cost: 10, description: 'A delicious reward' },
  { id: 'fish',        name: 'Fresh Fish',    type: 'premium', emoji: '🐟', effects: { hunger: 35, health: 10, energy: 8 },              xpReward: 18, cost: 25, description: 'Rich in omega-3 goodness' },
  { id: 'premium',     name: 'Premium Meal',  type: 'premium', emoji: '🥩', effects: { hunger: 40, mood: 10, happiness: 8 },            xpReward: 15, cost: 20, description: 'Gourmet dining experience' },
  { id: 'vitamin',     name: 'Vitamins',      type: 'vitamin', emoji: '💊', effects: { health: 25, energy: 15 },                        xpReward: 20, cost: 30, description: 'Boost health & vitality' },
  { id: 'berry',       name: 'Magic Berries', type: 'premium', emoji: '🫐', effects: { mood: 15, happiness: 20 },                       xpReward: 25, cost: 35, description: 'Magical happiness boost' },
  { id: 'royal_feast', name: 'Royal Feast',   type: 'premium', emoji: '🍽️', effects: { hunger: 60, mood: 25, happiness: 25, health: 15 }, xpReward: 40, cost: 80, description: 'The ultimate royal meal' },
];

const TYPE_META: Record<string, { color: string; bg: string; label: string }> = {
  regular: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  label: 'Regular' },
  premium: { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',  label: 'Premium' },
  treat:   { color: '#f472b6', bg: 'rgba(244,114,182,0.1)',  label: 'Treat'   },
  vitamin: { color: '#34d399', bg: 'rgba(52,211,153,0.1)',   label: 'Vitamin' },
};

function EffectPill({ label, value }: { label: string; value: number }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
      background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)',
    }}>
      +{value} {label}
    </span>
  );
}

export default function FeedPage() {
  const pet         = usePetStore((s) => s.pet);
  const performAction = usePetStore((s) => s.performAction);
  const appUser     = useAuthStore((s) => s.appUser);
  const { coins, spendCoins, addCoins } = useGameStore();
  const { success, error: showError } = useToast();
  const theme       = useTheme();
  const [feeding, setFeeding]   = useState<string | null>(null);
  const [lastFed, setLastFed]   = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  if (!pet || !appUser) return null;

  async function handleFeed(food: FoodItem) {
    if (feeding) return;
    if (food.cost > 0 && coins < food.cost) {
      showError('Not enough coins!', `You need ${food.cost - coins} more coins.`);
      return;
    }
    setFeeding(food.id);
    try {
      if (food.cost > 0) spendCoins(food.cost);
      await performAction('feed', appUser!.uid, {
        statOverrides: food.effects as Partial<Record<string, number>>,
        xpOverride: food.xpReward,
      });
      addCoins(Math.floor(food.xpReward / 3));
      setLastFed(food.id);
      success(`${food.emoji} Yum!`, `${pet?.name} loved the ${food.name}!`);
      setTimeout(() => setLastFed(null), 2000);
    } catch {
      showError('Feeding failed', 'Please try again');
    } finally {
      setFeeding(null);
    }
  }

  const selectedFood = FOOD_ITEMS.find((f) => f.id === selected);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Feed & Care 🍽️</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Nourish {pet.name} with the perfect meal
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, alignItems: 'start' }}>

        {/* Pet status panel */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card"
          style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
        >
          {/* Avatar with reaction */}
          <div style={{ position: 'relative' }}>
            <AnimatePresence>
              {lastFed && (
                <motion.div
                  initial={{ scale: 0, y: 10, opacity: 0 }}
                  animate={{ scale: 1, y: -10, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 28, zIndex: 10 }}
                >
                  😋
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div animate={lastFed ? { y: [0, -8, 0] } : {}} transition={{ duration: 0.5 }}>
              <PetAvatar pet={pet} size={90} interactive={false} />
            </motion.div>
          </div>

          {/* Hunger bar highlight */}
          <div style={{ width: '100%', padding: '12px 14px', borderRadius: 12,
            background: pet.hunger < 30 ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${pet.hunger < 30 ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.06)'}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: pet.hunger < 30 ? '#f87171' : 'var(--text-secondary)' }}>
              {pet.hunger < 30 ? '⚠️ Hungry!' : '🍽️ Stats'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <StatMeter label="Hunger"    value={pet.hunger}    emoji="🍖" />
              <StatMeter label="Energy"    value={pet.energy}    emoji="⚡" />
              <StatMeter label="Mood"      value={pet.mood}      emoji="😊" />
              <StatMeter label="Health"    value={pet.health}    emoji="❤️" />
            </div>
          </div>

          {/* Coins */}
          <div style={{
            width: '100%', padding: '10px 14px', borderRadius: 10,
            background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Available coins</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fbbf24' }}>🪙 {coins}</span>
          </div>

          {/* Selected food preview */}
          <AnimatePresence>
            {selectedFood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ width: '100%', padding: '14px', borderRadius: 12,
                  background: `${TYPE_META[selectedFood.type].bg}`,
                  border: `1px solid ${TYPE_META[selectedFood.type].color}30`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 28 }}>{selectedFood.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{selectedFood.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedFood.description}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                  {Object.entries(selectedFood.effects).map(([k, v]) => <EffectPill key={k} label={k} value={v} />)}
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleFeed(selectedFood)}
                  disabled={!!feeding || (selectedFood.cost > 0 && coins < selectedFood.cost)}
                  className="btn-primary"
                  style={{ width: '100%', opacity: selectedFood.cost > 0 && coins < selectedFood.cost ? 0.5 : 1 }}
                >
                  {feeding === selectedFood.id ? '⏳ Feeding...' :
                   selectedFood.cost > 0 && coins < selectedFood.cost ? '🪙 Not enough coins' :
                   `Feed ${selectedFood.emoji} ${selectedFood.cost > 0 ? `(${selectedFood.cost} coins)` : '(Free)'}`}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Food grid */}
        <div>
          {/* Type filter row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {FOOD_ITEMS.map((food, i) => {
              const meta     = TYPE_META[food.type];
              const canAfford = food.cost === 0 || coins >= food.cost;
              const isFeeding = feeding === food.id;
              const isSelected = selected === food.id;
              return (
                <motion.button
                  key={food.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  whileHover={feeding ? {} : { y: -3 }}
                  whileTap={feeding ? {} : { scale: 0.97 }}
                  onClick={() => setSelected(isSelected ? null : food.id)}
                  disabled={!!feeding}
                  style={{
                    padding: '18px 14px',
                    borderRadius: 14,
                    border: `1px solid ${isSelected ? meta.color + '60' : meta.color + '20'}`,
                    background: isSelected ? meta.bg : isFeeding ? meta.bg : 'rgba(255,255,255,0.03)',
                    cursor: feeding ? 'wait' : 'pointer',
                    textAlign: 'left',
                    opacity: !canAfford && !isSelected ? 0.4 : 1,
                    transition: 'all 0.18s ease',
                    fontFamily: 'inherit',
                    boxShadow: isSelected ? `0 0 20px ${meta.color}20` : 'none',
                    position: 'relative',
                  }}
                >
                  {/* Free badge */}
                  {food.cost === 0 && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      fontSize: 9, fontWeight: 700, color: '#4ade80',
                      background: 'rgba(74,222,128,0.12)', padding: '2px 6px', borderRadius: 100,
                    }}>FREE</div>
                  )}

                  <motion.div
                    animate={isFeeding ? { rotate: [0,-15,15,0], scale: [1,1.3,1] } : {}}
                    transition={{ duration: 0.4, repeat: isFeeding ? Infinity : 0 }}
                    style={{ fontSize: 32, marginBottom: 10 }}
                  >
                    {food.emoji}
                  </motion.div>

                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3, color: 'var(--text-primary)' }}>
                    {food.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.4 }}>
                    {food.description}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: meta.color, background: meta.bg, padding: '2px 7px', borderRadius: 100 }}>
                      {meta.label}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: food.cost === 0 ? '#4ade80' : '#fbbf24' }}>
                      {food.cost === 0 ? 'Free' : `🪙${food.cost}`}
                    </span>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 11, color: theme.primaryColor, fontWeight: 600 }}>
                    +{food.xpReward} XP
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
