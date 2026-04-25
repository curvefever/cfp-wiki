"use client";

import { Button } from "../../../../components/ui/button";
import { restorePageFromDiff } from "../../server/pages.server-fns";

export function RestorePageButton({ diffID }: { diffID: string }) {
  async function onRestore() {
    const result = await restorePageFromDiff({ data: { diffID } });
    if (result.redirectTo) {
      window.location.href = result.redirectTo;
    }
  }

  return (
    <Button size="sm" className="mt-2" onClick={onRestore}>
      Restore old version
    </Button>
  );
}
