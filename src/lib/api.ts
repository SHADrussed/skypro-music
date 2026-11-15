import type { Track } from "@/types/types";

const API = "https://webdev-music-003b5b991590.herokuapp.com";

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
