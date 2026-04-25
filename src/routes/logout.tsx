import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/logout")({
  preload: false,
  loader: () => {
    throw redirect({ to: "/" });
  },
});
