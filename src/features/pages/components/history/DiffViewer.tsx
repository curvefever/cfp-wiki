"use client";

import ReactDiffViewer from "react-diff-viewer-continued";

export function DiffViewer({
  newValue,
  oldValue,
}: {
  oldValue: string;
  newValue: string;
}) {
  return (
    <ReactDiffViewer
      oldValue={oldValue}
      newValue={newValue}
      splitView={true}
      useDarkTheme={true}
    />
  );
}
