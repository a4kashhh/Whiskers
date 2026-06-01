// Pet species types
export type PetSpecies = 'cat' | 'dog' | 'panda' | 'fox' | 'dragon' | 'bunny';

// Pet personality traits
export type PersonalityTrait =
  | 'lazy'
  | 'energetic'
  | 'intelligent'
  | 'mischievous'
  | 'loyal'
  | 'introverted'
  | 'curious';

// Evolution stages
export type EvolutionStage = 'baby' | 'young' | 'adult' | 'ancient';

// Pet mood
export type PetMood = 'happy' | 'sad' | 'excited' | 'sleepy' | 'hungry' | 'playful' | 'sick' | 'content';

// Activity types
export type ActivityType = 'feed' | 'play' | 'sleep' | 'clean' | 'train' | 'water' | 'medicine';

// Food types
export type FoodType = 'regular' | 'premium' | 'treat' | 'vitamin' | 'water';

export interface Pet {
  id: string;
  ownerId: string;
  species: PetSpecies;
  name: string;
  personality: PersonalityTrait;
  // Stats (0-100)
  mood: number;
  hunger: number;
  energy: number;
  sleep: number;
  health: number;
  happiness: number;
  // Growth
  xp: number;
  level: number;
  evolutionStage: EvolutionStage;
  weight: number;
  // Accessories
  accessories: string[];
  // Timestamps
  lastCareAt: number; // unix timestamp
  lastFedAt: number;
  lastPlayedAt: number;
  lastSleptAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  coins: number;
  streak: number;
  lastActiveAt: number;
  createdAt: number;
  activePetId: string | null;
}

export interface Activity {
  id: string;
  petId: string;
  type: ActivityType;
  timestamp: number;
  effects: Record<string, number>; // e.g. { mood: +10, hunger: -20 }
  xpGained: number;
  coinsGained: number;
}

export interface Achievement {
  id: string;
  ownerId: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ChatMessage {
  id: string;
  petId: string;
  role: 'user' | 'pet';
  content: string;
  timestamp: number;
  mood?: PetMood;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'hunger' | 'sleep' | 'evolution' | 'streak' | 'achievement' | 'general';
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  icon?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  type: FoodType;
  emoji: string;
  effects: {
    hunger?: number;
    energy?: number;
    mood?: number;
    happiness?: number;
    health?: number;
    weight?: number;
  };
  xpReward: number;
  cost: number;
  description: string;
}

export interface InventoryItem {
  id: string;
  ownerId: string;
  itemType: string;
  itemName: string;
  quantity: number;
  acquiredAt: number;
}

// Theme types
export interface PetTheme {
  species: PetSpecies;
  name: string;
  emoji: string;
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgGradientFrom: string;
  bgGradientTo: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  glowColor: string;
  particleColor: string;
  // Typography
  fontFamily: string;
  // Particles
  particleType: string;
  // Personality description
  description: string;
  personalities: PersonalityTrait[];
}
