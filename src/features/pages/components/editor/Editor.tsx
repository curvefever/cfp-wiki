"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import type { Page } from "../../pages.types";
import { saveEditorChanges } from "../../server/pages.server-fns";

const ForwardRefEditor = lazy(() => import("./InitializedMDXEditor"));

export default function Editor({ page }: { page: Page }) {
  const [content, setContent] = useState(page.content);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEditor = async () => {
      await import("./InitializedMDXEditor");
      setIsEditorLoaded(true);
    };
    loadEditor();
  }, []);

  if (!isEditorLoaded) {
    return <p>Loading editor...</p>;
  }

  async function saveChanges() {
    const res = await saveEditorChanges({ data: { page, content, summary } });
    if (res && res.error) {
      setError(res.error);
      return;
    }
    if (res.redirectTo) {
      window.location.href = res.redirectTo;
    }
  }

  async function discardChanges() {
    window.location.href = `/${page.slug}`;
  }

  return (
    <div>
      <Suspense fallback={<p>Loading editor...</p>}>
        <ForwardRefEditor markdown={page.content} onChange={setContent} />
      </Suspense>

      <div className="mt-3">
        <label htmlFor="summary">
          Edit Summary (please describe what you changed)
        </label>
        <input
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      {error && <p className="text-danger">{error}</p>}

      <div className="flex mt-5 gap-3 justify-end">
        <Button color="danger" onClick={discardChanges}>
          Discard Changes
        </Button>
        <Button color="secondary" onClick={saveChanges}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
