"use client";

import { Button } from "../ui/button";
import { ReactNode } from "react";
import AuthenticatedOnly from "../AuthenticatedOnly";
import { useAuth } from "../../features/auth/components/AuthProvider";

interface IMenuBarProps {
  menuItems?: ReactNode;
}

export function MenuBar(props: IMenuBarProps) {
  const { logout } = useAuth();

  if (!props.menuItems) {
    return null;
  }

  return (
    <AuthenticatedOnly>
      <header>
        <div className="flex justify-center p-2 bg-bg-dark min-h-[56px]">
          <div className="flex w-full max-w-[1200px]">
            <div className="flex items-center gap-2 flex-wrap">
              {props.menuItems}
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          color="danger"
          size="sm"
          className="absolute top-3 right-3"
        >
          logout
        </Button>
      </header>
    </AuthenticatedOnly>
  );
}
