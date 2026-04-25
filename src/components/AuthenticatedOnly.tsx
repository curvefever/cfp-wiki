"use client";

import { type ReactNode } from "react";
import { useAuth } from "../features/auth/components/AuthProvider";

export default function AuthenticatedOnly({
  children,
}: {
  children: ReactNode;
}) {
  const { canEditWiki } = useAuth();

  if (!canEditWiki) {
    return null;
  }

  return <>{children}</>;
}
