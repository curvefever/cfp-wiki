import { createFileRoute } from '@tanstack/react-router'
import PageHistory, { getPageHistoryData } from '../../app/[slug]/history/page'

export const Route = createFileRoute('/$slug/history')({
  loader: ({ params }) => getPageHistoryData({ data: { slug: params.slug } }),
  component: HistoryRoute,
})

function HistoryRoute() {
  const { slug } = Route.useParams()
  const data = Route.useLoaderData()

  return <PageHistory data={data} pageSlug={slug} />
}