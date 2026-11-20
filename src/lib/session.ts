import type { AuthTokens, User } from "./api";

export type Session = AuthTokens & { user: User };
const KEY = "skypro-session";

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (value && typeof value === "object" && "access" in value && "refresh" in value && "user" in value &&
      typeof value.access === "string" && typeof value.refresh === "string" && value.user && typeof value.user === "object") {
      return value as Session;
    }
  } catch { /* Invalid stored sessions are discarded. */ }
  return null;
}

export function writeSession(session: Session | null) {
  if (session) localStorage.setItem(KEY, JSON.stringify(session));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("skypro-session-change"));
}
