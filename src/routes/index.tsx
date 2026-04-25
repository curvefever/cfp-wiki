import { createFileRoute } from '@tanstack/react-router'
import { getWikiPageData, WikiPage } from '../app/[slug]/page'

export const Route = createFileRoute('/')({
  loader: () => getWikiPageData({ data: { slug: 'home' } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `CF Wiki | ${loaderData?.page?.title || 'Page not found'}` },
      { name: 'description', content: loaderData?.page?.description || '' },
    ],
  }),
  component: HomeRoute,
})

function HomeRoute() {
  const data = Route.useLoaderData()

  return <WikiPage data={data} pageSlug="home" />
}