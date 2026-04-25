import { createFileRoute, redirect } from '@tanstack/react-router'
import PageHistoryDiff, { getPageHistoryDiffData } from '../../../app/[slug]/history/[id]/page'

export const Route = createFileRoute('/$slug/history/$id')({
  loader: async ({ params }) => {
    const data = await getPageHistoryDiffData({ data: { id: params.id } })
    if (!data.history) {
      throw redirect({ to: '/$slug/history', params: { slug: params.slug } })
    }

    return data
  },
  component: HistoryDiffRoute,
})

function HistoryDiffRoute() {
  const data = Route.useLoaderData()

  return <PageHistoryDiff data={data} />
}