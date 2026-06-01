'use client';

import { create } from 'zustand';
import {
  subscribeToPet,
  updatePet,
  logActivity,
  createPet,
  updateUser,
} from '@/lib/firebase/firestore';
import type { Pet, PetSpecies, PersonalityTrait, ActivityType } from '@/types';

// Stat decay rates per hour
const DECAY_RATES = {
  hunger: -8,  // pet gets hungrier
  energy: -5,
  sleep: -4,
  mood: -3,
  happiness: -2,
};

// XP thresholds per level
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

interface PetStore {
  pet: Pet | null;
  loading: boolean;
  unsubscribe: (() => void) | null;

  subscribeToPet: (petId: string) => void;
  unsubscribeFromPet: () => void;
  createAndAdoptPet: (
    ownerId: string,
    species: PetSpecies,
    name: string,
    personality: PersonalityTrait
  ) => Promise<string>;
  performAction: (action: ActivityType, userId: string) => Promise<void>;
  applyStatDecay: () => void;
  addXP: (amount: number, userId: string) => Promise<void>;
}

const ACTION_EFFECTS: Record<ActivityType, Partial<Pet>> = {
  feed: { hunger: 40, mood: 5, happiness: 5 },
  water: { hunger: 10, energy: 5 },
  play: { happiness: 20, energy: -15, mood: 15, xp: 15 },
  sleep: { energy: 50, sleep: 50, mood: 10 },
  clean: { health: 15, happiness: 10, mood: 5 },
  train: { xp: 30, energy: -20, mood: -5 },
  medicine: { health: 40, energy: 10 },
};

const ACTION_XP: Record<ActivityType, number> = {
  feed: 10,
  water: 5,
  play: 20,
  sleep: 15,
  clean: 12,
  train: 35,
  medicine: 20,
};

export const usePetStore = create<PetStore>()((set, get) => ({
  pet: null,
  loading: true,
  unsubscribe: null,

  subscribeToPet: (petId) => {
    const existing = get().unsubscribe;
    if (existing) existing();

    const unsub = subscribeToPet(petId, (pet) => {
      set({ pet, loading: false });
    });
    set({ unsubscribe: unsub, loading: true });
  },

  unsubscribeFromPet: () => {
    const unsub = get().unsubscribe;
    if (unsub) unsub();
    set({ pet: null, unsubscribe: null });
  },

  createAndAdoptPet: async (ownerId, species, name, personality) => {
    const now = Date.now();
    const petData: Omit<Pet, 'id'> = {
      ownerId,
      species,
      name,
      personality,
      mood: 80,
      hunger: 70,
      energy: 90,
      sleep: 80,
      health: 100,
      happiness: 85,
      xp: 0,
      level: 1,
      evolutionStage: 'baby',
      weight: 3,
      accessories: [],
      lastCareAt: now,
      lastFedAt: now,
      lastPlayedAt: now,
      lastSleptAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const { createPet: createPetDb } = await import('@/lib/firebase/firestore');
    const petId = await createPetDb(petData);
    await updateUser(ownerId, { activePetId: petId });
    return petId;
  },

  performAction: async (action, userId) => {
    const pet = get().pet;
    if (!pet) return;

    const effects = ACTION_EFFECTS[action] || {};
    const xpGained = ACTION_XP[action] || 10;
    const now = Date.now();

    // Calculate updated stats (capped 0-100)
    const updates: Partial<Pet> = {};
    for (const [key, delta] of Object.entries(effects)) {
      if (key === 'xp') continue;
      const current = (pet as unknown as Record<string, number>)[key] ?? 0;
      (updates as Record<string, number>)[key] = Math.min(100, Math.max(0, current + (delta as number)));
    }

    // Update timestamps
    if (action === 'feed' || action === 'water') updates.lastFedAt = now;
    if (action === 'play') updates.lastPlayedAt = now;
    if (action === 'sleep') updates.lastSleptAt = now;
    updates.lastCareAt = now;

    await updatePet(pet.id, updates);

    // Log the activity
    await logActivity({
      petId: pet.id,
      type: action,
      timestamp: now,
      effects: updates as Record<string, number>,
      xpGained,
      coinsGained: Math.floor(xpGained / 5),
    });

    // Add XP
    await get().addXP(xpGained, userId);
  },

  applyStatDecay: () => {
    const pet = get().pet;
    if (!pet) return;

    const now = Date.now();
    const hoursSinceCare = (now - pet.lastCareAt) / (1000 * 60 * 60);

    const updates: Partial<Pet> = {};
    for (const [stat, rate] of Object.entries(DECAY_RATES)) {
      const current = (pet as unknown as Record<string, number>)[stat] ?? 50;
      const decayed = Math.max(0, current + rate * hoursSinceCare);
      (updates as Record<string, number>)[stat] = Math.round(decayed);
    }

    updatePet(pet.id, updates).catch(console.error);
  },

  addXP: async (amount, userId) => {
    const pet = get().pet;
    if (!pet) return;

    const newXp = pet.xp + amount;
    const threshold = xpForLevel(pet.level);
    let newLevel = pet.level;
    let remainingXp = newXp;

    while (remainingXp >= xpForLevel(newLevel)) {
      remainingXp -= xpForLevel(newLevel);
      newLevel++;
    }

    // Evolution stages
    let evolutionStage = pet.evolutionStage;
    if (newLevel >= 20) evolutionStage = 'ancient';
    else if (newLevel >= 10) evolutionStage = 'adult';
    else if (newLevel >= 5) evolutionStage = 'young';

    const updates: Partial<Pet> = {
      xp: remainingXp,
      level: newLevel,
      evolutionStage,
    };

    await updatePet(pet.id, updates);

    // Update coins
    const coinsEarned = Math.floor(amount / 5);
    await updateUser(userId, {
      coins: 0, // Will be incremented properly in a real app
    });
  },
}));
