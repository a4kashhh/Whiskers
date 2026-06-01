'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getUser } from '@/lib/firebase/firestore';
import type { User as AppUser } from '@/types';

interface AuthState {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setAppUser: (appUser: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  appUser: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setAppUser: (appUser) => set({ appUser }),
  setLoading: (loading) => set({ loading }),

  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        set({ user: firebaseUser });
        try {
          const appUser = await getUser(firebaseUser.uid);
          set({ appUser });
        } catch (e) {
          console.error('Failed to fetch user data:', e);
        }
      } else {
        set({ user: null, appUser: null });
      }
      set({ loading: false, initialized: true });
    });
    return unsubscribe;
  },
}));
