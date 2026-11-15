import type { Track } from "@/types/types";
import { readSession, writeSession } from "./session";

const API = process.env.SKYPRO_API_BASE ?? "https://webdev-music-003b5b991590.herokuapp.com";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API}${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...init?.headers },
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Не удалось связаться с сервером. Проверьте подключение.");
  }
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
      ? payload.message
      : response.status === 401 ? "Неверная почта или пароль." : `Ошибка сервера (${response.status}).`;
    throw new ApiError(message, response.status);
  }
  return payload as T;
}

export type AuthTokens = { access: string; refresh: string };
export type User = { username: string; email: string; _id: number };

export async function register(email: string, password: string, username: string) {
  return request<{ success: boolean; message: string; result: User }>("/user/signup/", {
    method: "POST", body: JSON.stringify({ email, password, username }),
  });
}

export async function login(email: string, password: string) {
  const user = await request<User>("/user/login/", {
    method: "POST", body: JSON.stringify({ email, password }),
  });
  const tokens = await request<AuthTokens>("/user/token/", {
    method: "POST", body: JSON.stringify({ email, password }),
  });
  return { user, ...tokens };
}

export async function getTracks(): Promise<Track[]> {
  const result = await request<{ success: boolean; data: Array<Track & { staredUser?: number[] }> }>("/catalog/track/all/");
  return result.data.map(({ staredUser, ...track }) => ({ ...track, logo: typeof track.logo === "string" ? track.logo : null, stared_user: staredUser ?? [] }));
}

export type Selection = { _id: number; name?: string; items: number[] };
export async function getSelections(): Promise<Selection[]> {
  const result = await request<{ data: Selection[] }>("/catalog/selection/all");
  return result.data;
}

export async function getSelection(id: string) {
  const result = await request<{ data: Selection }>(`/catalog/selection/${encodeURIComponent(id)}/`);
  return result.data;
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccess(refresh: string): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = request<{ access: string }>("/user/token/refresh/", {
      method: "POST", body: JSON.stringify({ refresh }),
    }).then(result => {
      const current = readSession();
      if (!current || current.refresh !== refresh || !result.access) throw new ApiError("Сессия завершена.", 401);
      writeSession({ ...current, access: result.access });
      return result.access;
    }).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function withReAuth<T>(path: string, init: RequestInit = {}): Promise<T> {
  const initial = readSession();
  if (!initial) throw new ApiError("Войдите, чтобы продолжить.", 401);
  const authorized = (access: string) => request<T>(path, {
    ...init, headers: { ...init.headers, Authorization: `Bearer ${access}` },
  });
  try {
    return await authorized(initial.access);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
  }
  const current = readSession();
  if (!current || current.refresh !== initial.refresh) throw new ApiError("Сессия завершена.", 401);
  let access: string;
  try {
    access = current.access !== initial.access ? current.access : await refreshAccess(current.refresh);
  } catch (error) {
    if (readSession()?.refresh === initial.refresh) writeSession(null);
    throw error;
  }
  try { return await authorized(access); }
  catch (error) {
    if (error instanceof ApiError && error.status === 401 && readSession()?.refresh === initial.refresh) writeSession(null);
    throw error;
  }
}

export async function getFavorites(): Promise<Track[]> {
  const result = await withReAuth<{ data: Array<Track & { staredUser?: number[] }> }>("/catalog/track/favorite/all/");
  return result.data.map(({ staredUser, ...track }) => ({ ...track, logo: typeof track.logo === "string" ? track.logo : null, stared_user: staredUser ?? [] }));
}

export async function setFavorite(id: number, liked: boolean) {
  await withReAuth<unknown>(`/catalog/track/${id}/favorite/`, { method: liked ? "POST" : "DELETE" });
}
