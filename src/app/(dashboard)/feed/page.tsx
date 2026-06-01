'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useToast } from '@/components/ui/ToastProvider';
import { PetAvatar } from '@/components/pet/PetAvatar';
import { StatMeter } from '@/components/pet/StatMeter';
import type { ActivityType, FoodItem } from '@/types';

const FOOD_ITEMS: FoodItem[] = [
  { id: 'kibble', name: 'Regular Kibble', type: 'regular', emoji: '🍞', effects: { hunger: 25, energy: 5 }, xpReward: 8, cost: 0, description: 'Standard balanced meal' },
  { id: 'premium_meal', name: 'Premium Meal', type: 'premium', emoji: '🥩', effects: { hunger: 40, mood: 10, happiness: 8 }, xpReward: 15, cost: 20, description: 'Gourmet dining experience' },
  { id: 'treat', name: 'Sweet Treat', type: 'treat', emoji: '🍪', effects: { mood: 20, happiness: 15, hunger: 10 }, xpReward: 12, cost: 10, description: 'A delicious reward' },
  { id: 'fish', name: 'Fresh Fish', type: 'premium', emoji: '🐟', effects: { hunger: 35, health: 10, energy: 8 }, xpReward: 18, cost: 25, description: 'Rich in omega-3 goodness' },
  { id: 'vitamin', name: 'Vitamin Boost', type: 'vitamin', emoji: '💊', effects: { health: 25, energy: 15 }, xpReward: 20, cost: 30, description: 'Boost health and vitality' },
  { id: 'berry', name: 'Magic Berries', type: 'premium', emoji: '🫐', effects: { mood: 15, happiness: 20 }, xpReward: 25, cost: 35, description: 'Magical happiness boost' },
  { id: 'apple', name: 'Fresh Apple', type: 'regular', emoji: '🍎', effects: { hunger: 15, health: 8 }, xpReward: 5, cost: 0, description: 'A healthy snack' },
  { id: 'royal_feast', name: 'Royal Feast', type: 'premium', emoji: '🍽️', effects: { hunger: 60, mood: 25, happiness: 25, health: 15 }, xpReward: 40, cost: 80, description: 'The ultimate meal fit for royalty' },
];

export default function FeedPage() {
  const pet = usePetStore((s) => s.pet);
  const performAction = usePetStore((s) => s.performAction);
  const appUser = useAuthStore((s) => s.appUser);
  const { coins, spendCoins, addCoins } = useGameStore();
  const { success, error: showError } = useToast();
  const [feeding, setFeeding] = useState<string | null>(null);
  const [lastFed, setLastFed] = useState<string | null>(null);

  if (!pet || !appUser) return null;

  async function handleFeed(food: FoodItem) {
    if (feeding) return;
    if (food.cost > 0 && coins < food.cost) {
      showError('Not enough coins!', `You need ${food.cost} coins for this.`);
      return;
    }
    setFeeding(food.id);
    try {
      if (food.cost > 0) spendCoins(food.cost);
      await performAction('feed', appUser!.uid);
      addCoins(Math.floor(food.xpReward / 3));
      setLastFed(food.id);
      success(`${food.emoji} ${pet?.name} loved it!`, food.description);
      setTimeout(() => setLastFed(null), 2000);
    } catch (e) {
      showError('Feeding failed', 'Please try again');
    } finally {
      setFeeding(null);
    }
  }

  const typeColors: Record<string, string> = {
    regular: '#6b7280',
    premium: '#a78bfa',
    treat: '#f472b6',
    vitamin: '#34d399',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Feed & Care</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Nourish {pet.name} with love</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Pet Card */}
        <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <AnimatePresence>
            {lastFed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{ position: 'absolute', zIndex: 10, fontSize: 40 }}
              >
                😋
              </motion.div>
            )}
          </AnimatePresence>
          <PetAvatar pet={pet} size={100} interactive={false} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <StatMeter label="Hunger" value={pet.hunger} emoji="🍖" />
            <StatMeter label="Energy" value={pet.energy} emoji="⚡" />
            <StatMeter label="Mood" value={pet.mood} emoji="😊" />
            <StatMeter label="Health" value={pet.health} emoji="❤️" />
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
            🪙 {coins} coins available
          </div>
        </div>

        {/* Food Grid */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {FOOD_ITEMS.map((food, i) => (
              <motion.button
                key={food.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleFeed(food)}
                disabled={!!feeding || (food.cost > 0 && coins < food.cost)}
                style={{
                  background: feeding === food.id ? `${typeColors[food.type]}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${typeColors[food.type]}30`,
                  borderRadius: 18,
                  padding: '20px 16px',
                  cursor: feeding || (food.cost > 0 && coins < food.cost) ? 'not-allowed' : 'pointer',
                  textAlign: 'center',
                  opacity: food.cost > 0 && coins < food.cost ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <motion.div
                  animate={feeding === food.id ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.4, repeat: feeding === food.id ? Infinity : 0 }}
                  style={{ fontSize: 40, marginBottom: 10 }}
                >
                  {food.emoji}
                </motion.div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>{food.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>{food.description}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: typeColors[food.type], background: `${typeColors[food.type]}20`, padding: '2px 8px', borderRadius: 100 }}>
                    {food.type}
                  </span>
                  {food.cost > 0 ? (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#fbbf24' }}>🪙{food.cost}</span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#4ade80' }}>Free</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-primary)', marginTop: 6 }}>+{food.xpReward} XP</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
