"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  ACCESS_TOKEN_KEY,
  HIGHLIGHT_USERNAME_STORAGE_KEY,
  NET_VERSION,
  PID_STORAGE_KEY,
  SESSION_MAX_AGE_SECONDS,
  canEditWiki,
  extractAccountRoles,
  getAnonymousAuthSnapshot,
  getUsernameFromPayload,
  type AuthRolePayload,
  type AuthSnapshot,
} from "../auth.shared";
import { postJSON } from "../../../lib/api";
import { readCookieValue } from "../../../lib/cookies";

type AuthStatus = "checking" | "anonymous" | "submitting" | "authenticated";

type LoginResponse = AuthRolePayload & {
  ticket?: string;
  accessToken?: string;
  username: string;
};

type LoginTokenResponse = AuthRolePayload & {
  ticket?: string;
  accessToken?: string;
  username?: string;
};

type AuthContextValue = {
  canEditWiki: boolean;
  error: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  roles: number[];
  status: AuthStatus;
  username: string;
  clearError: () => void;
};

type AuthState = {
  error: string | null;
  roles: number[];
  status: AuthStatus;
  username: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getCookieValue(name: string): string | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  return readCookieValue(document.cookie, name);
}

function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (!isBrowser()) {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
}

function removeCookie(name: string): void {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function getAccessTokenFromPayload(payload: {
  accessToken?: string;
}): string | undefined {
  const accessToken = payload.accessToken?.trim();
  return accessToken || undefined;
}

function saveAccessToken(accessToken: string): void {
  if (!isBrowser()) {
    return;
  }

  writeCookie(ACCESS_TOKEN_KEY, accessToken, SESSION_MAX_AGE_SECONDS);
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

function clearAccessToken(): void {
  if (!isBrowser()) {
    return;
  }

  removeCookie(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function getAccessToken(): string | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  const tokenFromCookie = getCookieValue(ACCESS_TOKEN_KEY);
  return (
    tokenFromCookie ||
    window.localStorage.getItem(ACCESS_TOKEN_KEY) ||
    undefined
  );
}

function saveCachedUsername(username: string): void {
  if (!isBrowser()) {
    return;
  }

  const trimmedUsername = username.trim();
  if (!trimmedUsername) {
    removeCookie(HIGHLIGHT_USERNAME_STORAGE_KEY);
    window.localStorage.removeItem(HIGHLIGHT_USERNAME_STORAGE_KEY);
    return;
  }

  writeCookie(
    HIGHLIGHT_USERNAME_STORAGE_KEY,
    trimmedUsername,
    SESSION_MAX_AGE_SECONDS,
  );
  window.localStorage.setItem(HIGHLIGHT_USERNAME_STORAGE_KEY, trimmedUsername);
}

function getCachedUsername(): string {
  if (!isBrowser()) {
    return "";
  }

  return window.localStorage.getItem(HIGHLIGHT_USERNAME_STORAGE_KEY) || "";
}

function clearCachedUsername(): void {
  if (!isBrowser()) {
    return;
  }

  removeCookie(HIGHLIGHT_USERNAME_STORAGE_KEY);
  window.localStorage.removeItem(HIGHLIGHT_USERNAME_STORAGE_KEY);
}

function getPID(): string {
  if (!isBrowser()) {
    return "";
  }

  const existingPID = window.localStorage.getItem(PID_STORAGE_KEY);
  if (existingPID) {
    writeCookie(PID_STORAGE_KEY, existingPID, SESSION_MAX_AGE_SECONDS);
    return existingPID;
  }

  const pid =
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(PID_STORAGE_KEY, pid);
  writeCookie(PID_STORAGE_KEY, pid, SESSION_MAX_AGE_SECONDS);
  return pid;
}

function getDeviceID(): string {
  return getPID();
}

function getDeviceData(): string {
  if (!isBrowser()) {
    return "";
  }

  return JSON.stringify({
    language: window.navigator.language,
    platform: window.navigator.platform,
    userAgent: window.navigator.userAgent,
  });
}

async function requestLogin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return postJSON<LoginResponse>(
    "/auth/login",
    {
      email,
      password,
      version: NET_VERSION,
      deviceID: getDeviceID(),
      deviceData: getDeviceData(),
      pid: getPID(),
    },
    {
      hostname: isBrowser() ? window.location.hostname : undefined,
    },
  );
}

async function requestTokenLogin(token: string): Promise<LoginTokenResponse> {
  return postJSON<LoginTokenResponse>(
    "/auth/logintoken",
    {
      token,
      version: NET_VERSION,
      deviceID: getDeviceID(),
      deviceData: getDeviceData(),
      pid: getPID(),
    },
    {
      hostname: isBrowser() ? window.location.hostname : undefined,
    },
  );
}

function createAuthState(snapshot: AuthSnapshot): AuthState {
  return {
    error: null,
    roles: snapshot.roles,
    status: snapshot.status,
    username: snapshot.username,
  };
}

export function AuthProvider({
  children,
  initialAuth = getAnonymousAuthSnapshot(),
}: PropsWithChildren<{ initialAuth?: AuthSnapshot }>) {
  const [state, setState] = useState<AuthState>(() =>
    createAuthState(initialAuth),
  );

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    if (initialAuth.status === "authenticated") {
      if (initialAuth.username) {
        saveCachedUsername(initialAuth.username);
        return;
      }

      const cachedUsername = getCachedUsername();
      if (cachedUsername) {
        setState((currentState) => ({
          ...currentState,
          username: cachedUsername,
        }));
      }
      return;
    }

    let cancelled = false;

    async function restoreSession() {
      const token = getAccessToken();
      const cachedUsername = getCachedUsername();

      if (!token) {
        if (!cancelled) {
          setState({
            error: null,
            ...getAnonymousAuthSnapshot(),
          });
        }
        return;
      }

      if (!cancelled) {
        setState({
          error: null,
          roles: [],
          status: "checking",
          username: cachedUsername,
        });
      }

      try {
        const response = await requestTokenLogin(token);
        const roles = extractAccountRoles(response);
        const username = getUsernameFromPayload(
          response.username,
          cachedUsername,
        );
        const nextAccessToken = getAccessTokenFromPayload(response);

        if (nextAccessToken) {
          saveAccessToken(nextAccessToken);
        } else {
          saveAccessToken(token);
        }

        saveCachedUsername(username);

        if (!cancelled) {
          setState({
            error: null,
            roles,
            status: "authenticated",
            username,
          });
        }
      } catch (_error) {
        clearAccessToken();
        clearCachedUsername();

        if (!cancelled) {
          setState({
            error: null,
            ...getAnonymousAuthSnapshot(),
          });
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [initialAuth.status, initialAuth.username]);

  async function login(email: string, password: string): Promise<boolean> {
    setState((currentState) => ({
      ...currentState,
      error: null,
      status: "submitting",
    }));

    try {
      const response = await requestLogin(email, password);
      const roles = extractAccountRoles(response);
      const username = getUsernameFromPayload(response.username);
      const nextAccessToken = getAccessTokenFromPayload(response);

      if (!nextAccessToken) {
        throw new Error("Unable to sign in.");
      }

      saveAccessToken(nextAccessToken);
      saveCachedUsername(username);
      setState({
        error: null,
        roles,
        status: "authenticated",
        username,
      });
      return true;
    } catch (error) {
      clearAccessToken();
      clearCachedUsername();
      setState({
        error: error instanceof Error ? error.message : "Unable to sign in.",
        ...getAnonymousAuthSnapshot(),
      });
      return false;
    }
  }

  function logout(): void {
    clearAccessToken();
    clearCachedUsername();
    setState({
      error: null,
      ...getAnonymousAuthSnapshot(),
    });
  }

  function clearError(): void {
    setState((currentState) => ({
      ...currentState,
      error: null,
    }));
  }

  return (
    <AuthContext.Provider
      value={{
        canEditWiki:
          state.status === "authenticated" && canEditWiki(state.roles),
        clearError,
        error: state.error,
        isLoggedIn: state.status === "authenticated",
        login,
        logout,
        roles: state.roles,
        status: state.status,
        username: state.username,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
