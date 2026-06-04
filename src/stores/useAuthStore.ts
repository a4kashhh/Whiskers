'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
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
    let unsubscribeAppUser: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        set({ user: firebaseUser });
        if (unsubscribeAppUser) unsubscribeAppUser();
        unsubscribeAppUser = onSnapshot(doc(db, 'users', firebaseUser.uid), (snap) => {
          if (snap.exists()) {
            set({ appUser: snap.data() as AppUser });
          } else {
            set({ appUser: null });
          }
          set({ loading: false, initialized: true });
        });
      } else {
        if (unsubscribeAppUser) unsubscribeAppUser();
        set({ user: null, appUser: null, loading: false, initialized: true });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeAppUser) unsubscribeAppUser();
    };
  },
}));
