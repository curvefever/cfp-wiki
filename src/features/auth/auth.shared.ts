export const ACCESS_TOKEN_KEY = "accessTokenBugs";
export const HIGHLIGHT_USERNAME_STORAGE_KEY = "cf-highlight-username";
export const PID_STORAGE_KEY = "pid";
export const NET_VERSION = -1;
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export enum Role {
  ADMIN = 0,
  ARTIST = 6,
  DEVELOPER = 9,
  MOD = 1,
  LEAD_MOD = 8,
  TOUR_HOST = 20,
  LEAD_TOUR_HOST = 21,
  SOCIAL_MEDIA_MANAGER = 25,
  LEAD_SOCIAL_MEDIA = 26,
  CONTENT_CREATOR = 27,
  MARKETING_MANAGER = 28,
}

export const WIKI_EDIT_ROLE_IDS = [
  Role.ADMIN,
  Role.ARTIST,
  Role.DEVELOPER,
  Role.MOD,
  Role.LEAD_MOD,
  Role.TOUR_HOST,
  Role.LEAD_TOUR_HOST,
  Role.SOCIAL_MEDIA_MANAGER,
  Role.LEAD_SOCIAL_MEDIA,
  Role.CONTENT_CREATOR,
  Role.MARKETING_MANAGER,
] as const;

export type AuthSnapshot = {
  roles: number[];
  status: "anonymous" | "authenticated";
  username: string;
};

export type AuthRolePayload = {
  accountRoles?: unknown;
  roleIDs?: unknown;
  roles?: unknown;
};

function normalizeRoleID(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return undefined;
    }

    const parsedValue = Number.parseInt(trimmedValue, 10);
    return Number.isInteger(parsedValue) ? parsedValue : undefined;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return normalizeRoleID(
      record.role ?? record.id ?? record.roleID ?? record.type,
    );
  }

  return undefined;
}

function normalizeRoleList(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const uniqueRoles = new Set<number>();

  for (const role of value) {
    const normalizedRoleID = normalizeRoleID(role);
    if (normalizedRoleID !== undefined) {
      uniqueRoles.add(normalizedRoleID);
    }
  }

  return Array.from(uniqueRoles);
}

export function extractAccountRoles(payload: AuthRolePayload): number[] {
  const uniqueRoles = new Set<number>();

  for (const roles of [payload.accountRoles, payload.roles, payload.roleIDs]) {
    for (const role of normalizeRoleList(roles)) {
      uniqueRoles.add(role);
    }
  }

  return Array.from(uniqueRoles);
}

export function getUsernameFromPayload(
  username: string | undefined,
  fallbackUsername = "",
): string {
  const trimmedUsername = username?.trim();
  if (trimmedUsername) {
    return trimmedUsername;
  }

  return fallbackUsername.trim();
}

export function getAnonymousAuthSnapshot(): AuthSnapshot {
  return {
    roles: [],
    status: "anonymous",
    username: "",
  };
}

export function isAuthenticated(snapshot: AuthSnapshot): boolean {
  return snapshot.status === "authenticated";
}

export function canEditWiki(roles: readonly number[]): boolean {
  return roles.some((role) =>
    WIKI_EDIT_ROLE_IDS.includes(role as (typeof WIKI_EDIT_ROLE_IDS)[number]),
  );
}

export function canAuthEditWiki(snapshot: AuthSnapshot): boolean {
  return isAuthenticated(snapshot) && canEditWiki(snapshot.roles);
}