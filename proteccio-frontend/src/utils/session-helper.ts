import { ILocalSession } from '@/types/auth/local-session.types';

export const Proteccio_SESSION_ID = import.meta.env.VITE_Proteccio_SESSION_ID;
const storage: Storage = localStorage;

export function setSession(user: ILocalSession): void {
  storage.setItem(Proteccio_SESSION_ID, btoa(unescape(encodeURIComponent(JSON.stringify(user)))));
  // storage.setItem(Proteccio_SESSION_ID, btoa(JSON.stringify(user)));
}

export function getUserSession(): ILocalSession | null {
  try {
    return JSON.parse(atob(<string>storage.getItem(Proteccio_SESSION_ID)));
  } catch (e) {
    return null;
  }
}

export function hasSession() {
  return !!storage.getItem(Proteccio_SESSION_ID);
}

export function deleteSession() {
  storage.removeItem(Proteccio_SESSION_ID);
}

export function getRole() {
  const session = getUserSession();
  if (!session) return 'Unknown';
  if (session.owner) return 'Owner';
  if (session.is_admin) return 'Admin';
  return 'Member';
}
