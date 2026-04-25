import { createFileRoute } from '@tanstack/react-router'
import { getWikiPageData, WikiPage } from '../app/[slug]/page'

export const Route = createFileRoute('/$slug')({
  loader: ({ params }) => getWikiPageData({ data: { slug: params.slug } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `CF Wiki | ${loaderData?.page?.title || 'Page not found'}` },
      { name: 'description', content: loaderData?.page?.description || '' },
    ],
  }),
  component: WikiRoute,
})

function WikiRoute() {
  const { slug } = Route.useParams()
  const data = Route.useLoaderData()

  return <WikiPage data={data} pageSlug={slug} />
}