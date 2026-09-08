import { retrieveLaunchParams } from "@telegram-apps/sdk";

export type ResolvedTelegramUser = {
  id: string;
  firstName?: string;
  startParam?: string;
};

/**
 * Resolve the current Telegram user from every available source:
 *   1. @telegram-apps/sdk `retrieveLaunchParams()` (parses the URL hash)
 *   2. `window.Telegram.WebApp.initDataUnsafe` (injected by telegram-web-app.js)
 *
 * Returns null when running outside Telegram or before the launch data is
 * available.
 */
export function resolveTelegramUser(): ResolvedTelegramUser | null {
  if (typeof window === "undefined") return null;

  let id: string | number | undefined;
  let firstName: string | undefined;
  let startParam: string | undefined;

  try {
    const lp = retrieveLaunchParams();
    id = lp.initData?.user?.id;
    firstName = lp.initData?.user?.firstName;
    startParam = lp.startParam;
  } catch {
    // Not inside Telegram, or launch params not available yet.
  }

  if (id == null) {
    const unsafe = (window as any)?.Telegram?.WebApp?.initDataUnsafe;
    if (unsafe?.user?.id != null) {
      id = unsafe.user.id;
      firstName = firstName ?? unsafe.user.first_name;
      startParam = startParam ?? unsafe.start_param;
    }
  }

  if (id == null) return null;
  return { id: String(id), firstName, startParam };
}

const INVALID_IDS = new Set(["", "null", "undefined"]);

/**
 * Best-effort synchronous resolution of the current user id, preferring the
 * persisted auth token, then the URL `?id=`, then live Telegram launch data.
 * Returns null if none is available yet.
 */
export function getCurrentUserId(searchId?: string | null): string | null {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("authToken");
    if (token && !INVALID_IDS.has(token)) return token;
  }
  if (searchId && !INVALID_IDS.has(searchId)) return searchId;
  return resolveTelegramUser()?.id ?? null;
}
