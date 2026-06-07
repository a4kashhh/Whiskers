'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Achievement, Notification } from '@/types';

export const ACHIEVEMENTS_CONFIG = [
  { type: 'first_feed', title: 'First Meal', description: 'Feed your pet for the first time', icon: '🍖', rarity: 'common' as const },
  { type: 'first_play', title: 'Playtime!', description: 'Play with your pet for the first time', icon: '🎮', rarity: 'common' as const },
  { type: 'level_5', title: 'Growing Up', description: 'Reach level 5', icon: '⭐', rarity: 'common' as const },
  { type: 'level_10', title: 'Veteran Trainer', description: 'Reach level 10', icon: '🌟', rarity: 'rare' as const },
  { type: 'level_20', title: 'Master Trainer', description: 'Reach level 20 - Pet evolves!', icon: '💫', rarity: 'epic' as const },
  { type: 'streak_7', title: 'One Week Strong', description: 'Maintain a 7-day streak', icon: '🔥', rarity: 'rare' as const },
  { type: 'streak_30', title: 'Monthly Legend', description: 'Maintain a 30-day streak', icon: '🏆', rarity: 'legendary' as const },
  { type: 'happiness_100', title: 'Pure Joy', description: 'Reach 100 happiness', icon: '😊', rarity: 'rare' as const },
  { type: 'health_100', title: 'Peak Health', description: 'Reach 100 health', icon: '💚', rarity: 'rare' as const },
  { type: 'evolution_young', title: 'Growing Pains', description: 'Evolve to Young stage', icon: '🌱', rarity: 'common' as const },
  { type: 'evolution_adult', title: 'Full Bloom', description: 'Evolve to Adult stage', icon: '🌺', rarity: 'rare' as const },
  { type: 'evolution_ancient', title: 'Ancient Being', description: 'Evolve to Ancient stage', icon: '🔮', rarity: 'legendary' as const },
  { type: 'coins_100', title: 'Coin Collector', description: 'Earn 100 coins', icon: '🪙', rarity: 'common' as const },
  { type: 'coins_1000', title: 'Rich Trainer', description: 'Earn 1000 coins total', icon: '💰', rarity: 'epic' as const },
  { type: 'chat_10', title: 'Conversationalist', description: 'Chat with your pet 10 times', icon: '💬', rarity: 'common' as const },
  { type: 'night_owl', title: 'Night Owl', description: 'Care for your pet after midnight', icon: '🦉', rarity: 'rare' as const },
];

interface GameStore {
  coins: number;
  totalXP: number;
  streak: number;
  lastStreakDate: string | null;
  unlockedAchievements: string[];
  notifications: Notification[];

  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addTotalXP: (amount: number) => void;
  updateStreak: () => void;
  unlockAchievement: (type: string, petId: string, ownerId: string) => Achievement | null;
  hasAchievement: (type: string) => boolean;
  addNotification: (notif: Omit<Notification, 'id' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      coins: 100,
      totalXP: 0,
      streak: 0,
      lastStreakDate: null,
      unlockedAchievements: [],
      notifications: [],

      addCoins: (amount) =>
        set((s) => ({ coins: s.coins + amount })),

      spendCoins: (amount) => {
        const { coins } = get();
        if (coins < amount) return false;
        set({ coins: coins - amount });
        return true;
      },

      addTotalXP: (amount) =>
        set((s) => ({ totalXP: s.totalXP + amount })),

      updateStreak: () => {
        const today = new Date().toDateString();
        const { lastStreakDate, streak } = get();
        if (lastStreakDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = lastStreakDate === yesterday ? streak + 1 : 1;
        set({ streak: newStreak, lastStreakDate: today });
      },

      unlockAchievement: (type, petId, ownerId) => {
        const { unlockedAchievements } = get();
        if (unlockedAchievements.includes(type)) return null;

        const config = ACHIEVEMENTS_CONFIG.find((a) => a.type === type);
        if (!config) return null;

        const achievement: Achievement = {
          id: `${ownerId}_${type}`,
          ownerId,
          type,
          title: config.title,
          description: config.description,
          icon: config.icon,
          unlockedAt: Date.now(),
          rarity: config.rarity,
        };

        set((s) => ({
          unlockedAchievements: [...s.unlockedAchievements, type],
        }));

        return achievement;
      },

      hasAchievement: (type) => get().unlockedAchievements.includes(type),

      addNotification: (notif) => {
        const newNotif: Notification = {
          ...notif,
          id: `notif_${Date.now()}_${Math.random()}`,
          read: false,
        };
        set((s) => ({
          notifications: [newNotif, ...s.notifications].slice(0, 50),
        }));
      },

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      clearAllNotifications: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
    }),
    { name: 'whiskers-game-store' }
  )
);
