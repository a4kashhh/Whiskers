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

// XP thresholds per level
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Helper to compute new level from XP
function computeLevel(currentLevel: number, currentXp: number, gained: number) {
  let xp = currentXp + gained;
  let level = currentLevel;
  let evolutionStage: Pet['evolutionStage'] = 'baby';

  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
  }

  if (level >= 20) evolutionStage = 'ancient';
  else if (level >= 10) evolutionStage = 'adult';
  else if (level >= 5) evolutionStage = 'young';
  else evolutionStage = 'baby';

  return { xp, level, evolutionStage };
}

const ACTION_XP: Record<ActivityType, number> = {
  feed: 10,
  water: 5,
  play: 20,
  sleep: 15,
  clean: 12,
  train: 35,
  medicine: 20,
};

interface ActionOptions {
  /** Override stat deltas (used by feed page for food-specific effects) */
  statOverrides?: Partial<Record<keyof Pet, number>>;
  /** Override XP gained */
  xpOverride?: number;
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
  performAction: (action: ActivityType, userId: string, opts?: ActionOptions) => Promise<void>;
}

// Stat deltas for each action (applied on top of food-specific overrides)
const BASE_ACTION_EFFECTS: Record<ActivityType, Partial<Record<keyof Pet, number>>> = {
  feed:     { hunger: 35, mood: 5, happiness: 5 },
  water:    { hunger: 10, energy: 5 },
  play:     { happiness: 20, energy: -15, mood: 15 },
  sleep:    { energy: 50, sleep: 50, mood: 10 },
  clean:    { health: 15, happiness: 10, mood: 5 },
  train:    { energy: -20, mood: -5 },
  medicine: { health: 40, energy: 10 },
};

const STAT_KEYS = ['hunger', 'energy', 'sleep', 'mood', 'happiness', 'health'] as const;

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
    set({ pet: null, unsubscribe: null, loading: false });
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

    const petId = await createPet(petData);
    await updateUser(ownerId, { activePetId: petId });
    return petId;
  },

  performAction: async (action, userId, opts = {}) => {
    const pet = get().pet;
    if (!pet) return;

    const xpGained = opts.xpOverride ?? ACTION_XP[action];
    const now = Date.now();

    // Merge base effects with any food/game-specific overrides
    const baseEffects = BASE_ACTION_EFFECTS[action] ?? {};
    const merged: Partial<Record<string, number>> = {
      ...baseEffects,
      ...(opts.statOverrides ?? {}),
    };

    // Compute new stat values, capped 0-100
    const statUpdates: Partial<Record<string, number>> = {};
    for (const key of STAT_KEYS) {
      if (merged[key] !== undefined) {
        const current = (pet as unknown as Record<string, number>)[key] ?? 0;
        statUpdates[key] = Math.min(100, Math.max(0, current + merged[key]!));
      }
    }

    // Compute new XP/level
    const { xp: newXp, level: newLevel, evolutionStage } = computeLevel(
      pet.level, pet.xp, xpGained
    );

    // Timestamps
    if (action === 'feed' || action === 'water') statUpdates.lastFedAt = now;
    if (action === 'play') statUpdates.lastPlayedAt = now;
    if (action === 'sleep') statUpdates.lastSleptAt = now;
    statUpdates.lastCareAt = now;

    const petUpdates = {
      ...statUpdates,
      xp: newXp,
      level: newLevel,
      evolutionStage,
    };

    // ── Optimistic local update so UI feels instant ──────────────────────
    set((s) => ({
      pet: s.pet ? { ...s.pet, ...petUpdates } : s.pet,
    }));

    // ── Batch both Firestore writes in parallel ──────────────────────────
    const coinsEarned = Math.floor(xpGained / 5);
    await Promise.all([
      updatePet(pet.id, petUpdates as Partial<Pet>),
      logActivity({
        petId: pet.id,
        type: action,
        timestamp: now,
        effects: statUpdates as Record<string, number>,
        xpGained,
        coinsGained: coinsEarned,
      }),
    ]);
  },
}));
