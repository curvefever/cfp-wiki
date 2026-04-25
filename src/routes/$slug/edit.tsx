import { createFileRoute } from '@tanstack/react-router'
import EditPage, { getEditPageData } from '../../app/[slug]/edit/page'

export const Route = createFileRoute('/$slug/edit')({
  loader: ({ params }) => getEditPageData({ data: { slug: params.slug } }),
  component: EditPageRoute,
})

function EditPageRoute() {
  const { slug } = Route.useParams()
  const data = Route.useLoaderData()

  return <EditPage data={data} pageSlug={slug} />
}