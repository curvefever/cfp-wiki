import {
  NET_VERSION,
  extractAccountRoles,
  getUsernameFromPayload,
  type AuthRolePayload,
  type AuthSnapshot,
} from "../auth.shared";
import { postJSON } from "../../../lib/api";

const AUTH_SESSION_CACHE_TTL_MS = 5 * 60 * 1000;

type AuthTokenResponse = AuthRolePayload & {
  accessToken?: string;
  ticket?: string;
  username?: string;
};

type CachedAuthSession = {
  expiresAt: number;
  promise?: Promise<AuthSnapshot>;
  snapshot?: AuthSnapshot;
};

type AuthSessionCacheState = typeof globalThis & {
  __authSessionCache?: Map<string, CachedAuthSession>;
};

type AuthSessionRequest = {
  fallbackUsername?: string;
  hostname: string;
  pid: string;
  request: Request;
  token: string;
};

function getAuthSessionCache(): Map<string, CachedAuthSession> {
  const state = globalThis as AuthSessionCacheState;

  if (!state.__authSessionCache) {
    state.__authSessionCache = new Map<string, CachedAuthSession>();
  }

  return state.__authSessionCache;
}

function getRequestDeviceData(request: Request): string {
  return JSON.stringify({
    language: request.headers.get("accept-language")?.split(",")[0]?.trim() || "",
    platform: request.headers.get("sec-ch-ua-platform")?.replaceAll('"', "") || "",
    userAgent: request.headers.get("user-agent") || "",
  });
}

function cloneAuthSnapshot(snapshot: AuthSnapshot): AuthSnapshot {
  return {
    roles: [...snapshot.roles],
    status: snapshot.status,
    username: snapshot.username,
  };
}

function withFallbackUsername(
  snapshot: AuthSnapshot,
  fallbackUsername: string | undefined,
): AuthSnapshot {
  const username = getUsernameFromPayload(snapshot.username, fallbackUsername);

  if (username === snapshot.username) {
    return cloneAuthSnapshot(snapshot);
  }

  return {
    ...cloneAuthSnapshot(snapshot),
    username,
  };
}

async function fetchAuthSnapshot({
  fallbackUsername,
  hostname,
  pid,
  request,
  token,
}: AuthSessionRequest): Promise<AuthSnapshot> {
  const response = await postJSON<AuthTokenResponse>(
    "/auth/logintoken",
    {
      token,
      version: NET_VERSION,
      deviceID: pid,
      deviceData: getRequestDeviceData(request),
      pid,
    },
    {
      hostname,
    },
  );

  return {
    roles: extractAccountRoles(response),
    status: "authenticated",
    username: getUsernameFromPayload(response.username, fallbackUsername),
  };
}

export async function getCachedAuthSnapshot(
  sessionRequest: AuthSessionRequest,
): Promise<AuthSnapshot> {
  const now = Date.now();
  const cache = getAuthSessionCache();
  const cachedSession = cache.get(sessionRequest.token);

  if (cachedSession && cachedSession.expiresAt > now) {
    if (cachedSession.snapshot) {
      return withFallbackUsername(
        cachedSession.snapshot,
        sessionRequest.fallbackUsername,
      );
    }

    if (cachedSession.promise) {
      const snapshot = await cachedSession.promise;
      return withFallbackUsername(snapshot, sessionRequest.fallbackUsername);
    }
  } else if (cachedSession) {
    cache.delete(sessionRequest.token);
  }

  const expiresAt = now + AUTH_SESSION_CACHE_TTL_MS;
  const promise = fetchAuthSnapshot(sessionRequest);
  cache.set(sessionRequest.token, { expiresAt, promise });

  try {
    const snapshot = await promise;
    cache.set(sessionRequest.token, {
      expiresAt,
      snapshot: cloneAuthSnapshot(snapshot),
    });
    return withFallbackUsername(snapshot, sessionRequest.fallbackUsername);
  } catch (error) {
    cache.delete(sessionRequest.token);
    throw error;
  }
}