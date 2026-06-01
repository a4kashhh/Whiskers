'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePetStore } from '@/stores/usePetStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const appUser = useAuthStore((s) => s.appUser);
  const subscribeToPet = usePetStore((s) => s.subscribeToPet);
  const unsubscribeFromPet = usePetStore((s) => s.unsubscribeFromPet);

  useEffect(() => {
    const unsubscribeAuth = initializeAuth();
    return () => unsubscribeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (appUser?.activePetId) {
      subscribeToPet(appUser.activePetId);
    } else {
      unsubscribeFromPet();
    }
  }, [appUser?.activePetId, subscribeToPet, unsubscribeFromPet]);

  return <>{children}</>;
}
