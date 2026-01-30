const STORAGE_KEY = 'mezecim_admin_token';

type JwtPayload = {
  sub: string;
  exp: number;
};

function base64UrlEncode(obj: object) {
  const json = JSON.stringify(obj);
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode<T>(value: string): T | null {
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(padded);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function createDummyJwt(username: string, ttlMinutes = 120) {
  const header = { alg: 'none', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + ttlMinutes * 60;
  const payload: JwtPayload = { sub: username, exp };
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.`;
}

export function saveToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, token);
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function isTokenValid(token: string | null) {
  if (!token) return false;
  const [, payload] = token.split('.');
  if (!payload) return false;
  const data = base64UrlDecode<JwtPayload>(payload);
  if (!data?.exp) return false;
  return data.exp > Math.floor(Date.now() / 1000);
}
