'use client'
import { Button } from '../../../../components/ui/button'
import { restorePageFromDiff } from './functions/RestorePageFromDiff'

export default function RestorePageButton({ diffID }: { diffID: string }) {
  return (
    <Button size="sm" className="mt-2" onClick={() => restorePageFromDiff(diffID)}>Restore old version</Button>
  )
}
