'use client'
import { Button } from '../../../../components/ui/button'
import { restorePageFromDiff } from './functions/RestorePageFromDiff'

export default function RestorePageButton({ diffID }: { diffID: string }) {
  async function onRestore() {
    const result = await restorePageFromDiff({ data: { diffID } })
    if (result.redirectTo) {
      window.location.href = result.redirectTo
    }
  }

  return (
    <Button size="sm" className="mt-2" onClick={onRestore}>Restore old version</Button>
  )
}
