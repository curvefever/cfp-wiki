import { getRequest } from "@tanstack/react-start/server";
import {
  ACCESS_TOKEN_KEY,
  HIGHLIGHT_USERNAME_STORAGE_KEY,
  PID_STORAGE_KEY,
  getAnonymousAuthSnapshot,
  type AuthSnapshot,
} from "../auth.shared";
import { readCookieValue } from "../../../lib/cookies";
import { getCachedAuthSnapshot } from "./auth-session-cache.server";

export async function getRequestAuthSnapshot(): Promise<AuthSnapshot> {
  const request = getRequest();
  const cookieHeader = request.headers.get("cookie") || undefined;
  const token = readCookieValue(cookieHeader, ACCESS_TOKEN_KEY);

  if (!token) {
    return getAnonymousAuthSnapshot();
  }

  const pid = readCookieValue(cookieHeader, PID_STORAGE_KEY) || "";
  const cachedUsername =
    readCookieValue(cookieHeader, HIGHLIGHT_USERNAME_STORAGE_KEY) || "";

  try {
    return await getCachedAuthSnapshot({
      fallbackUsername: cachedUsername,
      hostname: new URL(request.url).hostname,
      pid,
      request,
      token,
    });
  } catch (_error) {
    return getAnonymousAuthSnapshot();
  }
}
