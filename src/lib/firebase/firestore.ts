import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore';
import { db } from './config';
import type { Pet, Activity, Achievement, ChatMessage, Notification, User } from '@/types';

// ─── Collection References ─────────────────────────────────────────────
export const usersCol = collection(db, 'users');
export const petsCol = collection(db, 'pets');
export const activitiesCol = collection(db, 'activities');
export const achievementsCol = collection(db, 'achievements');
export const chatHistoryCol = collection(db, 'chatHistory');
export const notificationsCol = collection(db, 'notifications');
export const inventoryCol = collection(db, 'inventory');

// ─── User Operations ───────────────────────────────────────────────────
export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as User) : null;
}

export async function updateUser(uid: string, data: Partial<User>) {
  return updateDoc(doc(db, 'users', uid), { ...data, updatedAt: Date.now() });
}

// ─── Pet Operations ────────────────────────────────────────────────────
export async function createPet(petData: Omit<Pet, 'id'>): Promise<string> {
  const ref = doc(petsCol);
  await setDoc(ref, { ...petData, id: ref.id });
  return ref.id;
}

export async function getPet(petId: string): Promise<Pet | null> {
  const snap = await getDoc(doc(db, 'pets', petId));
  return snap.exists() ? (snap.data() as Pet) : null;
}

export async function updatePet(petId: string, data: Partial<Pet>) {
  return updateDoc(doc(db, 'pets', petId), { ...data, updatedAt: Date.now() });
}

export function subscribeToPet(petId: string, callback: (pet: Pet) => void) {
  return onSnapshot(doc(db, 'pets', petId), (snap) => {
    if (snap.exists()) callback(snap.data() as Pet);
  });
}

// ─── Activity Operations ───────────────────────────────────────────────
export async function logActivity(activity: Omit<Activity, 'id'>): Promise<string> {
  const ref = await addDoc(activitiesCol, activity);
  return ref.id;
}

export async function getRecentActivities(petId: string, count = 10): Promise<Activity[]> {
  const q = query(
    activitiesCol,
    where('petId', '==', petId),
    orderBy('timestamp', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Activity);
}

// ─── Chat Operations ───────────────────────────────────────────────────
export async function saveChatMessage(msg: Omit<ChatMessage, 'id'>): Promise<string> {
  const ref = await addDoc(chatHistoryCol, msg);
  return ref.id;
}

export async function getChatHistory(petId: string, count = 20): Promise<ChatMessage[]> {
  const q = query(
    chatHistoryCol,
    where('petId', '==', petId),
    orderBy('timestamp', 'asc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as ChatMessage));
}

// ─── Achievement Operations ────────────────────────────────────────────
export async function unlockAchievement(achievement: Omit<Achievement, 'id'>): Promise<string> {
  const ref = await addDoc(achievementsCol, achievement);
  return ref.id;
}

export async function getUserAchievements(ownerId: string): Promise<Achievement[]> {
  const q = query(achievementsCol, where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Achievement));
}

// ─── Notifications ─────────────────────────────────────────────────────
export async function createNotification(notif: Omit<Notification, 'id'>): Promise<string> {
  const ref = await addDoc(notificationsCol, notif);
  return ref.id;
}

export function subscribeToNotifications(
  userId: string,
  callback: (notifs: Notification[]) => void
) {
  const q = query(
    notificationsCol,
    where('userId', '==', userId),
    where('read', '==', false),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Notification)));
  });
}
