const ADMIN_TOKEN_STORAGE_KEY = "admin_token";

const TOAST_ERROR_RE = /ошибк|не удалось|сбой|failed|error|запрещ|обязательн/i;

export function adminToastTone(message: string): "error" | "success" {
  return TOAST_ERROR_RE.test(message) ? "error" : "success";
}

export function getAdminAuthToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)?.trim() || "";
}

export function setAdminAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function clearAdminAuthToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getAdminAuthToken();
  const headers = new Headers(init.headers);
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && typeof init.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, { cache: "no-store", ...init, headers });
}

export const ADMIN_COUNTS_REFRESH_EVENT = "admin:counts-refresh";

export function refreshAdminCounts() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ADMIN_COUNTS_REFRESH_EVENT));
}
